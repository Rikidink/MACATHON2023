var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var dump =[]
var toSend =[]

var recognition = new SpeechRecognition();

recognition.continuous = true  ;
recognition.lang = 'en-US';
recognition.interimResults = false;

var diagnostic = document.querySelector('#status');
var output = document.querySelector('#output');



document.querySelector("#start").onclick = function() {
  recognition.start();
  console.log('Ready to receive an Item.');
}


recognition.onstart = () => {
  document.querySelector("#status").textContent ="Listening..."
};

recognition.onresult = function(event) {
  
  for (let index = 0; index < event.results.length; index++) {
   


  if (event.results[index][0].transcript.includes("done")  )

  {

    console.log("Done!!")
    recognition.stop();
    document.querySelector("#status").textContent ="Finished"
    compileSend(event)
    

  }}}

recognition.onspeechend = function() {
  document.querySelector("#status").textContent ="Done!"
  console.log("Speech has Ended")
  
}


recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}






// TO COMPILE AND DISPLAY:

function compileSend(event) {
  for (let index = 0; index < event.results.length; index++) {
    dump.push(event.results[index][0].transcript)
   
    
  }

  dump.pop()

  var toJoin = dump.map(function (t, i) {
    return (i+1) +". "+ t + "\n"+ "\n"+ "\n"+ "\n"
  })

  document.getElementById('output').innerHTML = 
  "Here's what I heard: "+"\n"+ '<h3>' + toJoin.join('</h3><h3>') + '</h3>'


  console.log("ORIGINAL") 
  console.log(dump)
  var unique = dump.filter((value, index, arr) => arr.indexOf(value) === index);
  console.log("UNIQUE")
  console.log(unique)
  toSend = unique
  sendJs()
}

function sendJs()
{
  console.log("sendjs")
  console.log("HELOOOO", toSend)
  fetch('http://3.106.170.74:3000/receive', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(toSend),
  })
  .then((response) => {
    if (response.ok) {
        console.log('Data sent successfully');
    } else {
        console.error('Failed to send data');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


