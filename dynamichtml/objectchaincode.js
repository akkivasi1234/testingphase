/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Parent extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async addFile(ctx, filename, data) {
        console.info('============= START : Create File ===========');
        const filedata = JSON.parse(data);
        await ctx.stub.putState(filename, Buffer.from(JSON.stringify(filedata)));
        console.info('============= END : Create File ===========');
    }

    async divideIntoSubRules(ctx, ruleno, designation, department, filetype, sensitivity) {
        const result = [{
            docType: 'subrule',
            designation: designation,
            department: department
        }, {
            docType: 'subrule',
            filetype: filetype,
            sensitivity: sensitivity
        }];
        return JSON.stringify(result);
    }


    async divideIntoSubRequests(ctx, rollno, filename) {
        const result = [{
            docType: 'subrequest',
            rollno: rollno
        }, {
            docType: 'subrequest',
            filename: filename
        }];
        return JSON.stringify(result);
    }

    async evaluate(ctx, result1, result2) {
        result1 = JSON.parse(result1);
        result2 = JSON.parse(result2);
        let len = result1.length;
        let i = 0;
        for (i = 0; i < len; i++) {
            if (result1[i] == "yes" && result2[i] == "yes") {
                return "Access Granted";
            }
        }
        if (i == len) {
            return "Access Denied";
        }
    }
    // async addRule(ctx, ruleno, designation, department, operation, filetype, sensitivity) {
    // async addRule(ctx, ruleno, req) {
    //     console.log(req);
    //     req = JSON.parse(req);
    //     const result = [{
    //         des: req.designation
    //     }, {
    //         dep: req.department
    //     }];
    //     console.info('============= START : Create Rule ===========');
    //     // const rule = {
    //     //     docType: 'rule',
    //     //     operation,
    //     //     filetype,
    //     //     sensitivity,
    //     // };
    //     // await ctx.stub.putState(ruleno, Buffer.from(JSON.stringify(rule)));
    //     // const result = [{
    //     //     name: "akhil",
    //     //     age: 29,
    //     //     op: operation
    //     // }, {
    //     //     name: "nikhil",
    //     //     age: 15,
    //     //     type: filetype
    //     // }];
    //     return JSON.stringify(result);
    //     console.info('============= END : Create Rule ===========');
    // }

}

class Sub extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async addSubRule(ctx, ruleno, data) {
        console.info('============= START : Create SubRule ===========');
        const ruledata = JSON.parse(data);
        await ctx.stub.putState(ruleno, Buffer.from(JSON.stringify(ruledata)));
        console.info('============= END : Create SubRule ===========');
    }
    async accessrequest(ctx, filename) {
        const result = [];
        const fileAsBytes = await ctx.stub.getState(filename);
        if (!fileAsBytes || fileAsBytes.length == 0) {
            throw new Error(`${filename} does not exist`);
        }
        const file = JSON.parse(fileAsBytes.toString());
        const filetype = file.filetype;
        const sensitivity = file.sensitivity;

        let i = 0;
        while (true) {
            let ruleAsBytes = await ctx.stub.getState('Rule' + i);
            if (!ruleAsBytes || ruleAsBytes.length == 0) {
                break;
            }
            let rule = JSON.parse(ruleAsBytes.toString());
            if (filetype == rule.filetype && sensitivity <= rule.sensitivity) {
                result.push("yes");
            } else {
                result.push("no");
            }
            i++;
        }
        return JSON.stringify(result);
    }
}
module.exports.Sub = Sub;
module.exports.Parent = Parent;