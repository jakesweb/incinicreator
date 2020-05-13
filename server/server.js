require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const cors = require("cors");
const fetch = require("node-fetch");
const mongoose = require("mongoose");

const corsOptions = {
  origin: "http://localhost:8080"
};

const app = express();
app.use(bodyParser());
app.use(cookieParser());
app.use(cors(corsOptions));

// auth0 configuration
const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE
};

// define middleware to validate bearer tokens
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 50,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SiteConfigSchema = new Schema({
  id: ObjectId,
  user: { type: String, unique: true },
  title: String,
  customSub: String,
  webMonetization: String,
  content: String,
  published: Boolean,
  template: { type: Boolean, default: false }
});

const SiteConfig = mongoose.model("SiteConfig", SiteConfigSchema);

mongoose.connect(process.env.MONGO_URI);

app.post("/api/setsiteconfig", checkJwt, (req, res) => {
  console.log(req.user.sub);

  const siteConfig = new SiteConfig({
    user: req.user.sub,
    title: req.body.title,
    customSub: req.body.customSub,
    webMonetization: req.body.webMonetization,
    content: req.body.content
  });

  siteConfig.save(error => {
    if (!error) {
      res.send(JSON.stringify({ message: "success" }));
    } else {
      res.send(JSON.stringify({ error: error }));
    }
  });
});

app.get("/api/getsiteconfig", checkJwt, (req, res) => {
  SiteConfig.findOne({ user: req.user.sub }, (error, site) => {
    if (site) {
      res.setHeader("Content-Type", "application/json");
      res.send(
        JSON.stringify({
          email: site.user,
          title: site.title,
          customSub: site.customSub,
          webMonetization: site.webMonetization,
          content: site.config,
          published: site.published
        })
      );
    } else {
      res.send("ERROR");
    }
  });
});

app.listen(process.env.PORT || 3000);
