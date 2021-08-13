let fs = require("fs");
let express = require('express');
const { exec } = require("child_process");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1.0/getAllReviews', function (req, res) {
   fs.readFile( __dirname + "/" + "reviews.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
});

app.get('/api/v1.0/getReview', function (req, res) {
   let streamId = req.query.streamID;
   console.log(streamId);
   exec("ceramic state " + streamId, (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
      if (stderr) {
         console.log(`stderr: ${stderr}`);
         return;
      }
      console.log(`stdout: ${stdout}`);
      res.end(stdout);
   });
});

app.post('/api/v1.0/submitReview', function (req, res) {
   let ceramicReviewObj = JSON.stringify(req.body);
   console.log(ceramicReviewObj);
   exec("ceramic create tile --schema k1dpgaqe3i64kjpozl8oajejq83dlslcfhwmqs7526g64kjidvu136aplq2sqdx2wpglzxq1b5dg87bnnxmw3nzlbhdfup0z2rn3fl0yv02g2k8g7ry38g9da --content " + "'" + ceramicReviewObj + "'", (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
      if (stderr) {
         console.log(`stderr: ${stderr}`);
         return;
      }
      console.log(`stdout: ${stdout}`);
      let ceramicStreamResponse = stdout.split(/\r\n|\r|\n/);
      let streamIDSbs = ceramicStreamResponse[0].substring(ceramicStreamResponse[0].indexOf('(') + 1);
      let streamID = streamIDSbs.substring(0, streamIDSbs.indexOf(')'));
      res.end(streamID);
   });
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   // const seed = randomBytes.randomBytes(32);
   // const authId = 'myAuthenticationMethod';

   // const threeId = await ThreeIdProvider.create({ getPermission, seed });
   // const provider = threeId.getDidProvider()

   console.log("NetSepio API running at http://%s:%s", host, port)
});