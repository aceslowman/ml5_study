const classifier = ml5.imageClassifier('MobileNet', ()=>{
  document.getElementById('status').innerHTML = 'Model Loaded';
});

let img;

function setup(){

  createCanvas(500,500);

  img = loadImage('../images/cat.jpg', (res)=>{

    image(res, 0, 0, 500, 500);

    classifier.predict(img, (err, results)=>{
      console.group();
      if(err) console.error(err);
      for(let result of results){
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(
          `${result.className} (${result.probability.toFixed(2)})`
        ));
        document.getElementById('result').appendChild(li);
      }
      console.groupEnd();
    });
  });
}
