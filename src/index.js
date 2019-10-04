const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const timeout = require('connect-timeout');
const initLoadBalancer = require('./initLoadBalancer');

const app = express();
app.use(timeout('600s'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cors());

// 首页仅起到响应健康检查的作用
app.get("/", (req, res) => {
  res.send(`this is home page`);
});

initLoadBalancer();
app.listen(process.env.LEANCLOUD_APP_PORT || 3000);
