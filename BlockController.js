// This is the server code using Express.js
// It only responds to routes, and requests corresponding methods in Blockchain.js
// There should be no direct data access code in this file

const SHA256 = require('crypto-js/sha256');
const Blockchain = require('./Blockchain.js');
const Block = require('./Block');
const Mempool = require('./Mempool');

// Constants used for error handing
const NOT_INTEGER = {"error": "The block height must be a positive integer"};
const NOT_FOUND = {"error": "That block does not exist"};
const NOT_VALID_REQUEST = {"error": "Your request body must have a 'body' field, and there must not be empty."};
const ADD_FAILED = {"error":"The block was not added successfully. Please try again later."}
const NOT_VALID_SIGNATURE = {"error": "The signature provided is not valid for the provided address."}

// error message generator
not_valid_request = (field) => 
    {return {"error": `Your request body must have a '${field}' field, and there must not be empty.`};}

class BlockController{
    /**
     * Constructor to create a new BlockController. All end points are initialized.
     * @param {*} app 
     */
    constructor(app){
        // Initialize Express.js
        this.app = app;

        // Initialize the blockchain at the construction stage of this controller
        // The process of genesis block creation is already implemented in this class
        this.chain = new Blockchain();

        // Initialize the mempool
        this.mempool = new Mempool();

        // Register routes related to this class
        this.test();

    }

    
    test(){
        this.app.post("/requestValidation", (req, res) => { 
            const address = req.body.address;
            if(!address){
                res.status(400);
                res.json(not_valid_request("address"));
            }

            // Add the address into mempool and get the result from mempool
            const requestObject = this.mempool.addRequestValidation(address);

            res.json(requestObject);
        });

        this.app.post("/message-signature/validate", (req, res) => {
            const address = req.body.address;
            if(!address){
                res.status(400);
                res.json(not_valid_request("address"));
            }
            const signature = req.body.signature;
            if(!signature){
                res.status(400);
                res.json(not_valid_request("signature"));
            }

            // Verify the signature
            const validObject = this.mempool.validateRequestByWallet(address, signature);

            // If the signature is rejected
            if(!validObject){
                res.status(403);
                res.json(NOT_VALID_SIGNATURE);
            }

            res.json(validObject);
        })

        

    }
}

/**
 * Exporting the BlockController class
 * Curry function so that whatever module using this class can pass the app object into this class
 * Which means that index.js can correctly initialize Express.js
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}