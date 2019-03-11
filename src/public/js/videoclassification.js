let classifier;
let video;

function setup(){
  noCanvas();
  video = createCapture('VIDEO');

  classifier = ml5.imageClassifier('MobileNet', video, ()=>{
    select('#status').html('Model Loaded');
    classifyVideo();
  });

  let classifyVideo = ()=>{
    classifier.predict((err, results)=>{
      if(err) console.error(err);
      document.getElementById('result').innerHTML = '';
      for(let result of results){
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(
          `${result.className} (${result.probability.toFixed(2)})`
        ));
        document.getElementById('result').appendChild(li);
      }
      classifyVideo();
    });
  }
}
