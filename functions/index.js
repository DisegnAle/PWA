var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({
  origin: true
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./pwagram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pwagram-e67f6-default-rtdb.europe-west1.firebasedatabase.app"
});

/* exports.storePostData = functions
  .region('europe-west6')
  .https.onRequest(function (req, res) {
    cors(function (req, res) {
      admin
        .database()
        .ref('posts')
        .push({
          title: req.body.title,
          location: req.body.location,
          image: req.body.image,
          id: req.body.id,
        })
        .then(function () {
          return res.status(201).json({
            message: 'Data stored',
            id: req.body.id,
          });
        })
        .catch(function (err) {
          return res.status(500).json({
            error: err,
          });
        });
    })
  }); */

  exports.storePostData = functions
  .region('europe-west6')
  .https.onRequest(function(request, response) {
    cors(request, response, function() {
      admin.database().ref('posts').push({
        id: request.body.id,
        title: request.body.title,
        location: request.body.location,
        image: request.body.image
      })
        .then(function() {
          response.status(201).json({message: 'Data stored', id: request.body.id});
        })
        .catch(function(err) {
          response.status(500).json({error: err});
        });
    });
   });