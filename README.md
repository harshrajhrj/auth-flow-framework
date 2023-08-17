# auth-flow-framework
In Auth flow framework, we've grasped all of the frameworks and tools that are required for user authorization and authentication process.
<br>
[**Tutorial**](https://youtu.be/mbsmsi7l3r4)
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
## Partition of Auth server and API server
* Now, we've separated our jwt framework in two servers-
    + Auth server - It keeps all the API related to login and token exchange, so that our auth server environment is separate from the production environment. This helps auth server isolation from any vulnerabilites or malicious visits to the code.
    + API server - It keeps all the API related to use resource exchange. Additionally, a user has to visit through jwt authentication for every authenticated API call. This keeps all the API secured and protected from token steal(accidently if someone leaked it's token).
### Auth server
* In this setup, we've introduced two types of schemes-
    1. `ACCESS_TOKEN`<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/82c86e9cf153860959f8c5fcba942aec0cfdff79/authServer.js#L41-L43)</sup> - This will be used for authentication and resource exchange. Additionally, token expiration time is also used for preventing multiple API calls during the lifetime as well as considering "token exposure" reasons too. This token will be kept with client to enable API call features.
    2. `REFRESH_TOKEN`<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/82c86e9cf153860959f8c5fcba942aec0cfdff79/authServer.js#L16-L20)</sup> - This will be used to regenrate access token when the access token is expired. Refresh token can only be used for access token regeneration. Refresh token will be stored with user credentials in some database. Also, due to avoidance of storing of the refresh_token during the lifetime, the token is invalidated using `logout`<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/82c86e9cf153860959f8c5fcba942aec0cfdff79/authServer.js#L24)</sup> API call so that a user cannot obtain access to `ACCESS_TOKEN` everytime using `REFRESH_TOKEN` as server can't be able to genuinely identify if the user is actual or fraud(consdering `REFRESH_TOKEN` was stolen).
### API server
* In this setup, we use one authentication middleware and resources exchange API
    1. `Authentication`<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/82c86e9cf153860959f8c5fcba942aec0cfdff79/server.js#L25-L35)</sup> - This middleware always checks for a valid jwt token associated with the right user. If the check becomes false, then `Unauthorized` or `Forbidden` response is sent else the `next()` is called to allow resource exchange.
    2. `Resource exchange API`<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/82c86e9cf153860959f8c5fcba942aec0cfdff79/server.js#L21)</sup> - After successful jwt validation, this API allows to exchange resources.
## Whitelisting allowed methods
* In this process, we'll whitelist the methods that are to be allowed while making requests after authentication. Following properties can be used to whitelist a method:
    1. `allowedMethods` - The property is of type `Array`. In this property we can add the methods which can be allowed to request.
* Signing `allowedMethods` together with `user` capped within an object.<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/516d374291f0943b757bf0864f5ca2dc91d7ddf8/authServer.js#L41-L43)</sup>
* Verifying `allowedMethods` property for a specific method request using a middleware.<sup>[Code](https://github.com/harshrajhrj/auth-flow-framework/blob/516d374291f0943b757bf0864f5ca2dc91d7ddf8/server.js#L32)</sup>