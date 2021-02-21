const {db,getNextAutoKey} = require ('./dbUtil.js');

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
        return {success:true}
    }).catch((err)=>{
        console.log(err);
        return Promise.resolve({success: false})
    })
};

getStoryById = (storyId)=>{
    const storyRef = db.collection('story').doc(String(storyId));
    return storyRef.get().then(doc=>{
        return doc.exists?{success:true,data:doc.data()}:Promise.reject("Invalid Story Id")
    }).catch((err) => {
        console.log(err);
        return Promise.resolve({success: false,msg:err})
    })
};

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

queryStory = (emotion) =>{
    let storyRef = db.collection('story')
    if (emotion){
        storyRef = storyRef.where('emotion', '==', emotion)
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
                )
            }
        }
    ).then(
        data=>({success:true,data:data})
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
    const stoyId = req.params.stoyId;
    const result = await getStoryById(stoyId);
    res.status(result.success?200:400)
    res.send(result)
}
deleteStoryByIdView = async (req, res) => {
    const {stoyId} = req.params;
    const result = await deleteStoryById(stoyId);
    res.status(result ? 200 : 400)
    res.send(result)
}
queryStroyView = async (req, res) => {
    const {emotion} = req.query;
    const result = await queryStory(emotion);
    res.status(result.success ? 200 : 400)
    res.send(result)
}
module.exports = {createStory, getStoryById, deleteStoryById, queryStory,
    createStoryView, getStoryByIdView, deleteStoryByIdView, queryStroyView};
