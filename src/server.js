const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('src/public'));

app.get('/image_classification',(req,res)=>{
  res.sendFile('imageclassification.html', { root: __dirname + "/public"});
});

app.get('/video_classification',(req,res)=>{
  res.sendFile('videoclassification.html', { root: __dirname + "/public"});
});

app.get('/lstm',(req,res)=>{
  res.sendFile('lstm.html', { root: __dirname + "/public"});
});

app.listen(3000,()=>console.log("listening on port 3000"));
