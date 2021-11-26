var config;
try {
    config = require('config.json');
} catch (error) {}
var privateKey = process.env.privateKey || config.privateKey,
    publicKey = process.env.publicKey || config.publicKey;

function isUndefined(obj) {
    return (typeof obj == 'undefined')
}

function isEmpty(obj) {
    return (isUndefined(obj) || obj == null || obj.length == 0);
}

function getAuthToken(authorization) {
    return (authorization || '').split(' ')[1] || '';
}

function getBasicAuthData(authorization) {
    const b64auth = getAuthToken(authorization);
    const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');
    return {username: user, password: pass};
}

function getBearerData(authorization) {
    const token = getAuthToken(authorization);
    return {hash: token};
}

function getOwnerKey(authorization) {
    const b64auth = getAuthToken(authorization);
    const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');
    var ownerKey = Buffer.from(user).toString('base64');
    return ownerKey;
}

function getOwnerName(ownerKey) {
    const username = Buffer.from(ownerKey, 'base64').toString();
    return username;
}

function isIterable(obj) {
    if (obj == null || isUndefined(obj)) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function createHash() {
    var crypto = require('crypto');
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return hash;
}

function getFormattedTime(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function getFormattedFullDate(timestamp) {
    var date = new Date(timestamp);
    return date.toLocaleString();
}

function getFormattedDate(timestamp) {
    var date = new Date(timestamp);
    return date.getDate();
}

function checkSizeInBytes(str) {
    var bodyLimitSize = 16777216;
    var size = Buffer.byteLength(str, 'utf8');
    if (size > bodyLimitSize) {
        return false;
    }
    return true;
}

function generateRSAKeys() {
    const NodeRSA = require('node-rsa');
    const key = new NodeRSA({b: 1024});
    console.log('private => ' + key.exportKey('private'));
    console.log('public => ' + key.exportKey('public'));
}

function encryptRSA(message) {
    const NodeRSA = require('node-rsa');
    // console.log('privateKey => ' + privateKey);
    var pvKey = new NodeRSA(privateKey, 'pkcs1');
    var encryptedMessage = pvKey.encrypt(message, 'base64');
    // console.log('encryptedMessage => ' + encryptedMessage);
    return encryptedMessage;
}

function decryptRSA(message) {
    const NodeRSA = require('node-rsa');
    // console.log('privateKey => ' + privateKey);
    var pbKey = new NodeRSA(privateKey, 'pkcs1');
    var decryptedMessage = pbKey.decrypt(message, 'utf8');
    // console.log('decryptedMessage => ' + decryptedMessage);
    return decryptedMessage;
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
    getBasicAuthData,
    getBearerData,
    getOwnerKey,
    getOwnerName,
    isIterable,
    getFormattedTime,
    getFormattedFullDate,
    getFormattedDate,
    checkSizeInBytes,
    createHash,
    generateRSAKeys,
    encryptRSA,
    decryptRSA,
    Success,
    Error
};
