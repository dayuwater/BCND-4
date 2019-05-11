const Block = require('./Block');
const Blockchain = require('./Blockchain');

/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

let myBlockChain = new Blockchain();

async function test(){
	async function getTheHeightOfChain(){
		console.log("Getting the height of the chain In Test");
		const height = await myBlockChain.getBlockHeight()
		.catch((err) => { console.log(err);});

		console.log(height);
		console.log("=======================");
	}

	async function getABlock(){
		console.log("Function to get a block");
		const block = await myBlockChain.getBlock(5)
		.catch((err) => { console.log(err); });

		console.log(block);
		console.log("========================");
	}

	// TODO: Add a test for getting block by hash
	async function getBlockByHash(){
		console.log("Function to get a block by hash");
		console.log("Getting the block with height 1");
		const block = await myBlockChain.getBlock(1)
		.catch((err) => { console.log(err); return null; });

		if(block){
			console.log(block);
			console.log("Now getting that block again by using the hash");
			const blockHash = block.hash;
			console.log("The block hash is " + blockHash);
			const blockData = await myBlockChain.getBlockByHash(blockHash);
			console.log(blockData);

			console.log("Now try to get a block using an invalid hash");
			const nonExist = await myBlockChain.getBlockByHash("test");
			console.log(nonExist);
		}
		else{
			console.log("Block 1 does not exist");
		}
		console.log("=========================")
	}

	// TODO: Add a test for getting block by address
	async function getBlockByAddress(){
		console.log("Function to get a block by address");
		console.log("Getting the blocks with the address same as height 1");
		const block = await myBlockChain.getBlock(1)
		.catch((err) => { console.log(err); return null; });

		if(block){
			console.log(block);
			console.log("Now getting that block again by using the address");
			const blockAddress = block.body.address;
			console.log("The block address is " + blockAddress);
			const blockData = await myBlockChain.getBlocksByAddress(blockAddress);
			console.log(blockData);

			console.log("Now try to get a block using an invalid address");
			const nonExist = await myBlockChain.getBlocksByAddress("address");
			console.log(nonExist);
		}
		else{
			console.log("Block 1 does not exist");
		}
		console.log("=========================")

	}

	async function validateBlock(){
		console.log("Validate block");
		const valid = await myBlockChain.validateBlock(2)
		.catch((error) => {console.log(error);})

		console.log(valid);
		console.log("==========================")
	}

	async function validateChain(){
		console.log("Validate chain");
		// Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
		const errorLog = await myBlockChain.validateChain()
		.catch((error) => {
			console.log(error);
		})

		errorLog.length > 0 ? errorLog.forEach(err => console.log(err)) : console.log("The chain is valid");

	}


	async function tamperBlock(){
		console.log("Tampering block");
		myBlockChain.getBlock(5).then((block) => {
			let blockAux = block;
			blockAux.body = "Tampered Block";
			myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
				if (blockModified) {
					myBlockChain.validateBlock(blockAux.height).then((valid) => {
						console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
					})
						.catch((error) => {
							console.log(error);
						})
				} else {
					console.log("The Block wasn't modified");
				}
			}).catch((err) => { console.log(err); });
		}).catch((err) => { console.log(err); });
		myBlockChain.getBlock(6).then((block) => {
			let blockAux = block;
			blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
			myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
				if (blockModified) {
					console.log("The Block was modified");
				} else {
					console.log("The Block wasn't modified");
				}
			}).catch((err) => { console.log(err); });
		}).catch((err) => { console.log(err); });
		console.log();

		console.log("===========================");

	}

	
	await getTheHeightOfChain();
	await getABlock();
	await getBlockByHash();
	await getBlockByAddress();
	await validateBlock();
	await validateChain();
	

	await tamperBlock();

	// Add blocks
	(function theLoop (i) {
		setTimeout(function () {
			let blockTest = new Block("Test Block - " + (i + 1));
			// Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
			myBlockChain.addBlock(blockTest).then((result) => {
				console.log(result);
				i++;
				if (i < 10) theLoop(i);
			});
		}, 10000);
	})(0);
}

test();




/******************************************
 ** Function for Create Tests Blocks   ****
 ******************************************/



// /***********************************************
//  ** Function to get the Height of the Chain ****
//  ***********************************************/

// /*
// // Be careful this only will work if `getBlockHeight` method in Blockchain.js file return a Promise
// */

// console.log("Getting the height of the chain");
// myBlockChain.getBlockHeight().then((height) => {
// 	console.log(height);
// }).catch((err) => { console.log(err);});
// console.log();

// /***********************************************
//  ******** Function to Get a Block  *************
//  ***********************************************/

// /*
// // Be careful this only will work if `getBlock` method in Blockchain.js file return a Promise
// */

// console.log("Function to get a block");
// myBlockChain.getBlock(5).then((block) => {
// 	console.log(JSON.stringify(block));
// }).catch((err) => { console.log(err);});
// console.log();

// /***********************************************
//  ***************** Validate Block  *************
//  ***********************************************/

// /*
// // Be careful this only will work if `validateBlock` method in Blockchain.js file return a Promise
// */

// console.log("Validate block");
// myBlockChain.validateBlock(0).then((valid) => {
// 	console.log(valid);
// })
// .catch((error) => {
// 	console.log(error);
// })
// console.log();

// /** Tampering a Block this is only for the purpose of testing the validation methods */
// console.log("Tampering block")
// myBlockChain.getBlock(5).then((block) => {
// 	let blockAux = block;
// 	blockAux.body = "Tampered Block";
// 	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
// 		if(blockModified){
// 			myBlockChain.validateBlock(blockAux.height).then((valid) => {
// 				console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			})
// 		} else {
// 			console.log("The Block wasn't modified");
// 		}
// 	}).catch((err) => { console.log(err);});
// }).catch((err) => { console.log(err);});
// myBlockChain.getBlock(6).then((block) => {
// 	let blockAux = block;
// 	blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
// 	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
// 		if(blockModified){
// 			console.log("The Block was modified");
// 		} else {
// 			console.log("The Block wasn't modified");
// 		}
// 	}).catch((err) => { console.log(err);});
// }).catch((err) => { console.log(err);});
// console.log();


/***********************************************
 ***************** Validate Chain  *************
 ***********************************************/

/*
// Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
myBlockChain.validateChain().then((errorLog) => {
	if(errorLog.length > 0){
		console.log("The chain is not valid:");
		errorLog.forEach(error => {
			console.log(error);
		});
	} else {
		console.log("No errors found, The chain is Valid!");
	}
})
.catch((error) => {
	console.log(error);
})
*/





