const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

var QRCode = require('qrcode')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Create QR
exports.createQr = functions.firestore.document('/attendees/{documentId}').onCreate(async (snap, context) => {
  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Creating QR For', context.params.documentId);

  QRCode.toDataURL(context.params.documentId, async (err, qr) => {
    if(err) {
      functions.logger.log('Error Creating QR For', context.params.documentId, 'Error',err);
    } else {
      try {
        await snap.ref.set({qr}, {merge: true});
      } catch (error) {
        functions.logger.log('Error Creating QR For', context.params.documentId, 'Error',error);
      }
    }
  })
});

// Send QR
// exports.sendQr = functions.firestore.document('/attendees/{documentId}').onUpdate((snap, context) => {
//   // Grab the current value of what was written to Cloud Firestore.
//   const whatsapp = snap.data().whatsapp;

//   // Access the parameter `{documentId}` with `context.params`
//   functions.logger.log('Sending Whatsapp To', context.params.documentId, whatsapp);
  
//   // const uppercase = original.toUpperCase();
//   // return snap.ref.set({uppercase}, {merge: true});
// });