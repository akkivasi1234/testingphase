const prompt = require("prompt-sync")();
const nooforganizations = prompt("How many attribute authorities? ");
var namesOfOrganizations = [];
for (let i = 1; i <= nooforganizations; i++) {
    var organization = prompt(`What is the name of Organization${i}? `);
    namesOfOrganizations.push(organization);
}
console.log(namesOfOrganizations);
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
var globalrule = {};
for (let i = 1; i <= totalNoOfAttributesToBeVerified; i++) {
    var attributename = prompt(`What is the name of the attribute? `);
    var attributeValue = prompt(`What is the value of the attribute? `);
    globalrule[attributename] = attributeValue;
}
console.log(globalrule);

var subrules = [];

for (let i = 1; i <= nooforganizations; i++) {
    var subrule = {};
    var attributesToBeVerifiedByOrganization = attributesToBeVerifiedByOrganizations[namesOfOrganizations[i - 1]];
    console.log(attributesToBeVerifiedByOrganization);
    for (let j = 0; j < attributesToBeVerifiedByOrganization.length; j++) {
        subrule[attributesToBeVerifiedByOrganization[j]] = globalrule[attributesToBeVerifiedByOrganization[j]];
    }
    subrules.push(subrule);
}
console.log(subrules);