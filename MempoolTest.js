const Mempool = require("./Mempool");

let mempool = new Mempool();


// This makes setTimeout act like an async function
function stopper(seconds){
    return new Promise((resolve, reject) => {
        console.log(`Wait for ${seconds} seconds.`);
        setTimeout(() => {
            resolve();
        }, seconds*1000)
    })
}

async function test(){
    async function testAddDelete(){
        console.log("Begin add and delete test");

        console.log(mempool.addRequestValidation("test"));
        console.log(mempool.addRequestValidation("test2"));
        console.log(mempool.addRequestValidation("test3"));
        console.log(mempool.addRequestValidation("test"));

        await stopper(25);

        console.log(mempool.addRequestValidation("test"));
        console.log(mempool.addRequestValidation("test2"));
        console.log(mempool.addRequestValidation("test3"));
        console.log(mempool.addRequestValidation("test"));

        console.log("Finished test add and delete");

    }

    async function validationWithSignature(){
        console.log("Begin Validation test");

        console.log(mempool.addRequestValidation("valid"));
        console.log(mempool.addRequestValidation("valid2"));

        await stopper(5);

        console.log("The validation of Address 1 is " + mempool.verifyAddressRequest("valid"));
        console.log("The validation of Address 2 is " + mempool.verifyAddressRequest("valid2"));

        await stopper(5);

        console.log(mempool.validateRequestByWallet("valid", "signature"));
        console.log("The validation of Address 1 is " + mempool.verifyAddressRequest("valid"));
        console.log("The validation of Address 2 is " + mempool.verifyAddressRequest("valid2"));

        await stopper(5);

        console.log(mempool.addRequestValidation("valid"));
        console.log(mempool.addRequestValidation("valid2"));

        await stopper(10);

        console.log(mempool.addRequestValidation("valid"));
        console.log(mempool.addRequestValidation("valid2"));

        console.log("Finished validation");


    }

    await testAddDelete();
    await validationWithSignature();
}

test();


