require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const cors = require("cors");
const mongoose = require("mongoose");
const formidable = require("formidable");
const { Storage } = require("@google-cloud/storage");

const corsOptions = {
  origin: "http://localhost:8080"
};

// express configuration
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

mongoose.connect(process.env.MONGO_URI);

// gcp storage config
const storage = new Storage({ keyFilename: "../gcp-access.json" });

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
  var form = new formidable();
  form.parse(req, async (err, fields, file) => {
    if (err) {
      res.send("Error");
    } else {
      await storage.bucket(process.env.GCP_BUCKET).upload(file.path, {
        gzip: true,
        metdata: {
          name: name,
          userOwner: req.user.sub
        }
      });

      console.log(`${file} uploaded`);
    }
  });
});

app.get("/api/listfile", checkJwt, async (req, res) => {
  const [files] = await storage.bucket(process.env.GCP_BUCKET).getFiles();
  const userFiles = [];

  files.forEach(file => {
    if (file.metadata.userOwner === req.user.sub) {
      userFiles.push(file);
    }
  });
});

app.listen(process.env.PORT || 3000);
