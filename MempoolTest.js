const Mempool = require("./Mempool");

let mempool = new Mempool();

console.log(mempool.addRequestValidation("test"));
console.log(mempool.addRequestValidation("test2"));
console.log(mempool.addRequestValidation("test3"));
console.log(mempool.addRequestValidation("test"));
console.log("Wait for 25sec")

setTimeout(() => {
    console.log(mempool.addRequestValidation("test"));
    console.log(mempool.addRequestValidation("test2"));
    console.log(mempool.addRequestValidation("test3"));
    console.log(mempool.addRequestValidation("test"));

}, 25*1000);


