var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');

router.get('/', (req, res) => {
    console.log('req.query.idbook:', req.query.idbook);
    book.getByIdbook( req.query.idbook, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                // res.json(dbResult[0]);
                console.log(dbResult[0]);
                res.render('book_detail', { book: dbResult[0]});
            } else {
                res.json( {success: false, message: 'There is no book with that id.'} );
            }
        }
    });
});

router.post('/upload', (req, res) => {
    console.log('req.body.idmember', req.body.idmember);
    book.getByIdmember( req.body.idmember, (err, dbResult) => {
        err ? res.json(err) : res.render('book_upload');
    } )
    
});

router.post('/add', (req, res) => {
    book.add( req.body, (err, dbResult) => {
        err ? res.json(err) : res.json( {success: true, message: 'Sucessfully uploaded.'} );
    } )
})

router.get('/search', (req, res) => {
    const title = req.query.title;

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

    const author = req.query.author;
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
    const { idmember, idbook } = req.query || req.body;
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
