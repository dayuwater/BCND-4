# RESTful Star Notary API using Private Blockchain with Node.js Framework

A RESTful Web API using **Express.js** that operates a private Blockchain. It registers users with stars using Bitcoin wallet.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Node.js
- NPM (This should be installed already when you install Node.js)
- Bitcoin Wallet (eg. Electrum) (The code could run perfectly without it, but you must have that to test the code.)


### Installing

```
npm install
```


## Deployment

```
node index.js
```

The server will run on port 8000

## API Endpoints

All request body must be in JSON.
All response body is in JSON if your requested route is registered.


If your requested route does not match one of the following routes, you will get a 404 response with an HTML response.

1. **POST** /requestValidation
- Request Parameters:
    - No Request parameters

- Request body:
    - address: The wallet address to be validated

- Successful Response:

    This should be the info of the wallet address validation with the message for sign using their own Bitcoin wallet. It also informs users about when they must sign the message for further validation.

    Example:
    ```
    {
        "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1544451269",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
        "validationWindow": 300
    }
    ```

- Failed Responses:
    - If your request body does not have a `address` field or that field is empty.

    ```
    {
    "error": "Your request body must have a 'address' field, and there must not be empty."
    }
    ``` 
    with a 400 status code.

    - If the request was failed to respond, which is very unlikely, it will return with a 500 status code.

2. **POST** /message-signature/validate
- Request Parameters:
    - No Request parameters

- Request body:
    - address: The wallet address to be validated

    - signature: The signature of the message sent last step.

- Successful Response:

    This should inform user that their wallet address is validated.

    Example:
    ```
    {
        "registerStar": true,
        "status": {
            "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
            "requestTimeStamp": "1544454641",
            "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
            "validationWindow": 193,
            "messageSignature": true
        }
    }
    ```

- Failed Responses:
    - If your request body does not have a `address` or `signature` field or that field is empty.

    ```
    {
    "error": "Your request body must have a 'address'(or 'signature') field, and there must not be empty."
    }
    ``` 
    with a 400 status code.

    - If the request was rejected due to incorrect signature
    ```
    {"error": "The signature provided is not valid for the provided address."}
    ```
    with a 403 status code

3. **POST** /block
- Request Parameters:
    - No Request parameters

- Request body:
    - address: The wallet address, it must be validated 
    - star: The Information of the new star to be added
        - In addition, it must conform to this standard. You might add new fields inside `star`, and they will be stored, but you could not miss any of the required fields shown below.
        ```
        {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "star": {
                    "dec": "68° 52' 56.9",
                    "ra": "16h 29m 1.0s",
                    "story": "Found star using https://www.google.com/sky/"
                }
        }
        ```

- Successful Response:

    This should be the content of the newly added star in the blockchain.

    Example:
    ```
    {
    "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
    "height": 1,
    "body": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        }
    },
    "time": "1544455399",
    "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
}
    ```

- Failed Responses:
    - If your request body miss any of the required fields

    ```
    {
    "error": "Your request body must have a 'body' field, and there must not be empty."
    }
    ``` 
    with a 400 status code.

    - If the address was not validated before
    ```
    "error": "The address was not validated before. Please request validation first."
    ```
    with a 403 status code

    - If the block was failed to added to the blockchain, which is very unlikely
    ```
    {"error":"The block was not added successfully. Please try again later."}
    ```
    with a 503 status code.

4. **GET** "/stars/hash/:hash
- Request Parameters:
    - hash: The hash of the block requested

- Request Body:
    - No Request body.


- Successful Response:

    This should be the content of the requested block in the blockchain

    Example:
    ```
    {
        {
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
    }
    ```

- Failed Responses:
    - If you provide a block index that does not exist:

    ```
    {
    "error": "That block does not exist"
    }
    ``` 
    with a 404 status code.

    - If your requested block hash is invalid:
    ```
    {
    "error": "Your request body must have a 'hash' field, and there must not be empty."
    }
    ```
    with a 400 status code.


5. **GET** /stars/address/:address
- Request Parameters:
    - address: The address of the block requested

- Request Body:
    - No Request body.


- Successful Response:

    This should be the content of the requested block in the blockchain with that address. This might contain multiple blocks.

    Example:
    ```
    [
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
    ```

- Failed Responses:
    - If you provide a address that does not exist:

    ```
    {
    "error": "That block does not exist"
    }
    ``` 
    with a 404 status code.

    - If your requested block address is invalid:
    ```
    {
    "error": "Your request body must have a 'address' field, and there must not be empty."
    }
    ```
    with a 403 status code.



6. **GET** /block/:height
- Request Parameters:
    - height: The height(index) of the block requested

- Request Body:
    - No Request body.


- Successful Response:

    This should be the content of the requested block in the blockchain

    Example:
    ```
    {
        {
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
    }
    ```

- Failed Responses:
    - If you provide a block index that does not exist:

    ```
    {
    "error": "That block does not exist"
    }
    ``` 
    with a 404 status code.

    - If your requested block height is invalid:
    ```
    {
    "error": "The block height must be a positive integer"
    }
    ```
    with a 400 status code.













