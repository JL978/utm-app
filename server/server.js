import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
import randId from "./utils/id";
import Links from "../db/Models/Links";
import db from "../db/config";

const koaBody = require("koa-body");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;

db.authenticate()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  router.get("(.*)", verifyRequest(), async (ctx, next) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    next();
  });

  router.post("/links", koaBody(), async (ctx) => {
    const body = ctx.request.body;
    const { resource_link, paramsArr, resource_type, store_id } = body;
    const newID = randId(12);
    let data = {
      link_id: newID,
      store_id,
      resource_type,
      resource_link,
      discount_code: null,
    };
    paramsArr.map(({ param, input }) => {
      data = { ...data, [param]: input };
    });

    console.log(data);

    Links.create(data)
      .then(() => console.log("success"))
      .catch((error) => console.log(error));

    ctx.res.statusCode = 200;
  });

  router.get("/stuff", async (ctx) => {
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// link_id VARCHAR(16) PRIMARY KEY,
// store_id VARCHAR(100),
// resource_type VARCHAR(50),
// resource_link VARCHAR(255),
// utm_source VARCHAR(100),
// utm_medium VARCHAR(100),
// utm_campaign VARCHAR(100),
// utm_content VARCHAR(100),
// utm_term VARCHAR(100),
// discount_code VARCHAR(50)
