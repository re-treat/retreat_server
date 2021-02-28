dbUtil = require ("./dbUtil");
db = dbUtil.db;
assert = require('assert').strict;
require ('./storySharing');
require('./exerciseReport');
require('./anonUsername');

testName = async ()=>{
    console.log("Testing start:")
    regName = "test name 222"
    await deleteName(regName).catch(err=>{})

    console.log("Testing Creat Name")
    res = await addUsername(regName)
    ref = db.collection("anonUsername").doc(regName)
    doc = await ref.get()
    assert(doc.exists,"Err: Document did not created")
    console.log(res)
    console.log("Success")
    console.log("---------")

    console.log("Testing Register Name")
    res = await registerName(regName)
    doc = await ref.get()
    assert(doc.data().registered, "Err: registration failed")
    console.log(res)
    console.log("Done")
    console.log("---------")

    console.log("Testing UnRegister Name")
    res = await unregisterName(regName)
    doc = await ref.get()
    assert(!doc.data().registered, "Err: unregistration failed")
    console.log(res)
    console.log("Done")
    console.log("---------")

    console.log("Testing Delete Name")
    res = await deleteName(regName)
    doc = await ref.get()
    assert(!doc.exists, "Err: unregistration failed")
    console.log(res)
    console.log("Done")
    console.log("---------")

    console.log("Testing Get Name")
    res = await getRandomAvailableNames(10)
    console.log(res)
    console.log("Done")
    console.log("---------")


}
testReport = async ()=>{
    console.log("Testing start:")

    console.log("Testing Create Report:")
    res = await createReport("test body6542","test author",2333)
    console.log(res)
    curr_id = res.id
    ref = db.collection("report").doc(String(curr_id))
    doc = await ref.get()
    assert(doc.exists,"Fail to create report")
    console.log("Success")
    console.log("---------")

    console.log("Testing Get Report:")
    res = await getReportbyId(curr_id)
    console.log(res)
    console.log("Success")
    console.log("---------")

    console.log("Testing Delete Report")
    res = await deleteReportById(curr_id)
    doc = await ref.get()
    assert(!doc.exists, "Fail to delete report")
    console.log("Success")
    console.log("---------")


}
testStory = async () => {
    console.log("Testing start:")

    console.log("Testing Create Story:")
    res = await createStory("test body6542", "test author","happy", 2333)
    console.log(res)
    curr_id = res.id
    ref = db.collection("story").doc(String(curr_id))
    doc = await ref.get()
    assert(doc.exists, "Fail to create story")
    console.log("Success")
    console.log("---------")

    console.log("Testing Get Report:")
    res = await getStoryById(curr_id)
    console.log(res)
    console.log("Success")
    console.log("---------")

    console.log("Testing Delete Story")
    res = await deleteStoryById(curr_id)
    doc = await ref.get()
    assert(!doc.exists, "Fail to delete story")
    console.log("Success")
    console.log("---------")

    console.log("Testing Query Story")
    res = await queryStory("happy")
    console.log(JSON.stringify(res, null, "\t"))
    console.log("Success")
    console.log("---------")

}
