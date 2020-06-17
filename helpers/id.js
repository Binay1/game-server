// generate unique IDs by taking a string of timestamp and users, using base64 encoding
const _ = require('underscore');
function id(users) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id=""
    for(let i=0;i<8;i++) {
        id+=characters[_.random(0,characters.length-1)];
    }
    return id;
}

module.exports = id;