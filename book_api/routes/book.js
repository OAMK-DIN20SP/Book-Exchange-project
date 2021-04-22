var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');

// ADD IMAGE
var multer = require('multer');
// var upload = multer({ dest: './public/images/books/' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/books/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
var upload = multer({ storage: storage })

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

// (ADD IMAGE)
router.post('/add', upload.single('image'), (req, res) => {
    // console.log(req.file.path);
    // console.log(req.file);
    req.body.image = req.file.filename;
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

module.exports = router;
