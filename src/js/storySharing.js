const {db,getNextAutoKey, fireSQL} = require ('./dbUtil.js');

createStory = (body,author,emotion,timestamp) =>{
    return db.runTransaction(async transaction => {
        const pk = await getNextAutoKey('story');
        transaction.set(db.collection('story').doc(String(pk)),{
            id:pk,
            timestamp:timestamp,
            body:body,
            author:author,
            emotion:emotion
        });
        return {success:true,id:pk}
    }).catch((err)=>{
        console.log(err);
        return Promise.resolve({success: false})
    })
};

serializeStory= (ele) => {
    const respList = Object.keys(ele.responses || {}).sort(
        (a, b) => ele.responses[b] - ele.responses[a]
    )
    return {
    ...ele,
    responses:respList.slice(0, 3),
    resp_count: respList.map(e=> ele.responses[e]).filter(e=>e).reduce((a,b)=>a+b,0),
}}

getStoryById = (storyId)=>{
    const storyRef = db.collection('story').doc(String(storyId));
    return storyRef.get().then(doc=>{
        return doc.exists?{success:true,data: serializeStory(doc.data())}:Promise.reject("Invalid Story Id")
    }).catch((err) => {
        console.log(err);
        return Promise.resolve({success: false,msg:err})
    })
};

responseStory = (storyId,resp) => {
    const storyRef = db.collection('story').doc(String(storyId));
    return storyRef.get().then(doc => {
        if(doc.exists) {
            const data = doc.data();
            const responses = data.responses || {};
            const new_val = (responses[resp] || 0) + 1
            storyRef.set({responses:{[resp]: new_val}}, {merge: true})
            return getStoryById(storyId)
        }
        return Promise.reject("Invalid Id")
    }).catch((err) => {
        console.log(err);
        return Promise.resolve({success: false, msg: err})
    })
}

deleteStoryById = (storyId) => {
    const storyRef = db.collection('story').doc(String(storyId));
    return storyRef.get().then(doc => {
        if (doc.exists) {
            doc.ref.delete();
            return true
        } else {
            return Promise.reject("Story Does not exist")
        }
    }).catch((err) => {
        console.log(err);
        return Promise.resolve(false)
    })
};


queryStory = async (emotion) => {
    console.log("Querying emotion: " + emotion);
    let storyRef = db.collection('story')
    console.log(typeof emotion)
    if (emotion){
        storyRef = await storyRef.where('emotion', '==', emotion)
    }
    return storyRef.get().then(
        querySnapshot=> {
            let count = querySnapshot.docs.length;
            return {
                start:0,
                end: count,
                count: count,
                lst: querySnapshot.docs.map(ele => ele.data()).filter(
                    (ele)=> Object.keys(ele).length>0
                ).map(
                    serializeStory
                ).sort(
                    (a, b) => -(a.timestamp-b.timestamp)
                )
            }
        }
    ).then((data)=>{
        console.log(data);
        return Promise.resolve({success:true,data:data});
    }
    ).catch((err) => {
        console.log(err);
        return Promise.resolve({success: false, msg: err})
    })
};

createStoryView = async (req, res) => {
    const {body, author, emotion, timestamp} = req.body;
    if ( body && author && emotion && timestamp) {
        const result = await createStory(body, author, emotion, timestamp)
        if (result.success) {
            res.status(200)
            res.send(result)
            return
        }
    }
    res.status(400)
    res.send("Bad Request")
}
getStoryByIdView = async (req, res) => {
    const {storyId} = req.params;
    const result = await getStoryById(storyId);
    res.status(result.success?200:400)
    res.send(result)
}
responseStoryView = async (req, res) => {
    const {storyId, response} = req.body;
    const result = await responseStory(storyId, response);
    res.status(result.success ? 200 : 400)
    res.send(result)
}
deleteStoryByIdView = async (req, res) => {
    const {storyId} = req.params;
    const result = await deleteStoryById(storyId);
    res.status(result ? 200 : 400)
    res.send({success:result})
}
queryStroyView = async (req, res) => {
    const {emotion} = req.query;
    const result = await queryStory(emotion);
    res.status(result.success ? 200 : 400)
    res.send({result})
}
module.exports = {createStory, getStoryById, deleteStoryById, queryStory, responseStory,
    createStoryView, getStoryByIdView, deleteStoryByIdView, queryStroyView, responseStoryView};
