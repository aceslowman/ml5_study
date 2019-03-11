const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('src/public'));

app.get('/', (req,res)=>{
  res.sendFile('index.html');
});

app.listen(3000,()=>console.log("listening on port 3000"));
