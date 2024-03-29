const fbConfig = require("./fbConfig.js");

var firebase = require("firebase/app");
const {FireSQL} = require('firesql');
require("firebase/firestore");
firebase.initializeApp(fbConfig);
var db = firebase.firestore();
if (process.env.RETREAT_DEBUG) {
	db.useEmulator("localhost", 8080);
}
const fireSQL = new FireSQL(db);

/*
 * Finds the exercises associated with the given label and question
 * @param{string} label: label to search
 * @param{string} question: the question the label belongs to: q1, q2, or q3
 * @param{string[]} result: stores the result after querying
 * @returns{Promise}: returns resolved promise with array of exercises, otherwise return rejected promise
 */
async function queryExercise(label, question) {
	let doc;
	switch (question) {
		case "q1":
			doc = await db.collection("labels_q1").doc(label).get();
			if (!doc.exists) { return Promise.resolve(new Array()); }
			else { return Promise.resolve(Object.keys(doc.data())); }
			break;
		case "q2":
			doc = await db.collection("labels_q2").doc(label).get();
			if (!doc.exists) { return Promise.resolve(new Array()); }
			else { return Promise.resolve(Object.keys(doc.data())); }
			break;
		case "q3":
			doc = await db.collection("labels_q3").doc(label).get();
			if (!doc.exists) { return Promise.resolve(new Array()); }
			else { return Promise.resolve(Object.keys(doc.data())); }
			break;
		default:
			throw "Invalid question input";
			break;
	}
}

/*
 * Get the labels for the given question
 * @param{string} question: q1, q2, or q3
 * @returns{string[]} labels: array containing the labels for the question
 */
async function getLabels(question) {
	let labels = new Array();
	switch (question) {
		case "q1":
			await db.collection("labels_q1").get().then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					labels.push(doc.id);
				});
			});
			break;
		case "q2":
			await db.collection("labels_q2").get().then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					labels.push(doc.id);
				});
			});
			break;
		case "q3":
			await db.collection("labels_q3").get().then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					labels.push(doc.id);
				});
			});
			break;
		default:
			throw "Invalid question input.";
			break;
	}
	return labels;
}

/*
 * Adds the email to the subscription list
 * @param{string} email: new email
 * @returns{Promise}: returns the status of the subscription
 */
async function subscribe(email) {
	const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(emailValidate.test(email)){
		let emailRef = db.collection("email").doc(email);
		let status = emailRef.get().then(function (doc) {
			if(doc.exists) {
				return Promise.resolve("Already subscribed."); }
			else{
				emailRef.set({subscribed: true});
				return Promise.resolve("Subscribed.");
			}
		});
		return status;
	}
	else{
		return Promise.reject("Invalid email."); }

}

/*
 * Get the exercise for the given id
 * @param{string} id: Id of the exercise
 * @returns{Object}: JSON object representing the exercise
 */
async function getExercise(id) {
	let ex = new Object();
	let exerciseRef = db.collection("exercises").doc(id);
	let result = await exerciseRef.get().then(async function(doc) {
		if(!doc.exists) { return Promise.reject("Exercise not found."); }
		const data = doc.data();
		ex.name = data.name;
		ex.reference = data.reference;
		ex.image = data.image;
		ex.labels_q1 = data.labels_q1;
		ex.labels_q2 = data.labels_q2;
		ex.labels_q3 = data.labels_q3;

		ex.instructions = [];
		await exerciseRef.collection("instructions").get().then(function (querySnapshot) {
			querySnapshot.forEach(function(inst) {
				ex.instructions.push(inst.data());
			});
		});
		return Promise.resolve(ex);
	}).catch(function(err) {
		console.log(err);
		return Promise.reject(err);
	});
	return result;
}

/*
 * Get AutoIncrement Id
 * @param{string} schema: schemaName, e.g. 'story'
 * @returns{Promise}: returns the status of the subscription
 */
getNextAutoKey= async (schema) =>{
	const keyRef = db.collection("autoIncrement").doc(schema);
	return db.runTransaction( transaction => transaction.get(keyRef).then(
     	 async doc=>{
     		const newIncId = doc.exists? (doc.data().value || 0) + 1 : 0;
     		transaction.set(doc.ref, {value: newIncId});
     		return newIncId
		}
	 )).catch((err)=>Promise.reject(err));
}

logVisit = async (pageName,data) => {
    const keyRef = db.collection("visitHistory").add(
		{
			pageName:pageName,
			data:data,
			time:new Date(),
		}
	);
}
module.exports = {db, fireSQL,queryExercise, getLabels, subscribe, getExercise,getNextAutoKey, logVisit }
