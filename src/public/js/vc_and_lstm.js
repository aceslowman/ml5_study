const s = ( p ) => {
  let classifier;
  let rnn;
  let video;
  let canvas;

  let rnn_text = 'hello world';
  let text = 'sample loading';
  let font;

  let results = [];
  let top_result = {className: '', probability: ''};
  let tolerance = 0.9;

  //----------------------------------------------------------------------------

  p.preload = ()=>{
    console.log('preloading');
    font = p.loadFont('fonts/open-sans/OpenSans-SemiboldItalic.ttf');
  }

  p.setup = ()=>{
    video = p.createCapture('VIDEO');
    video.size(640,480);
    video.parent('sketch');

    let parent = p.select('#sketch');
    let canvas = p.createCanvas(640,480);

    p.textFont(font);
    p.textSize('20');
    p.textAlign(p.RIGHT, p.TOP);

    rnn = ml5.charRNN('./models/lstm/hemingway/', ()=>{
      generateText('hello world');
      p.select('#status').html('<p>hemingway Model Loaded</p> ', true);
    });

    classifier = ml5.imageClassifier('MobileNet', video, ()=>{
      p.select('#status').html('<p>Image Classifier Loaded</p>', true);
      setInterval(()=>displayResults(), 750);
    });
  }

  p.draw = ()=>{
    p.clear();

    p.fill(255);

    p.textSize('20');
    p.text(text, 15, 15, p.width - 30, p.height - 30 );
  }

  //----------------------------------------------------------------------------

  function classifyVideo(){
    classifier.predict((err, res)=>{
      if(err) console.error(err);

      results = [];

      for(let result of res){

        let found = results.some((el)=>{
          return el.className === result.className;
        });

        if(found){
          let id = results.findIndex((el)=>{
            return el.className === result.className;
          });

          results[id].probability = result.probability;
        }else{
          results.push(result);
        }
      }

      results.sort((a,b) => a.probability - b.probability);
      results = results.slice(0, 5);

      let above_thresh = results.find((el)=>{
        return el.probability > tolerance;
      });

      if(above_thresh && top_result.className !== above_thresh.className){
        top_result = above_thresh;
        console.log('TOP RESULT', top_result);
        //replace current 'text' with a loading message
        text = 'sample loading';
        generateText(above_thresh);
      }
    });
  }

  function generateText(str){
    let data = {
      seed: str,
      temperature: 0.1,
      length: 80
    };

    rnn.generate(data, (err,result)=>{
      if(err) console.error(err);
      text = top_result.className + "\n\n" + top_result.className + result.sample;
    });
  }

  function displayResults(){
    classifyVideo();
    // document.getElementById('chat').innerHTML = 'chaaatttt';

    document.getElementById('result').innerHTML = `<tr>
      <th>classname</th>
      <th>probability</th>
    </tr>`;

    for(let i = results.length - 1; i > 0; i--){
      // TODO: flash yellow on any new ones

      let tr = document.createElement('tr');
      let td_class = document.createElement("td");
      let td_prob = document.createElement("td");

      td_class.appendChild(document.createTextNode(results[i].className));
      td_prob.appendChild(document.createTextNode(results[i].probability.toFixed(2)));
      tr.appendChild(td_class);
      tr.appendChild(td_prob);
      td_prob.style.backgroundColor = `hsl(120, ${(results[i].probability * 100)}%, ${100-(results[i].probability * 50)}%)`;

      document.getElementById('result').appendChild(tr);
    }
  }
}

let wordSketch = new p5(s, 'sketch');
