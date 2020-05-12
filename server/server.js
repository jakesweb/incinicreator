require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser());
app.use(cookieParser());
app.use(cors());

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
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SiteConfig = new Schema({
  id: ObjectId,
  user: String,
  title: String,
  subdomain: String,
  webMonetization: String,
  content: String,
  published: Boolean
});

//mongoose.connect(process.env.MONGO_URI);

app.get("/api/getsiteconfig", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated"
  });
});

app.listen(process.env.PORT || 3000);
