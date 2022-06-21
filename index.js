const express = require('express')
const fs = require('fs')

const app = express()

app.get('/', (req, res) => {
    console.log('file path', __dirname + "/index.html")
    res.sendFile(__dirname + "/index.html")
})

app.get("/video", (req, res) => {
    const range = req.headers.range;
    const videoPath = "./test.mp4";
    const videoSize = fs.statSync(videoPath).size;
   
    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);
   
    const contentLength = end - start + 1;
   
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
   
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
  });


app.listen(3000, () => {
    console.log('server start at port 3000')
})