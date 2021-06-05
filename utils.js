function isUndefined(obj) {
    return (typeof obj == 'undefined')
}

function isEmpty(obj) {
    return (isUndefined(obj) || obj == null || obj.length == 0);
}

function getBase64Auth(authorization) {
    return (authorization || '').split(' ')[1] || '';
}

function getBasicAuthData(authorization) {

    const b64auth = getBase64Auth(authorization);
    const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');

    return {username: user, password: pass};

}

function getOwnerKey(authorization) {

    const b64auth = getBase64Auth(authorization);
    const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');

    var ownerKey = Buffer.from(user).toString('base64');

    return ownerKey;

}

function isIterable(obj) {
    if (obj == null || isUndefined(obj)) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

class Success {
    constructor(message) {
        this.success = true;
        this.message = message;
    }
}

class Error {
    constructor(message) {
        this.success = false;
        this.message = message;
    }
}

module.exports = {
    isUndefined,
    isEmpty,
    getBase64Auth,
    getBasicAuthData,
    getOwnerKey,
    isIterable,
    Success,
    Error
};
