const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
const jsonparser = bodyParser.json();
const urlencodedparser = bodyParser.urlencoded({ extended: false });
console.log(__dirname);
app.use(express.static(__dirname));

var object = fs.readFileSync("Library.json", "utf-8");
object = JSON.parse(object);
console.log(object);
var identifier = object.organizationIdentifier;
var objectOrganization = object.organizationName;
var attributesToBeVerifiedByOrganization = object.attributesToBeVerifiedByOrganization;
var attributesToBeVerifiedByOrganizations = object.attributesToBeVerifiedByOrganizations;
var namesOfOrganizations = object.namesofOrganizations;
var organizationsIdentifiers = object.organizationsIdentifiers;

var i = 0;
app.post("/file", urlencodedparser, (req, res) => {
    async function main() {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.    
            const network = await gateway.getNetwork('mychannel');
            // Get the contract from the network.
            const parent = network.getContract('library', 'Parent');
            await parent.submitTransaction('addFile', req.body[identifier], JSON.stringify(req.body));
            console.log(req.body.filename + ' has been added');
            // Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    main();
    console.log(req.body);
    res.redirect("/");
});

app.post("/rule", urlencodedparser, (req, res) => {
    function getDataFromServer2(data) {
        const jsondata = JSON.stringify(data);
        return fetch('http://34.70.243.42:8000/rule', {
            method: 'post',
            body: jsondata,
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json())
            .then((response) => {
                return {
                    success: true,
                    data: response
                }
            }).catch((error) => {
                throw new Error("unable to fetch the roles ")
            })
    }
    async function main() {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            // let result = await library.evaluateTransaction('addRule', 'Rule' + i, JSON.stringify(req.body));

            const parent = network.getContract('library', 'Parent');
            let result = await parent.evaluateTransaction('divideIntoSubRules', JSON.stringify(req.body), JSON.stringify(attributesToBeVerifiedByOrganizations), JSON.stringify(namesOfOrganizations));
            result = result.toString('utf-8');
            result = JSON.parse(result);
            console.log(result);

            //library sub rule adding
            const sub = network.getContract('library', 'Sub');
            await sub.submitTransaction('addSubRule', 'Rule' + i, JSON.stringify(result[objectOrganization]));
            console.log('Rule' + i + ' has been added');

            //institute sub rule adding 
            for (let i = 1; i <= namesOfOrganizations.length; i++) {
                var organization = namesofOrganizations[i - 1];
                if (organization != objectOrganization) {
                    try {
                        let { success, data } = await getDataFromServer2(result[organization]);
                    } catch (e) {
                        console.log("Error");
                    }
                }
            }

            // Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
        i++;
    }
    main();
    console.log(req.body);
    res.redirect("/");
});


app.post("/access", urlencodedparser, (req, res) => {
    function getDataFromServer2(data) {
        const jsondata = JSON.stringify(data);
        return fetch('http://34.70.243.42:8000/access', {
            method: 'post',
            body: jsondata,
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json())
            .then((response) => {
                return {
                    success: true,
                    data: response
                }
            }).catch((error) => {
                throw new Error("unable to fetch the roles ")
            })
    }
    async function main() {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            // let result = await library.evaluateTransaction('addRule', 'Rule' + i, JSON.stringify(req.body));

            const parent = network.getContract('library', 'Parent');
            let result = await parent.evaluateTransaction('divideIntoSubRequests', JSON.stringify(req.body), JSON.stringify(organizationsIdentifiers), JSON.stringify(namesOfOrganizations));
            result = result.toString('utf-8');
            result = JSON.parse(result);
            console.log(result);

            var results = [];
            const sub = network.getContract('library', 'Sub');
            let result2 = await sub.evaluateTransaction('accessrequest', result[objectOrganization][identifier], attributesToBeVerifiedByOrganization);
            result2 = result.toString('utf-8');
            result2 = JSON.parse(result2);
            results.push(result2);
            console.log(result2);

            let result1;

            for (let i = 1; i <= namesOfOrganizations.length; i++) {
                var organization = namesofOrganizations[i - 1];
                if (organization != objectOrganization) {
                    try {
                        let { success, data } = await getDataFromServer2(result[organization]);
                        result1 = data;
                        results.push(result1);
                        console.log(result1);
                    } catch (e) {
                        console.log("Error");
                    }
                }
            }


            let ans = await parent.evaluateTransaction('evaluate', JSON.stringify(results));
            ans = ans.toString('utf-8');
            console.log(ans);

            // Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
        i++;
    }
    main();
    console.log(req.body);
    res.redirect("/");
});


app.listen(8000, () => {
    console.log("listening the port at 8000");
});
