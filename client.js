const http = require('http');
// var postData = querystring.stringify({
//   'msg' : 'Hello World!'
// });

var options = {
    hostname: '0.0.0.0',
    port: 3000,
    // path: '/upload',
    // method: 'POST',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Content-Length': Buffer.byteLength(postData)
    // }
};

let reqCount = 0;
let resCount = 0;
let errCount = 0;
// let remainderCount = 0;
let startTime = Date.now();
let timers = [];
let isTimeout = false;
let finishTime = 0;
let finishTimer;
const testMulti = +process.argv[2] || 1;
const testTime = +process.argv[3] || 10000;



console.log(`Running test for ${testTime} millisecond...`);
for (var i = 0; i < testMulti; i++) {
    setTimeout(() => {
        timers.push(setInterval(testRequest));
    });
}

function checkIfDone() {

    if (isTimeout && reqCount === (resCount + errCount)) {
        clearTimeout(finishTimer);
        finishTime = Date.now() - startTime;
        showResult();
    }
}

function showResult() {
    console.log(`
        Respond + Error = TotalRequest / FinishTime
        ${resCount} + ${errCount} = ${reqCount} / ${finishTime} ms
        `);
}

function forceExit() {
    console.log('It\'s being so long, force closed...');
    console.log(`Unfinished Count: ${reqCount - resCount}`);
    showResult();
    process.exit(2);
}

function testRequest() {

    reqCount++;
    let req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            resCount++;

            checkIfDone();
            // console.log('No more data in response.');
            // req = null;
        });
    });

    req.on('error', (e) => {
        errCount++;

        checkIfDone();
        // console.log(`problem with request: ${e.message}`);
        // req = null;

    })

    // write data to request body
    // req.write(postData);
    req.end();

    if ((Date.now() - startTime) > testTime) {
        timers.forEach(timer => {
            clearInterval(timer);
        });
        isTimeout = true;
        // remainderCount = reqCount - resCount;
        console.log('Time is out, wait for remainder...', reqCount - resCount);
        finishTimer = setTimeout(forceExit, testTime + 2000);
        return;
    }
}
