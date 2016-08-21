const http = require('http');
let reqCount = 0;
const server = http.createServer((req, res)=>{
    reqCount++;
    res.end(`request count: ${reqCount}`);
    console.log(reqCount);
});

const port = 3000;
server.listen(port);

console.log(`http://0.0.0.0:${port}`);