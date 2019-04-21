const bitcoinMessage = require('bitcoinjs-message'); 

class Mempool{
    constructor(){
        // {requestAddress: the timestamp requested}
        this.mempool = {};
        // {requestAddress: the remove function that calls when timeout}
        this.timeoutRequests = {};

        // The dictionary to store all validated addresses
        this.mempoolValid = {};

        // Constants used by this class
        this.timeoutRequestWindowTime = 5*60*1000; // for test, use 5 minutes in ms
        this.validationWindow = this.timeoutRequestWindowTime / 1000; // Convert to seconds
        this.messageFormat = (address, timestamp) => `${address}:${timestamp}:starRegistry`;
    }

    /** Add a request validation to the mempool
     * 
     * @param {string} address The address to be validated
     * @returns {Object} This function itself returns the result of `requestObject` function below
     */
    addRequestValidation(address){
        // Check if this address is already in the mempool or the valid mempool
        if(this.mempool[address]){
            // If it is in the mempool, return the object, recalculate the window time
            const timestamp = this.mempool[address];
            const timeElapsed = Math.round((new Date().valueOf() - timestamp) / 1000);
            return this.requestObject(address, this.mempool[address], this.validationWindow - timeElapsed);
        }
        if(this.mempoolValid[address]){
            // If it is in the valid mempool, return the object
            return this.mempoolValid[address];
        }

        // If the address is not in the mempool, add it
        const timestamp = new Date().valueOf();
        this.mempool[address] = timestamp;
        this.timeoutRequests[address] = setTimeout(() => {
            this.removeValidationRequest(address);

        }, this.timeoutRequestWindowTime);
        
        return this.requestObject(address, timestamp, this.validationWindow);
    }

    /** Generate a request object that will be send to the user
     * 
     *  This function is meant to be private, it should only be called internally
     * @param {string} address The address to be validated
     * @param {Number} timestamp The timestamp that the address is requested
     * @param {Number} validationWindow The validation window
     * @returns {Object} The request object
     */
    requestObject(address, timestamp, validationWindow){
        return {
            "walletAddress": address,
            "requestTimeStamp": timestamp,
            "message": this.messageFormat(address, timestamp),
            "validationWindow": validationWindow
        };
    }
    
    /** Remove an address from mempool
     * 
     * @param {string} address 
     */
    removeValidationRequest(address){
        delete this.mempool[address];
        delete this.timeoutRequests[address];
    }

    /** Validate a request by address and signature using Bitcoin
     * 
     * @param {string} address The address to be validated
     * @param {string} signature The signature
     * @returns The valid request object, if not valid, return false
     */
    validateRequestByWallet(address, signature){
        // Check if the address is still in the validation window
        if(!this.mempool[address]){

            // If this address is not validated before, return false
            if(!this.mempoolValid[address]){
                return false;
            }

            // If it is validated before, return the object there
            return this.mempoolValid[address];
        }

        // Validate that address by Bitcoin using the signature
        // Comment out this block of code for mocking test 

        // Begin
        let valid = false;
        const message = this.messageFormat(address, this.mempool[address]);
        try{
            valid = bitcoinMessage.verify(message, address, signature);
        }
        catch{
            
        }

        // If the message is not validated, return false
        if(!valid){
            return false;
        }
        // End

        // If the message is valid, generate the valid request
        const timestamp = this.mempool[address];
        const timeElapsed = Math.round((new Date().valueOf() - timestamp) / 1000);
        const validRequest = {
            "registerStar": true,
            "status": {
                "address": address,
                "requestTimeStamp": timestamp,
                "message": this.messageFormat(address, timestamp),
                "validationWindow": this.validationWindow - timeElapsed,
                "messageSignature": true
            }
        }
        // move the address into valid mempool, 
        // remove that address from original mempool and timeout request
        this.mempoolValid[address] = validRequest;
        this.removeValidationRequest(address);
        return validRequest;
    }

    /** Verify if the request validation exists and if it is valid.
     * 
     * @param {string} address The address to be validated
     * @returns {boolean} True if it exists and validated, otherwise false
     */
    verifyAddressRequest(address){
        return this.mempoolValid[address] ? true : false;

    }


}

module.exports = Mempool;