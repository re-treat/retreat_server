const { db, getNextAutoKey } = require("./dbUtil");

createReport = (body, author, timestamp) => {
    return db.runTransaction(async transaction => {
         const incrementedId = await getNextAutoKey('report');
         transaction.set(db.collection('report').doc(String(incrementedId)), {
             id: incrementedId,
             timestamp: timestamp,
             body: body,
             author: author
         });
         return {success:true}
    }).catch((error) => {
        console.log(error);
        return Promise.resolve({success: false})
    })
};

getReportbyId = (reportId) => {
    const reportRef = db.collection('report').doc(String(reportId));
    return reportRef.get().then(doc=>{
        if (doc.exists) {
            doc.data()
            return true
        } else {
            return Promise.reject("Invalid Report Id")
        }
    }).catch((error) => {
        console.log(error);
        return Promise.resolve({success:false, msg:error})
    })
};

deleteReportById = (reportId) => {
    const reportRef = db.collection('report').doc(String(reportId));
    return reportRef.get().then(doc => {
        if (doc.exists) {
            doc.ref.delete();
            return true
        } else {
            return Promise.reject("Report does not exist.")
        }
    }).catch((error) => {
        console.log(error);
        return Promise.resolve(false)
    })
};

module.exports = {createReport, getReportbyId, deleteReportById}