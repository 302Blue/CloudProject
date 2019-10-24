//npm i -s express @google-cloud/compute
const http = require('http');
const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const server = http.createServer(router);
const cors = require('cors');

const Compute = require('@google-cloud/compute');
const compute = new Compute({
    projectId: 'cloudproject-255316',
    keyFilename: './keyFile.json'
});
const zone = compute.zone('us-east1-b');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(__dirname + "/"));
router.use(cors({ origin: true }));

async function getVMs() {
    try {
        let vm = [];
        let vms = await compute.getVMs({ maxResults: 10 });
        console.log(`Found ${vms[0].length} VM(s)!`);
        for (let i = 0; i < vms[0].length; i++) {
            let temp = vms[0][i].metadata.name;
            console.log(`${i+1}: ${temp}`);
            vm.push(temp);
        } 
        return (vm);
    } catch (error) { console.log(error); }  
}

async function findName() {
    try {
        let name = 'cloudproject-0';
        let vm = await getVMs();
        for (let i = 0; i < vm.length; i++) {
            if (vm.includes(name)) {
                name = `cloudproject-${i+1}`;
            }
        }
        console.log(`Next Available Name: ${name}!`);
        return (name); 
    } catch (error) { console.log(error); }    
}

var config = {
    http: true,
    https: true,
    machineType: 'n1-standard-1',
    tags: [
        'http-server',
        'https-server'
    ],
    // Here is that code I gave you before:
    'disks': [
        {
            'kind': 'compute#attachedDisk',
            'type': 'PERSISTENT',
            'boot': true,
            'mode': 'READ_WRITE',
            'autoDelete': true,
            'deviceName': "",
            'initializeParams': {
                'sourceImage': 'projects/cloudproject-255316/global/images/cloudproject-img',
                'diskType': 'projects/cloudproject-255316/zones/us-east1-b/diskTypes/pd-standard',
                'diskSizeGb': 25
            }
        }
    ],
};


router.get('/test', function test(req, res) {
    console.log(req.url);
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.send('Test Express');
});

router.get('/list', async function listVMs (req, res) {
    try {
        let vm = await getVMs();
        res.send(vm);
    } catch (error) { console.log(error); }    
});

router.post('/make', async function makeVMs(req, res) {
    let name = await findName();
    config.disks[0].deviceName = name;
    zone.createVM(name, config)
        .then(() => {
            console.log(`Creating VM ${name}...`);
            return zone.vm(name).getMetadata();
        })
        .then((data) => {
            console.log('Got the Metadata...');
            const pubIP = data[0].networkInterfaces[0].accessConfigs[0].natIP; // Public IP to access VM
            console.log(`Wait 20 seconds before sshing...`);
            const setMeta = {
                'ssh-keys': 'bookw:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDFGZU2jT5yIat9nIcn6OFF5Q5jcUHrQT+wViAQvDZC57mCPYR+hVfK4S7hsxyi8/Vv/Rv7GYGBvX8AemBq5Ra0gHkalofbmteX8AOM4XyynQxsjkwiVRj8VFwflyGpDOGfmZHv8O94H2BNaido0+vDpo7Lh6KjlUIZ/kH3FQ5BzLhU4lcGWq4RdeTuHE915PcdkHLTBpBZNIahBoSM3W0TUI3wY4bBoK52vX1ttOA2RtSIX8CISv+FsMsRtYgLJQfsfBiGeGalfbfgaxuqUFBtHQIpHYFKcITsPsmKviJBVrobgI09ivnDST242B0bIFvsQy32+RTYhB7AxHSfAgX1 bookw@DrewLaptop'
            };
            return zone.vm(name).setMetadata(setMeta); // Set the metadata (put your ssh key in)
        })
        .then(() => {
            console.log(`Created VM ${name}!`);
        })
        .catch((error) => {
            console.log(error);
        });    
    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/html');
    res.send(`Created VM ${name}!`);
}); 

router.post(`/make/:id`, async function makeVM(req, res) {
    let name = `cloudproject-${req.params.id}`;
    config.disks[0].deviceName = name;
    zone.createVM(name, config)
        .then(() => {
            console.log(`Creating VM ${name}...`);
            return zone.vm(name).getMetadata();
        })
        .then((data) => {
            console.log('Got the Metadata...');
            const pubIP = data[0].networkInterfaces[0].accessConfigs[0].natIP; // Public IP to access VM
            console.log(`Wait 20 seconds before sshing...`);
            const setMeta = {
                'ssh-keys': 'bookw:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDFGZU2jT5yIat9nIcn6OFF5Q5jcUHrQT+wViAQvDZC57mCPYR+hVfK4S7hsxyi8/Vv/Rv7GYGBvX8AemBq5Ra0gHkalofbmteX8AOM4XyynQxsjkwiVRj8VFwflyGpDOGfmZHv8O94H2BNaido0+vDpo7Lh6KjlUIZ/kH3FQ5BzLhU4lcGWq4RdeTuHE915PcdkHLTBpBZNIahBoSM3W0TUI3wY4bBoK52vX1ttOA2RtSIX8CISv+FsMsRtYgLJQfsfBiGeGalfbfgaxuqUFBtHQIpHYFKcITsPsmKviJBVrobgI09ivnDST242B0bIFvsQy32+RTYhB7AxHSfAgX1 bookw@DrewLaptop'
            };
            return zone.vm(name).setMetadata(setMeta); // Set the metadata (put your ssh key in)
        })
        .then(() => {
            console.log(`Created VM ${name}!`);
        })
        .catch((err) => {
            console.log(err);
        });    
    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/html');
    res.send(`Created VM ${name}!`);
});

router.delete('/delete', async function deleteVMs(req, res) {
    console.log(`Destroying all VMs...`);
    try {
        let vms = await getVMs();
        for (let i = 0; i < vms.maxResults; i++) {
            let name = `cloudproject-${i}`;
            if (vms.includes(name)) {
                const vm = zone.vm(name);
                const [operation] = await vm.delete();
                await operation.promise();
                console.log(`Destroyed VM ${name}!`);
            }
        }
        console.log(`Destroyed all VMs!`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.send(`Destroyed all VMs!`);
    } catch (error) { console.log(error); }    
});

router.delete(`/delete/:id`, async function deleteVM(req, res) {
    try {
        let id = req.params.id;
        let vm = zone.vm(`cloudproject-${id}`);
        let [operation] = await vm.delete();
        await operation.promise();
        console.log(`Destroyed VM cloudproject-${id}!`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.send(`Destroyed VM cloudproject-${id}!`);
    } catch (error) { console.log(error); }
});

server.listen(8080, '0.0.0.0');
console.log("Server Started");