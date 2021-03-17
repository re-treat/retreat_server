const { db } = require("./dbUtil.js");

addUsername = async (name) => {
	var docRef = db.collection("anonUsername").doc(name);
	var doc = await docRef.get();
	if(!doc.exists){
		docRef.set({'registered': false});
		return Promise.resolve(true);
	}
	else{ return Promise.reject(false); }
}

getRandomAvailableNames = async(count) => {
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

registerName = async (name)=>{
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

unregisterName = async (name)=>{
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

deleteName = async (name) =>{
	var docRef = db.collection("anonUsername").doc(name);
	var doc = await docRef.get();
	if(doc.exists){
		docRef.delete();
		return Promise.resolve(true);
	}
	else{ return Promise.reject(false); }
}
<<<<<<< HEAD
module.exports = {getRandomAvailableNames, registerName, unregisterName};
=======

module.exports = {addUsername,getRandomAvailableNames,registerName,unregisterName,deleteName}
>>>>>>> 499f453e1a5d181315feba63661c141ca31aa90c
