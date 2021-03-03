

const crypto = require("crypto");

module.exports = {
    
    sha512(password, salt){
        const hash = crypto.createHmac('sha512', salt);
        //const value = hash.digest('hex');
        return hash.update(password).digest('hex');
    }
};

