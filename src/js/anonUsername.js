const { db } = require("./dbUtil.js");

async function addUsername(name){
	var docRef = db.collection("anonUsername").doc(name);
	var doc = await docRef.get();
	if(!doc.exists){
		docRef.set({'registered': false});
		return Promise.resolve(true);
	}
	else{ return Promise.reject(false); }
}

async function getRandomAvailableNames(count){
	availableNames = [];
	await db.collection("anonUsername").where('registered', '==', false).get()
	.then(function (querySnapshot) {
		querySnapshot.forEach(function (doc) {
			availableNames.push(doc.id);
		});
	});
	selectedIdx = new Set();
	while(selectedIdx.size < Math.min(count, availableNames.length)){
		let randIdx = Math.floor(Math.random() * Math.floor(availableNames.length));
		selectedIdx.add(randIdx);
	}
	selectedNames = [];
	selectedIdx.forEach((idx) => { selectedNames.push(availableNames[idx]) });
	return Promise.resolve(selectedNames);
}

async function registerName(name){
	var docRef = db.collection("anonUsername").doc(name);
	var doc = await docRef.get();
	if(!doc.exists){
		return Promise.reject(0);
	}
	if(doc.data().registered){
		return Promise.reject(1);
	}
	else{
		docRef.set({'registered': true});
		return Promise.resolve(true); 
	}
}

async function unregisterName(name){
	var docRef = db.collection("anonUsername").doc(name);
	var doc = await docRef.get();
	if(!doc.exists){
		return Promise.reject(0);
	}
	if(!doc.data().registered){
		return Promise.reject(1);
	}
	else{
		docRef.set({'registered': false});
		return Promise.resolve(true); 
	}
}

async function deleteName(name){
	var docRef = db.collection("anonUsername").doc(name);
	var doc = await docRef.get();
	if(doc.exists){
		docRef.delete();
		return Promise.resolve(true);
	}
	else{ return Promise.reject(false); }
}

