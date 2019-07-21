import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
admin.firestore().settings( { timestampsInSnapshots: true });
// newSubscriberNotification
exports.sendNotification = functions.firestore.document(`notification/{userId}/games/{matchId}`)
  // .document('subscriber/{subscriptionId}')
  .onUpdate(async event => {
    const data = event.after.data();

    const userId = data.enemyUID;
    const user = data.user;
    const status = data.status;
    console.log("go Mirk");
    console.log(status);
    console.log(user);
    console.log(userId);

    const payload = {
      notification: {
        title: `${status}`,
        body: `${user} hat gespielt!`,
        icon: 'link to icon'
      }
    };


    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    const devices = await devicesRef.get();
    // db.collection("devices").doc(userId).collection("Token").doc(userId).get().then(queryResult => {
    let tokens: string[] = [];

    devices.forEach(result => {
      // const token = result.data().token;
      // tokens = token;
      tokens.push(result.data().token);
    });

    console.log("onupdate", tokens, payload);
    return admin.messaging().sendToDevice(tokens, payload);
  });

exports.sendNotificationOneVsOneCreation = functions.firestore.document(`notification/{userId}/games/{matchId}`)
// .document('subscriber/{subscriptionId}')
  .onCreate(async event => {
    const data = event.data();

    const userId = data.enemyUID;
    const user = data.user;
    const status = data.status;
    console.log(status);
    console.log(user);
    console.log(userId);

    const payload = {
      notification: {
        title: `${status}`,
        body: `von ${user}`,
        icon: 'link to icon'
      }
    };


    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    const devices = await devicesRef.get();
    console.log("res", devices);
    let tokens: string[] = [];

    devices.forEach(result => {
      // const token = result.data().token;
      // tokens = token;
      console.log("res", result);
      console.log("resData", result.data().token);
      tokens.push(result.data().token);
    });
    console.log('create', tokens, payload);
    return admin.messaging().sendToDevice(tokens, payload);
  });

exports.sendNotificationTraining = functions.firestore.document(`trainingnotification/{userId}/games/{matchId}`)
// .document('subscriber/{subscriptionId}')
  .onUpdate(async event => {
    const data = event.after.data();

    const userId = data.enemyUID;
    const user = data.user;
    const status = data.status;
    console.log(status);
    console.log(user);
    console.log(userId);

    const payload = {
      notification: {
        title: `${status}`,
        body: `${user} hat gespielt!`,
        icon: 'link to icon'
      }
    };


    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    const devices = await devicesRef.get();
    let tokens: string[] = [];

    devices.forEach(result => {
      // const token = result.data().token;
      // tokens = token;
      console.log(result.data().token);
      tokens.push(result.data().token);
    });

    return admin.messaging().sendToDevice(tokens, payload)
  });

exports.sendNotificationTrainingCreation = functions.firestore.document(`trainingnotification/{userId}/games/{matchId}`)
  .onCreate(async event => {
    const data = event.data();

    const userId = data.enemyUID;
    const user = data.user;
    const status = data.status;
    console.log(status);
    console.log(user);
    console.log(userId);

    const payload = {
      notification: {
        title: `${status}`,
        body: `von ${user}`,
        icon: 'link to icon'
      }
    };


    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    const devices = await devicesRef.get();

    let tokens: string[] = [];

    devices.forEach(result => {
      // const token = result.data().token;
      // tokens = token;
      console.log(result.data().token);
      tokens.push(result.data().token);
    });

    return admin.messaging().sendToDevice(tokens, payload)
  });
