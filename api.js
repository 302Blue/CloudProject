const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const app = require('./app.js');

const router = express();
const server = http.createServer(router);
console.log("Started");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(__dirname + "/VMs"));

let VMs = [];

router.get('/', function (req, res) {
    res.send('Test Express');
});

router.get('/VMs', function(req, res){
    res.json(VMs);
});

router.post('/VMs', function(req, res){
    res.json(VMs);
});

router.put('/VMs', function(req, res){
    res.json(VMs);
});

router.delete('/VMs', function(req, res){
    res.json(VMs);
});

console.log(request);
console.log(request.method);
console.log(request.url);
response.setHeader('Content-Type', 'text/html');
response.write("<p>Hello there</p>");
response.end("<p>I think I'm done</p>");

server.listen(8080, '0.0.0.0');

function showInfo() {
    let infoTable = document.getElementById('infoTable');

    for (let i = 0; i < rowCount; i++) {
        let row = infoTable.rows[i];
        row.deleteCell(0);
        infoTable.deleteRow(i);
    }

    for (let i = 0; i < vms.length; i++) {
        let row = document.createElement('tr');
        let cell = row.insertCell(0);
        cell.innerHTML = api.getVMs()[i];
    }
}

function GET(req, res) {
    showInfo();
}

function POST(req, res) {
    showInfo();
}

function PUT(req, res) {
    showInfo();
}

function DELETE(req, res) {
    showInfo();
}







const app = express();
app.use(cors({ origin: true }));

app.get('/vms', (req, res) => res.send(`GET /api/`));
app.post('/vms', (req, res) => res.send(`POST /api/`));
app.delete('/vms', (req, res) => res.send(`DELETE /api/`));

export const api = functions.https.onRequest(app);

function updateHTML() {
    getVMs();
}

$.ajax({
    url: "./api.js",
    contentType: "script",
    success: success
});



