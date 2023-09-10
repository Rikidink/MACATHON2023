var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var dump =[]

var recognition = new SpeechRecognition();

recognition.continuous = true  ;
recognition.lang = 'en-US';
recognition.interimResults = false;

var diagnostic = document.querySelector('.output');
var hints = document.querySelector('.hints');

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
    compile(event)
    

  }}}

recognition.onspeechend = function() {
  document.querySelector("#status").textContent ="Done..."
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
  console.log("ORIGINAL") 
  console.log(dump)
  var unique = dump.filter((value, index, arr) => arr.indexOf(value) === index);
  console.log("UNIQUE")
  return unique
}


