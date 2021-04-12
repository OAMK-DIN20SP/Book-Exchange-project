const db = require('../database.js');

const book = {
    getByIdbook: (idbook, callback) => {
        if ( idbook ) { 
            db.query(
                'select * from book inner join `member` on book.idmember=`member`.idmember where idbook=?',
                [idbook],
                callback
            );
        } else {
            console.error('ERROR: idmember not found!!!');
            return;
        }
    },

    getByIdbookLookupMemberTable: (idbook, callback) => {
        if ( idbook ) { 
            db.query(
                'select book.*, firstname, lastname, emailaddress, address, phonenumber, creditScore from book inner join `member` on book.idmember=`member`.idmember where idbook=?',
                [idbook],
                callback
            );
        } else {
            console.error('ERROR: idmember not found!!!');
            return;
        }
    },

    getByIdmember: (idmember, callback) => {
        if ( idmember ) { 
            db.query(
                'select * from book where idmember=?',
                [idmember],
                callback
            );
        } else {
            console.error('ERROR: idmember not found!!!');
            return;
        }
    },

    add: (book, callback) => {
        console.log(book);
        if ( book && Object.keys(book).length > 0 ) {  
            db.query(
                'insert into book(title, idmember, author, `year`, edition, `description`, `condition`, image) values(?, ?, ?, ?, ?, ?, ?, ?)',
                [book.title, book.idmember, book.author, book.year, book.edition, book.description, book.condition, book.image],
                callback
            );
        } else {
            console.error('ERROR: empty POST body!!!');
            return;
        }
    }
}

module.exports = book;