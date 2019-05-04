// This is the server code using Express.js
// It only responds to routes, and requests corresponding methods in Blockchain.js
// There should be no direct data access code in this file

const SHA256 = require('crypto-js/sha256');
const Blockchain = require('./Blockchain.js');
const Block = require('./Block');
const Mempool = require('./Mempool');
const H2A = require('hex2ascii');

// Constants used for error handing
const NOT_INTEGER = {"error": "The block height must be a positive integer"};
const NOT_FOUND = {"error": "That block does not exist"};
const NOT_VALID_REQUEST = {"error": "Your request body must have a 'body' field, and there must not be empty."};
const ADD_FAILED = {"error":"The block was not added successfully. Please try again later."}
const NOT_VALID_SIGNATURE = {"error": "The signature provided is not valid for the provided address."}
const NOT_VALID_ADDRESS = {"error": "The address was not validated before. Please request validation first."}
const NOT_VALID_STAR_INFO = {"error": "Your star info must have valid dec, ra, and story fields"}

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

        this.app.post("/block", async (req, res) => {
            const address = req.body.address;
            if(!address){
                res.status(400);
                res.json(not_valid_request("address"));
            }

            // check if the address is validated before
            const addressValidated = await this.mempool.verifyAddressRequest(address);
            // If the address is not validated before, forbid the request
            if(!addressValidated){
                res.status(403);
                res.json(NOT_VALID_ADDRESS)
            }

            // check for required fields
            const star = req.body.star;
            if(!star){
                res.status(400);
                res.json(not_valid_request("star"));
            }
            const {dec, ra, story} = star;
            if(!dec || !ra || !story){
                res.status(400);
                res.json(NOT_VALID_STAR_INFO);
            }

            // Encode the star story
            star.story = Buffer.from(star.story).toString('hex');

            // Add the data to the blockchain
            const block = await this.chain.addBlock(new Block({address,star}));
            // If added successfully
            if(block){
                res.json(block);
            }
            else{
                res.status(503);
                res.json(ADD_FAILED);
            }

            
        })

        this.app.get("/stars/:hash", async (req, res) => {
            const hash = req.params.hash;
            
        })

        this.app.get("/stars/:address", async (req, res) => {
            const address = req.params.address;
            
        })

        this.app.get("/block/:height", async (req, res) => {
            const height = req.params.height;
            
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