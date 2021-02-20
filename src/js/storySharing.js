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
        })
        return {success:true}
    }).catch((err)=>{
        console.log(err);
        return Promise.resolve({success: false})
    })
}

getStoryById = (storyId)=>{
    const storyRef = db.collection('story').doc(String(storyId));
    return storyRef.get().then(doc=>{
        return doc.exists?doc.data():Promise.reject("Invalid Story Id")
    }).catch((err) => {
        console.log(err);
        return Promise.resolve({success: false,msg:err})
    })
}

deleteStoryById = (storyId) => {
    const storyRef = db.collection('story').doc(String(pk));
    return storyRef.get(doc => {
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
    const storyRef = db.collection('story')
    return storyRef.where('emotion','==',emotion).get().then(
        querySnapshot=> {
            let count = querySnapshot.docs.length;
            return {
                start:0,
                end: count,
                count: count,
                lst: querySnapshot.docs.map(ele => ele.data())
            }
        }
    ).then(
        data=>({success:true,data:data})
    ).catch((err) => {
        console.log(err);
        return Promise.resolve({success: false, msg: err})
    })
}
