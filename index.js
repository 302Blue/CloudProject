const http = require('http');
const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const server = http.createServer(router);
const io = require('socket.io')(http);
const cors = require('cors');
const port = process.env.PORT || 3000;

//sudo npm install @google-cloud/firestore
//sudo npm i -s express socket.io
const Firestore = require("@google-cloud/firestore")
const db = new Firestore({
    projectId: "cloudproject-255316",
    keyFilename: "./keyFile.json"
});

// Setup real-time listener
db.collection("vmworld").doc("messages").onSnapshot((docSnap) => {
  console.log(`Document Data Now: ${JSON.stringify(docSnap.data())}`)
});

router.use(express.static(__dirname + './'));
router.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
    sendMsg(msg);
  });
});

function sendMsg(msg) {
  return db.collection('vmworld').doc('messages').set();
}

function showInfo() {
  let info = document.querySelector('.tables');
  if (info.style.display === "none") {
    info.style.display = "block";
  } 
}

function showDeletes() {
    var del = document.querySelector('.deletebtns');
    if (del.style.display === "none") {
      del.style.display = "block";
    } else {
      del.style.display = "none";
    }
} 

function sendTest() {
  $.ajax({
    url: "http://35.231.236.18:8080/test",
    contentType: "application/json",
    type: "GET",
    statusCode: {
      201: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
}

function sendCreate() {
  $.ajax({
    url: "http://35.231.236.18:8080/make",
    contentType: "application/json",
    type: "POST",
    statusCode: {
      201: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showInfo();
}

function sendCreateID() {
  let id = document.getElementById('idNum').innerText;
  $.ajax({
    url: `http://35.231.236.18:8080/make/${id}`,
    contentType: "application/json",
    type: "POST",
    statusCode: {
      201: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showInfo();
}

function sendRead() {
  $.ajax({
    url: "http://35.231.236.18:8080/list",
    contentType: "application/json",
    type: "GET",
    statusCode: {
      200: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    },
  });
}

function sendUpdate() {
  $.ajax({
    url: "http://35.231.236.18:8080/list",
    contentType: "application/json",
    type: "GET",
    statusCode: {
      200: function (res) {
        $("#infoTable tbody tr").remove();
        for (let i = 0; i < res.length; i++) {
          $("#infoTable")
            .append($('<tr>')
              .append($('<td>')
                .text(`--> ${res[i]}`)
              )
            );
        }
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    },
  });
  showInfo();
}

function sendDeleteID() {
  let id = document.getElementById('idNum').innerText;
  $.ajax({
    url: `http://35.231.236.18:8080/delete/${id}`,
    contentType: "application/json",
    type: "DELETE",
    statusCode: {
      200: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showDeletes();
}

function sendDeleteAll() {
  $.ajax({
    url: "http://35.231.236.18:8080/delete",
    contentType: "application/json",
    type: "DELETE",
    statusCode: {
      200: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showDeletes();
}

server.listen(8080, '0.0.0.0');
console.log("Server Started");