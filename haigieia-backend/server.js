const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.raw({extended: true}))

const port = 3000

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
    res.send(data.toString())
  });

  
  python.stderr.on('data', function(data){
    console.log(`stderr: ${data}`)  
  })

  python.on('exit', function(code){
    console.log(`STT child process exited with code ${code}`) 
  })
  
});

app.listen(port, () => {
  console.log(`Haigeia Backend listening on port ${port}`)
})

