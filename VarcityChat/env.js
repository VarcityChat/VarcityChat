const z = require("zod");
const packageJSON = require("./package.json");
const path = require("path");

const APP_ENV = process.env.APP_ENV ?? "development";
const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);

require("dotenv").config({
  path: envPath,
});

const BUNDLE_ID = "";
const PACKAGE = "";
const NAME = "";
const EXPO_ACCOUNT_OWNER = "";
const EAS_PROJECT_ID = "";
const SCHEME = "";

module.exports = {};
