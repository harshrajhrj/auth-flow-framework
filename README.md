# auth-flow-framework
In Auth flow framework, we've grasped all of the frameworks and tools that are required for user authorization and authentication process.

## Token creation for resource exchange
* Enter into node terminal using the command `C:\Users\PATH>node`.
* Generate following two tokens and store them in `.env` variable.
    1. First token for `ACCESS_TOKEN`
        ```javascript
        require('crypto').randomBytes(64).toString('hex');
        ```
        This will generate 64 characters long string token
    2. Second token for `REFRESH_TOKEN`.
    Repeat the same as done in Step 1.

## Basic authentication created using jwt
* JWT auth flow
    ```
    client ---login(using credentials)--->server--->jwt(generated)--->jwt(sent to client)--->POST /users(using authorization header)--->server verification
    ```
    1. if no headers provided, status `401` is returned
    2. if verification failed, status `403` is returned
* We've used [`authenticate`](https://github.com/harshrajhrj/auth-flow-framework/blob/63517d748be59f5e3b8cf9bb012805e79975e365/server.js#L33-L43) middleware to verify and respond to the client.