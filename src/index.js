const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const timeout = require('connect-timeout');
const { init } = require('@xyqfer/init-leancloud-engine');
init();

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

const port = process.env.LEANCLOUD_APP_PORT || 3000;
app.listen(port, () => {
    console.log('Node app is running on port:', port);

    setTimeout(() => {
      const port2 = 3189;
      const express = require("express");
      const app = express();

      app.get('/', (req, res) => {
        res.send('hahahahaha this is 3189');
      });
      app.listen(port2, (err) => {
        console.log('Node app is running on port:', port2);
        console.log(err);


        var evilscan = require('evilscan');

        var options = {
            target:'127.0.0.1',
            port:'0-65535',
            status:'O', // Timeout, Refused, Open, Unreachable
            banner:true
        };

        var scanner = new evilscan(options);

        scanner.on('result',function(data) {
            // fired when item is matching options
            console.log(data);
        });

        scanner.on('error',function(err) {
            throw new Error(data.toString());
        });

        scanner.on('done',function() {
            // finished !
            console.log('scan done');
        });

        scanner.run();
      });
    }, 5000);
});
