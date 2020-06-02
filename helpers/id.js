// generate unique IDs by taking a string of timestamp and users, using base64 encoding
function id(users) {
    const time = new Number(Date.now());
    const uniqueString = time.toString()+users.toString();
    return Buffer.from(uniqueString).toString("base64");
}

module.exports = id;