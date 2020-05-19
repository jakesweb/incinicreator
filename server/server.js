require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const cors = require("cors");
const mongoose = require("mongoose");
const busboy = require("connect-busboy");
const fs = require("fs");
const AWS = require("aws-sdk");

const corsOptions = {
  origin: "http://localhost:8080"
};

// express configuration
const app = express();
app.use(busboy());
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

// mongodb config
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// web site configuration schema
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

// web site configuration model
const SiteConfig = mongoose.model("SiteConfig", SiteConfigSchema);

// content storage configuration
const ContentUploadSchema = new Schema({
  id: ObjectId,
  user: String,
  title: String,
  description: String,
  location: String,
  monetized: Boolean
});

const ContentUpload = mongoose.model("ContentUpload", ContentUploadSchema);

mongoose.connect(process.env.MONGO_URI);

// aws s3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY
});

// ROUTES
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

app.post("/api/uploadfile", checkJwt, (req, res) => {
  let title = null,
    description = null,
    monetization = false;

  req.pipe(req.busboy);

  req.busboy.on("field", (field, value) => {
    switch (field) {
      case "title":
        title = value;
        break;
      case "description":
        description = value;
        break;
      case "premium":
        monetization = true;
        break;
    }
  });

  req.busboy.on("file", (fields, file, filename) => {
    s3.upload({ Bucket: process.env.AWS_BUCKET, Key: `${req.user.sub}-${filename}`, Body: file })
      .promise()
      .then(data => {
        const contentUpload = new ContentUpload({
          user: req.user.sub,
          title: title,
          description: description,
          monetized: monetization,
          location: data.Location
        });

        contentUpload.save(error => {
          if (error) {
            console.log(error);
          }
        });
      });
  });
});

app.get("/api/listfile", checkJwt, async (req, res) => {
  res.send("Alive");
});

app.listen(process.env.PORT || 3000);
