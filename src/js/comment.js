const {db,getNextAutoKey, fireSQL} = require ('./dbUtil.js');

createComment = (body, timestamp, userName, storyId, isCounselor) => {
    return db.runTransaction(async transaction => {
        const pk = await getNextAutoKey('comment');
        transaction.set(db.collection('comment').doc(String(pk)),{
            id:pk,
            timestamp:timestamp,
            body:body,
            userName: userName,
            storyId: storyId,
            isCounselor: isCounselor
        });
        return {success:true,id:pk}
    }).catch((err)=>{
        console.log(err);
        return Promise.resolve({success: false})
    })
};
