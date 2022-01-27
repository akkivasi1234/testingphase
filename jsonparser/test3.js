const fs = require('fs');
const prompt = require("prompt-sync")();

//Organizations
const nooforganizations = prompt("How many attribute authorities? ");
var namesOfOrganizations = [];
for (let i = 1; i <= nooforganizations; i++) {
    var organization = prompt(`What is the name of Organization${i}? `);
    namesOfOrganizations.push(organization);
}
console.log(namesOfOrganizations);


//Specifying which attributes are being verified by which organization
var attributesToBeVerifiedByOrganizations = {};
let totalNoOfAttributesToBeVerified = 0;
for (let i = 1; i <= nooforganizations; i++) {
    var organization = namesOfOrganizations[i - 1];
    let numberofattributes = prompt(`What is the number of attributes to be verified by ${organization}? `);
    totalNoOfAttributesToBeVerified = parseInt(totalNoOfAttributesToBeVerified) + parseInt(numberofattributes);
    var attributes = [];
    for (let j = 1; j <= numberofattributes; j++) {
        var attribute = prompt(`What is the name of attribute ${j} to be verified by ${organization}? `);
        attributes.push(attribute);
    }
    attributesToBeVerifiedByOrganizations[organization] = attributes;
}
console.log(attributesToBeVerifiedByOrganizations);

//reading global rules from file rules.json
let globalrules = fs.readFileSync("rules.json", "utf-8");
globalrules = JSON.parse(globalrules);
// console.log(globalrules);

//parsing global rules into sub rules
var subrulesForAllGlobalRules = {};
for (let i = 1; i <= nooforganizations; i++) {
    subrulesForAllGlobalRules[namesOfOrganizations[i - 1]] = [];
    var attributesToBeVerifiedByOrganization = attributesToBeVerifiedByOrganizations[namesOfOrganizations[i - 1]];
    for (let k = 0; k < globalrules.length; k++) {
        var globalrule = globalrules[k];
        var subruleForOneGlobalRule = {};
        // console.log(attributesToBeVerifiedByOrganization);
        for (let j = 0; j < attributesToBeVerifiedByOrganization.length; j++) {
            subruleForOneGlobalRule[attributesToBeVerifiedByOrganization[j]] = globalrule[attributesToBeVerifiedByOrganization[j]];
        }
        subrulesForAllGlobalRules[namesOfOrganizations[i - 1]].push(subruleForOneGlobalRule);
    }
}
// console.log(subrulesForAllGlobalRules);

//writing subrules back to subrules.json
subrulesForAllGlobalRules = JSON.stringify(subrulesForAllGlobalRules);
fs.writeFileSync("subrules.json", subrulesForAllGlobalRules);