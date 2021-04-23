const db = require('../database.js');

const member = {
    get: (emailaddress, password, callback) => {
        console.log(emailaddress, password);
        db.query('select idmember, firstname, lastname, emailaddress, address, phonenumber, creditScore, image from `member` where emailaddress=? and password=?', 
            [emailaddress, password],
            callback);
    },

    getByIdmember: (idmember, callback) => {
        db.query('select idmember, firstname, lastname, emailaddress, address, phonenumber, creditScore, image from `member` where idmember=?', 
            [idmember],
            callback);
    },

    add: (member, callback) => {
        db.query(
            'insert into `member`(firstname, lastname, emailaddress, password, address, phonenumber) values(?, ?, ?, ?, ?, ?)', 
            [member.firstname, member.lastname, member.emailaddress, member.password, member.address, member.phonenumber],
            callback);
    },

    update: (member, callback) => {
        db.query(
            'update `member` set firstname=?, lastname=?, emailaddress=?, address=?, phonenumber=?)', 
            [member.firstname, member.lastname, member.emailaddress, member.address, member.phonenumber],
            callback);
    },

    update1: function(idmember, member, callback) {
        return db.query(
            'update `member` set image=? where idmember=?',
            [member.image, idmember],
            callback
        );
    },

    update2: function(idmember, member, callback) {
        return db.query(
            'update `member` set firstname=?, lastname=?, emailaddress=?, address=?, phonenumber=? where idmember=?',
            [member.firstname, member.lastname, member.emailaddress, member.address, member.phonenumber, idmember],
            callback
        );
    },
}

module.exports = member;