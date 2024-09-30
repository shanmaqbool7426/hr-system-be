const swaggerAutogen = require("swagger-autogen");
require("dotenv").config();

const doc = {
  info: {
    title: "HRM-Zaffre",
    version: "1.0.0",
    description: "HRM-Zaffre API Server endpoints",
    contact: {
      name: "Danish Gakhar",
    },
  },
  schemes: ["http"],
  servers: [
    {
      url: process.env.BACKEND_URL,
    },
  ],
  security: [
    {
      JwtToken: "",
    },
  ],
  securityDefinitions: {
    "JwtToken": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    }
  },
  tags: [
    {
      name: "Authentication",
    },
  ],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
