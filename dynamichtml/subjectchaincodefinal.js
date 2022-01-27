/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Institute extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async addSubject(ctx, subjectIdentifier, data) {
        console.info('============= START : Create User ===========');
        const subjectdata = JSON.parse(data);
        await ctx.stub.putState(subjectIdentifier, Buffer.from(JSON.stringify(subjectdata)));
        console.info('============= END : Create User ===========');
    }

    async addSubRule(ctx, ruleno, data) {
        console.info('============= START : Create Rule ===========');
        const ruledata = JSON.parse(data);
        await ctx.stub.putState(ruleno, Buffer.from(JSON.stringify(ruledata)));
        console.info('============= END : Create Rule===========');
    }

    async accessrequest(ctx, subjectIdentifier, attributesToBeVerifiedByOrganization) {
        const result = [];
        console.info('=========== START : Get User Attributes with given rollno ==========')
        const userAsBytes = await ctx.stub.getState(subjectIdentifier);
        if (!userAsBytes || userAsBytes.length == 0) {
            throw new Error(`${subjectIdentifier} does not exist`);
        }
        const user = JSON.parse(userAsBytes.toString());
        attributesToBeVerifiedByOrganization = JSON.parse(attributesToBeVerifiedByOrganization);
        let i = 0;
        while (true) {
            let ruleAsBytes = await ctx.stub.getState('Rule' + i);
            if (!ruleAsBytes || ruleAsBytes.length == 0) {
                break;
            }
            let rule = JSON.parse(ruleAsBytes.toString());
            let j;
            for (j = 1; j <= attributesToBeVerifiedByOrganization.length; j++) {
                let attribute = attributesToBeVerifiedByOrganization[j - 1];
                if (user[attribute] != rule[attribute]) {
                    result.push(false);
                    break;
                }
            }
            if (j == attributesToBeVerifiedByOrganization.length + 1) {
                result.push(true);
            }
            i++;
        }
        console.info('=========== END : Get User Attributes with given rollno ==========');
        return JSON.stringify(result);
    }
}

module.exports.Institute = Institute;

