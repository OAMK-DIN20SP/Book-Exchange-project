var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');

router.get('/', (req, res) => {
    const { idbook, accept } = req.query;
    book.getByIdbook( idbook, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                // res.json(dbResult[0]);
                console.log(dbResult[0]);
                if (!accept) {
                    res.render('book_detail', { book: dbResult[0]});
                } else if (accept == 'json') {
                    res.json({ success: true, totalBooks: dbResult.length, books: dbResult });
                }
                
            } else {
                res.json( {success: false, message: 'There is no book with that id.'} );
            }
        }
    });
});

router.get('/b_mb', (req, res) => { // book look up member
    const { idbook, accept } = req.query;
    book.getByIdbookLookupMemberTable( idbook, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                if (!accept) {
                    res.render('book_detail', { book: dbResult[0]});
                } else if (accept == 'json') {
                    res.json({ success: true, totalBook_members: dbResult.length, book_members: dbResult });
                }
                
            } else {
                res.json( {success: false, message: 'There is no book with that id.'} );
            }
        }
    });
});

router.get('/upload', (req, res) => {
    const { idmember } = req.query;
    console.log(idmember);
    console.log(!idmember);
    console.log(parseInt(idmember));
    if (!idmember || isNaN(idmember) || parseInt(idmember) <= 0) {
        res.redirect('/login');
        return
    }
    book.getByIdmember( idmember, (err, dbResult) => {
        err ? res.json(err) : res.render('book_upload');
    } )
});

router.post('/upload', (req, res) => {
    console.log('req.body.idmember', req.body.idmember);
    book.getByIdmember( req.body.idmember, (err, dbResult) => {
        err ? res.json(err) : res.render('book_upload');
    } )
});

router.post('/add', (req, res) => {
    book.add( req.body, (err, dbResult) => {
        if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                // res.json( { success: true, message: 'Book sucessfully uploaded.' } );
                res.redirect( '/book?idbook=' + dbResult.insertId );
            }    });
    } );

router.get('/search', (req, res) => {
    const { title } = req.query;

    if (title) {
        book.searchByTitle( title, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
            }    });
        return
    }

    const { author } = req.query;
    if (author) {
        book.searchByAuthor( author, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
            }    });
        return
    }

    const { idbook } = req.query;
    console.log(idbook);
    if (idbook) {
        book.getByIdbook( idbook, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                console.log(dbResult);
                res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
            }    });
        return
    }
});

router.get('/latest', (req, res) => {
    book.getLatest( (err, dbResult) => {
        if (err) {
            console.log(err);
            res.json( { success: false });
        } else {
            res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
        }    
    });
});

router.delete('/delete', (req, res) => {
    const { idmember, idbook } = req.query;
    console.log(idmember, idbook);
    book.delete( idmember, idbook, (err, dbResult) => {
        if (err) {
            console.log(err);
            res.json( { success: false });
        } else {
            res.json( { success: true, deletedRows: dbResult.affectedRows } );
        }    
    });
});

router.post('/delete', (req, res) => {  // post method: Hieu's suggestion
    const { idmember, idbook } = req.body;
    console.log(idmember, idbook);
    book.delete( idmember, idbook, (err, dbResult) => {
        if (err) {
            console.log(err);
            res.json( { success: false });
        } else {
            res.json( { success: true, deletedRows: dbResult.affectedRows } );
        }    
    });
});

module.exports = router;
