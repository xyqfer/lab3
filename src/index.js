const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const timeout = require('connect-timeout');
const initLoadBalancer = require('./initLoadBalancer');

const AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

AV.Cloud.useMasterKey();

const app = express();
app.use(timeout('600s'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cors());

app.get('/', (req, res) => {
  res.send('this is home page');
});

app.get('/os', require('../api/os'));
app.post('/deploy', require('../api/deploy'));
app.get('/test', require('../api/test'));

initLoadBalancer();
app.listen(process.env.LEANCLOUD_APP_PORT || 3000);
