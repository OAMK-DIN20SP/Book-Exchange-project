const db = require('../database.js');

const bcrypt = require('bcryptjs');
const saltRounds=10;

const member = {
    get: (emailaddress, password, callback) => {
        db.query('select idmember, firstname, lastname, emailaddress, address, phonenumber, image from `member` where emailaddress=? and password=?', 
            [emailaddress, password],
            callback);
    },

    getLogin: (emailaddress, password, callback) => {
        db.query('SELECT idmember, firstname, lastname, emailaddress, password FROM `member` WHERE emailaddress = ?', 
            [emailaddress],
            callback);
    },

    getAll: (callback) => {
        db.query('select idmember, firstname, lastname, emailaddress, address, phonenumber, image from `member`', 
            callback);
    },

    getByIdmember: (idmember, callback) => {
        db.query('select idmember, firstname, lastname, emailaddress, address, phonenumber, image from `member` where idmember=?', 
            [idmember],
            callback);
    },

    // add: (member, callback) => {
    //     db.query(
    //         'insert into `member`(firstname, lastname, emailaddress, password, address, phonenumber) values(?, ?, ?, ?, ?, ?)', 
    //         [member.firstname, member.lastname, member.emailaddress, member.password, member.address, member.phonenumber],
    //         callback);
    // },

    add: function(member, callback) {
        bcrypt.hash(member.password, saltRounds, function(err, hash) {
            return db.query(
                'insert into `member`(firstname, lastname, emailaddress, password, address, phonenumber) values(?, ?, ?, ?, ?, ?)', 
                [member.firstname, member.lastname, member.emailaddress, hash, member.address, member.phonenumber],
                callback);
        });
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

    // ------------------------------
    updatePass: function(idmember, member, callback) {
        bcrypt.hash(member.password, saltRounds, function(err, hash) {
            return db.query(
                'update `member` set emailaddress=?, password=? where idmember=?',
                [user.emailaddress, hash, idmember],
                callback);
        });
    }
}

module.exports = member;