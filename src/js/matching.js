const { queryExercise } = require("./dbUtil.js");

/*
 * Find the best matching exercises given lables as input
 * @param {string[]} labels_q1
 * @param {string[]} labels_q2
 * @param {string[]} labels_q3
 * @param {int} size: number of exercises to return
 * @returns {string[]} exercises of length size, could have smaller size if there is not enough matching exercises
 */
 async function matchExercise(labels_q1, labels_q2, labels_q3, size){
 	if(!Array.isArray(labels_q1)) { throw "Labels has to be in an array." }
 	if(typeof size != "number" || size <= 0) { throw "Invalid size."; }

 	let labelMatch = new Map(); 

 	// Fetch exercises matching q1 labels
 	for(let label of labels_q1){
		await queryExercise(label, "q1").then(function(arr){
 			for(let ex of arr){
 				if(!labelMatch.has(ex)){ labelMatch.set(ex, 0); }
 				labelMatch.set(ex, labelMatch.get(ex)+1);
 			}
 		}).catch(function(err){
 			throw err;
 		});	
 	}

 	// Fetch exercises matching q2 labels
 	for(let label of labels_q2){
 		await queryExercise(label, "q2").then(function(arr){
 			for(let ex of arr){
 				if(!labelMatch.has(ex)){ labelMatch.set(ex, 0); }
 				labelMatch.set(ex, labelMatch.get(ex)+1);
 			}
 		}).catch(function(err){
 			throw err;
 		});	
 	}

 	// Fetch exercises matching q3 labels
 	for(let label of labels_q3){
 		await queryExercise(label, "q3").then(function(arr){
 			for(let ex of arr){
 				if(!labelMatch.has(ex)){ labelMatch.set(ex, 0); }
 				labelMatch.set(ex, labelMatch.get(ex)+1);
 			}
 		}).catch(function(err){
 			throw err;
 		});	
 	}

 	// Creating a new map by setting count as keys and exercises as values
 	let exerciseMatch = new Map();
 	for(let [exercise, count] of labelMatch){
 		if(!exerciseMatch.has(count)) { exerciseMatch.set(count, new Array()); }
 		exerciseMatch.get(count).push(exercise);
 	}

 	// Store the counts
 	let counts = new Array();
 	for(let count of exerciseMatch.keys()){ counts.push(count); }

 	// Extract exercises with max counts, up to [size] of them
 	let matches = new Array();
 	while(matches.length < size && counts.length > 0){
 		let max = Math.max.apply(null, counts);
 		if(max > 0){
 			let exercises = exerciseMatch.get(max);
 			for(let ex of exercises){
 				matches.push(ex);
 				if(matches.length == size) { return matches; }
 			}
 			counts.splice(counts.indexOf(max), 1);
 		}
 		else{ break; }
 	}
 	return matches;
 }

 module.exports = { matchExercise }