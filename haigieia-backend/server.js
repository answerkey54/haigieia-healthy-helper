const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios').default;
const fetch = require('node-fetch')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.raw({extended: true}))

const port = 3000
const token = "" // make sure to set the key after you instantiate the jaseci server!!

app.get('/', (req, res) => {
  res.send('Haigeia Backend Running')
})

app.post('/audio', (req, res) => {
  var path = req.body["path"]
  var spawn = require("child_process").spawn;
  var python = spawn('python', ["./src/speech-to-text/stt.py", path, "base"]);
  console.log(path)
  console.log("spawned child process to generate text for ", path)
  python.stdout.on('data', function(data) {
    console.log("whisper: ", data.toString())    
    var message =  data.toString
    const body  = {
      "ctx": {
          "question": `${message}`,
      },
      "name": "talk"
    }
    const repsonse = fetch("http://localhost/8000/walker-run", {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': `token ${token}`
        }
      }).then((response) => response.json())
      .then((data) => res.send(data.toString()));
  });

  
  python.stderr.on('data', function(data){
    console.log(`stderr: ${data}`)  
  })

  python.on('exit', function(code){
    console.log(`STT child process exited with code ${code}`) 
  })
});

app.post('/text', (req, res) => {
  // make sure to correctly formulate the body and the endpoint
  var message = req.body["message"]
  const body  = {
    "ctx": {
        "question": `${message}`,
    },
    "name": "talk"
  }
  const repsonse = fetch("http://localhost/8000/walker-run", {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      'Authorization': `token ${token}`
      }
  }).then((response) => response.json())
    .then((data) => res.send(data.toString()));
});


app.listen(port, () => {
  console.log(`Haigeia Backend listening on port ${port}`)
})

