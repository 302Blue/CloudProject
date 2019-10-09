//Set http header and content type for easier compatibility
header('HTTP/1.1 200 OK');
header('Content-Type: script');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Headers:*');
header('Access-Control-Allow-Methods:*');

import Compute from '@google-cloud/compute';

const compute = new Compute({
    projectId: 'cloudproject-255316',
    keyFilename: './keyFile.json'
});

async function getVMs() {
    const vms = await compute.getVMs({ maxResults: 10 });
    console.log(`Found ${vms.length} VMs!`);
    vms.forEach(vm => console.log(vm));
    return vms;
}

function findName() {
    let name = 'cloudproject-0';
    let vms = getVMs();
    for (let i = 0; i < vms.length; i++) {
        if (vms[i] != name) {
            name = `cloudproject-${i}`;
            break;
        }
    }
    return name;
}

const name = findName();
const zone = compute.zone('us-east1-b');

const config = {
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
            'deviceName': name,
            'initializeParams': {
                'sourceImage': 'projects/cloudproject-255316/global/images/cloudproject-img',
                'diskType': 'projects/cloudproject-255316/zones/us-east1-b/diskTypes/pd-standard',
                'diskSizeGb': 25
            }
        }
    ],
};

function makeVMs() {
    zone.createVM(name, config)
        .then(() => {
            console.log('Created VM');
            return zone.vm(name).getMetadata();
        })
        .then((data) => {
            console.log('Got the meta');
            const pubIP = data[0].networkInterfaces[0].accessConfigs[0].natIP; // Public IP to access VM
            console.log(`Launching VM with ip: ${pubIP}, wait 20 seconds before sshing...`);
            const setMeta = {
                'ssh-keys': 'bookw:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDFGZU2jT5yIat9nIcn6OFF5Q5jcUHrQT+wViAQvDZC57mCPYR+hVfK4S7hsxyi8/Vv/Rv7GYGBvX8AemBq5Ra0gHkalofbmteX8AOM4XyynQxsjkwiVRj8VFwflyGpDOGfmZHv8O94H2BNaido0+vDpo7Lh6KjlUIZ/kH3FQ5BzLhU4lcGWq4RdeTuHE915PcdkHLTBpBZNIahBoSM3W0TUI3wY4bBoK52vX1ttOA2RtSIX8CISv+FsMsRtYgLJQfsfBiGeGalfbfgaxuqUFBtHQIpHYFKcITsPsmKviJBVrobgI09ivnDST242B0bIFvsQy32+RTYhB7AxHSfAgX1 bookw@DrewLaptop'
            };
            return zone.vm(name).setMetadata(setMeta); // Set the metadata (put your ssh key in)
        })
        .then(() => {
            console.log('Launched VM!');
        })
        .catch((err) => {
            console.log(err);
        });
    console.log(`VM ${name} created!`);
}

async function deleteVMs() {
    let vms = getVMs();
    for (let i = 0; i < vms.length; i++) {
        const vm = zone.vm(`cloudproject-${i}`);
        const [operation] = await vm.delete();
        await operation.promise();
        console.log(`VM cloudproject-${i} destroyed!`);
    }
}

async function deleteVM(num) {
    const vm = zone.vm(`cloudproject-${num}`);
    const [operation] = await vm.delete();
    await operation.promise();
    console.log(`VM cloudproject-${num} destroyed!`);
}

async function checkVMs() {
    // I don't know what to put here yet
    // It'll probably be for load balancing
}

function sendData() {
    JSON.encode(getVMs());
}
