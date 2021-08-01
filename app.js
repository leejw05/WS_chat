const WebSocket = require('ws');
const express = require("express")
const app = express()
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload_files/') 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) 
    }
  })
var upload = multer({ storage : storage })

app.use(express.static('./upload_files'));

const PORT = 5000;
const ExpressPort = 3000;
const wsServer = new WebSocket.Server({port: PORT});

wsServer.on('connection', function (socket) {
    socket.on('message', function (msg) {
        wsServer.clients.forEach(function (client) {
            client.send(String(msg));
        });

    });

});

app.get("/" ,(req,res)=>{
    res.sendFile(__dirname+'/view/index.html')
})

app.post('/upload', upload.single('userfile'), function(req, res){ 
  res.send(`<script>history.back();</script>`)
  setTimeout(() => {
    wsServer.clients.forEach(function (client) {
      client.send(`File:http:localhost:3000/${req.file.originalname}`);
  });
  }, 2000);
  });
  
app.listen(ExpressPort ,()=>{
    console.log(`localhost:${PORT}`)
})