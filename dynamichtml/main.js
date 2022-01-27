const fs = require('fs');
const prompt = require("prompt-sync")();

//Organizations names 
var noOfSubjectOrganizations = prompt("How many Subject Organizations? ");
var namesOfSubjectOrganizations = [];
for (let i = 1; i <= noOfSubjectOrganizations; i++) {
    var organization = prompt(`What is the name of Subject Organization ${i}? `);
    namesOfSubjectOrganizations.push(organization);
}
var objectOrganization = prompt("What is the name of Object Organization? ");
var namesofOrganizations = namesOfSubjectOrganizations;
namesofOrganizations.push(objectOrganization);









//Subject Organization Identifiers
var organizationsIdentifiers = {};
for (let i = 1; i <= noOfSubjectOrganizations; i++) {
    var subjectOrganization = namesOfSubjectOrganizations[i - 1];
    var identifier = prompt(`What is the name of Subject Identifier of ${subjectOrganization}? `);
    organizationsIdentifiers[subjectOrganization] = identifier;
}

//Object Organization Identifier
var identifier = prompt(`What is the name of Object Identifier of ${objectOrganization}? `);
organizationsIdentifiers[objectOrganization] = identifier;











//Subject Organization Attributes
var attributesToBeVerifiedByOrganizations = {};
for (let i = 1; i <= noOfSubjectOrganizations; i++) {
    var subjectOrganization = namesOfSubjectOrganizations[i - 1];
    var numberOfAttributes = prompt(`What is the number of attributes to be verified by ${subjectOrganization}? `);
    var attributes = [];
    for (let j = 1; j <= numberOfAttributes; j++) {
        var attribute = prompt(`What is the name of attribute ${j} to be verified by ${subjectOrganization}? `);
        attributes.push(attribute);
    }
    attributesToBeVerifiedByOrganizations[subjectOrganization] = attributes;
}

//Object Organization Attributes
var numberOfAttributes = prompt(`What is the number of attributes to be verified by ${objectOrganization}? `);
var attributes = [];
for (let j = 1; j <= numberOfAttributes; j++) {
    var attribute = prompt(`What is the name of attribute ${j} to be verified by ${objectOrganization}? `);
    attributes.push(attribute);
}
attributesToBeVerifiedByOrganizations[objectOrganization] = attributes;









//Creating json files for Subject Organziations
for (let i = 1; i <= noOfSubjectOrganizations; i++) {
    var organizationName = namesOfSubjectOrganizations[i - 1];
    var organizationIdentifier = organizationsIdentifiers[organizationName];
    var attributesToBeVerifiedByOrganization = attributesToBeVerifiedByOrganizations[organizationName];
    const data = {
        organizationName,
        organizationIdentifier,
        attributesToBeVerifiedByOrganization,
    }
    fs.writeFileSync(`${organizationName}.json`, JSON.stringify(data));
}


//Creating json file for Object Organization
var organizationName = objectOrganization;
var organizationIdentifier = organizationsIdentifiers[organizationName];
var attributesToBeVerifiedByOrganization = attributesToBeVerifiedByOrganizations[organizationName];
const data = {
    organizationName,
    organizationIdentifier,
    attributesToBeVerifiedByOrganization,
    namesofOrganizations,
    organizationsIdentifiers,
    attributesToBeVerifiedByOrganizations,
}
fs.writeFileSync(`${organizationName}.json`, JSON.stringify(data));
