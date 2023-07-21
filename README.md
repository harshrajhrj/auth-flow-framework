# auth-flow-framework
In Auth flow framework, we've grasped all of the frameworks and tools that are required for user authorization and authentication process.

## Token creation
* Enter into node terminal using following command:
```javascript
C:\Users\PATH>node
```
* Generate two tokens
    1. First token for `ACCESS_TOKEN`
        ```javascript
        require('crypto').randomBytes(64).toString('hex');
        ```
    This will generate 64 characters long string token
    2. Second token for `REFRESH_TOKEN`
    Repeat the same as done in Step 1.