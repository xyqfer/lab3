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

// app.get('/os', require('../api/os'));
// app.post('/deploy', require('../api/deploy'));
// app.get('/test', require('../api/test'));
// ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key

app.get('/__engine/1/ping', (req, res) => {
  res.send('ok');
});

app.get('/1.1/functions/_ops/metadatas', (req, res) => {
  res.statusCode(404).send('not found');
});

var proxy = require('http-proxy-middleware');

var filter = function(pathname, req) {
  return true;
};

// var apiProxy = proxy(filter, { 
//   target: 'https://www.google.com',
//   router: function(req) {
//     console.log(req);
//     return 'https://www.google.com.hk';
//   }
//  });
// app.use(apiProxy)

app.use(
  '/search',
  proxy({ 
    target: 'https://www.google.com.hk', 
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      // console.log(proxyRes.body)
    },
  })
);

const port = process.env.LEANCLOUD_APP_PORT || 3000;
app.listen(port, () => {
    console.log('Node app is running on port:', port);

    const port2 = 3189;

    // setTimeout(() => {
    //   var fs = require('fs');
    //   var inspect = require('util').inspect;
      
    //   var ssh2 = require('ssh2');
      
    //   new ssh2.Server({
    //     hostKeys: [
    //       fs.readFileSync('ssh_host_rsa_key')
    //     ],
    //   }, function(client) {
    //     console.log('Client connected!');
      
    //     client.on('authentication', function(ctx) {
    //       ctx.accept();
    //     }).on('ready', function() {
    //       console.log('Client authenticated!');
      
    //       client.on('session', function(accept, reject) {
    //         var session = accept();
    //         session.once('exec', function(accept, reject, info) {
    //           console.log('Client wants to execute: ' + inspect(info.command));
    //           var stream = accept();
    //           stream.stderr.write('Oh no, the dreaded errors!\n');
    //           const {execSync} = require('child_process');
    //           stream.write(execSync(info.command));
    //           stream.write('\n');
    //           stream.write('Just kidding about the errors!\n');
    //           stream.exit(0);
    //           stream.end();
    //         });
    //       });
    //     }).on('end', function() {
    //       console.log('Client disconnected');
    //     });
    //   }).listen(0, function() {
    //     console.log('Listening on port ' + this.address().port);
    //   });
    // }, 5000);
});
