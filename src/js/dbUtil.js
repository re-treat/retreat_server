const fbConfig = require("./fbConfig.js");

var firebase = require("firebase/app");
require("firebase/firestore");
firebase.initializeApp(fbConfig);
var db = firebase.firestore();

/*
 * Adds the exercise to the db
 * @param{string} name: name of the exercise, should be in the format of name_of_the_exercise
 * @param{string} file: filename of the exercise page, e.g: "index.html"
 * @param{string[]} labels_q1: array of labels as strings for question 1
 * @param{string[]} labels_q2: array of labels as strings for question 2
 * @param{string[]} labels_q3: array of labels as strings for question 3
 * @returns{Promise}: Returns resolved promise if success, otherwise return rejected promise
 */
async function addExercise(name, file, labels_q1, labels_q2, labels_q3) {
	if (!Array.isArray(labels_q1) || !Array.isArray(labels_q2) || !Array.isArray(labels_q3)) {
		console.error("Invalid label input");
		return Promise.reject(false);
	}

	// Add exersice to the db
	let exerciseRef = db.collection("exercises").doc(name);
	let status = exerciseRef.get().then(function (doc) {
		if (doc.exists) { throw "Exercise already exists"; }
		else {
			exerciseRef.set({ url: file });
			// Add exercise to q1 labels
			const q1Ref = db.collection("labels_q1");
			labels_q1.forEach(function (label) {
				let labelRef = q1Ref.doc(label);
				labelRef.get().then(function (doc) {
					let field = new Object();
					field[name] = true;

					if (doc.exists) {
						labelRef.set(field, { merge: true });
					}
					else {
						labelRef.set(field);
					}
				}).catch(function (error) {
					throw error;
				});
			});

			// Add exercise to q2 labels
			const q2Ref = db.collection("labels_q2");
			labels_q2.forEach(function (label) {
				let labelRef = q2Ref.doc(label);
				labelRef.get().then(function (doc) {
					let field = new Object();
					field[name] = true;

					if (doc.exists) {
						labelRef.set(field, { merge: true });
					}
					else {
						labelRef.set(field);
					}
				}).catch(function (error) {
					throw error;
				});
			});

			// Add exercise to q3 labels
			const q3Ref = db.collection("labels_q3");
			labels_q3.forEach(function (label) {
				let labelRef = q3Ref.doc(label);
				labelRef.get().then(function (doc) {
					let field = new Object();
					field[name] = true;

					if (doc.exists) {
						labelRef.set(field, { merge: true });
					}
					else {
						labelRef.set(field);
					}
				}).catch(function (error) {
					throw error;
				});
			});
			return Promise.resolve(true);
		}
	}).catch(function (err) {
		console.error(err);
		return Promise.reject(false);
	});
	return status;
}

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

module.exports = { addExercise, queryExercise, getLabels }
