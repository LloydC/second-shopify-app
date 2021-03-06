// App imports/dependencies
require('isomorphic-fetch'); //necessary for the koa-shopify-auth package
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

// Add your routing middleware and koa server
app.prepare().then(() => {
    const server = new Koa();
    server.use(session(server));
    server.keys = [SHOPIFY_API_SECRET_KEY];
// Add the createShopifyAuth and verifyRequest middleware
    server.use(
        createShopifyAuth({
          apiKey: SHOPIFY_API_KEY,
          secret: SHOPIFY_API_SECRET_KEY,
          scopes: ['read_products', 'write_products'],
          afterAuth(ctx) {
            const { shop, accessToken } = ctx.session;
            ctx.cookies.set('shopOrigin', shop, { httpOnly: false });// set the shopOrigin in cookies from the user's session
            ctx.redirect('/');
          },
        }),
      );
      server.use(graphQLProxy({version: ApiVersion.October19}))
      server.use(verifyRequest());
      server.use(async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return
      });

      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
  });