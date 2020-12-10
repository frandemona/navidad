const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const QRCode = require('qrcode')
const nodemailer = require('nodemailer');

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
        functions.logger.log('Created QR For', context.params.documentId);
      } catch (error) {
        functions.logger.error('Error Creating QR For', context.params.documentId, 'Error',error);
      }
    }
  })
});

// Send QR
exports.sendQr = functions.firestore.document('/attendees/{documentId}').onUpdate(async (change, context) => {
  const { email: emailBefore, qr: qrBefore } = change.before.data();
  const { email, qr, firstName } = change.after.data();
  
  if(emailBefore === email && qrBefore === qr) {
    functions.logger.log('Document', context.params.documentId, 'changed but email and qr is the same');
    return
  } else if (emailBefore !== email && !qr) {
    functions.logger.log('Document', context.params.documentId, 'changed but qr doesn\'t exist');
    return
  }

  functions.logger.log('Sending Email To', email, 'for document', context.params.documentId);

  const gmailEmail = functions.config().gmail.email;
  const gmailPassword = functions.config().gmail.password;
  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });
  const mailOptions = {
    from: 'Navidad <navidadcbac1@gmail.com>',
    to: email,
    subject: 'Navidad QR',
    text: `Hola ${firstName || ''}! Acá está el QR para utilizar adjuntado en este correo. Es único e intransferible.`,
    html: `<p>Hola ${firstName || ''}!</p><p>Acá está el QR para utilizar. Es único e intransferible.</p><br /><br /><img src="cid:qr@nodemailer.com" alt="QR Code"/>`,
    attachments: [
      {
        filename: 'QR-Navidad.png',
        path: qr,
        cid: 'qr@nodemailer.com'
      },
      {
        filename: 'QR Navidad.png',
        path: qr
      },
    ]
  };

  try {
    await mailTransport.sendMail(mailOptions);
    functions.logger.log('QR Sent To', email, 'For', context.params.documentId,);
    await change.after.ref.set({qrSent: true}, {merge: true});
  } catch (error) {
    functions.logger.error('Error Sending QR For', context.params.documentId, 'Error', error);
  }

  // const requestUrl = `https://api.budgetsms.net/testsms/username=${functions.config().budgetsms.username}&userid=${functions.config().budgetsms.userid}&handle=${functions.config().budgetsms.handle}`
  // https://api.budgetsms.net/sendsms/ - Produccion
  // https://api.budgetsms.net/testsms/ - Test
  
  // const uppercase = original.toUpperCase();
  // return snap.ref.set({uppercase}, {merge: true});
});