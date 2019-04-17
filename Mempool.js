class Mempool{
    constructor(){
        // {requestAddress: the timestamp requested}
        this.mempool = {};
        // {requestAddress: the remove function that calls when timeout}
        this.timeoutRequests = {};
        this.timeoutRequestWindowTime = 20*1000; // for test, use 20s in ms
        this.validationWindow = this.timeoutRequestWindowTime / 1000; // Convert to seconds
    }

    /** Add a request validation to the mempool
     * 
     * @param {string} address The address to be validated
     * @returns {Object} This function itself returns the result of `requestObject` function below
     */
    addRequestValidation(address){
        // Check if this address is already in the mempool
        if(this.mempool[address]){
            // If it is in the mempool, return the object
            return this.requestObject(address, this.mempool[address], this.validationWindow);
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
            "message": `${address}:${timestamp}:starRegistry`,
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
}

module.exports = Mempool;