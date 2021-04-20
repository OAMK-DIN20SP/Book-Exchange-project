var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');
var member = require('../models/member_model.js');
var async = require('async');
var multer = require('multer');
const helpers = require('../helpers');
const path = require('path');

router.get('/', (req, res) => {
    const { idmember } = req.query;
    async.parallel({
        books: callback => book.getByIdmember(idmember, callback),
        member: callback => member.getByIdmember(idmember, callback)
    }, (err, responses) => {
        if (err) {
            console.log(err);
            responses.json( {success: false} );
        } else {
            // console.log(responses.books); // not only data
            res.render( 'member', {
                'success': true, 
                totalBooks: responses.books[0].length, 
                books: responses.books[0], //responses.books: not only data
                totalMembers: responses.member[0].length, 
                members: responses.member[0] }
            );
        }
    });
});

router.post('/add', (req, res) => {
    console.log(req.body);
    member.add( req.body, (err, dbResult) => {
        if (err) {
            console.log(err);
            if (err.errno == 1062) {
                res.json( {success: false, message: 'This email address is not available. Please choose a different one.'} )
            } else {
                res.json( {success: false, message: 'Error occures. Please contact the website administrator.'} )
            }
        } else {
            res.json( {success: true, message: 'You have successfully registered. You can log in now.'} );
        }
    } )
});

router.put('/edit', (req, res) => {
    console.log(req.body);
    member.update( req.body, (err, dbResult) => {
        if (err) {
            console.log(err);
            res.json( {success: false, message: 'Error occures. Please contact the website administrator.'} );
        } else {
            res.json( {success: true, message: 'Your information is updated.'} );
        }
    } )
});

router.post('/login', (req, res) => {
    console.log(req.body.emailaddress, req.body.password);
    member.get(req.body.emailaddress, req.body.password, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                console.log(dbResult);
                res.redirect('/member?idmember=' + dbResult[0].idmember);
                // res.json(dbResult);
            } else {
                res.json( {success: false, message: 'Invalid email and/or password'});
            }
        }
    });
    
});

router.post('/login2', (req, res) => { // res w/ json, no redirect
    console.log(req.body.emailaddress, req.body.password);
    member.get(req.body.emailaddress, req.body.password, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                console.log(dbResult);
                res.json(dbResult);
                // res.json(dbResult);
            } else {
                res.json( {success: false, message: 'Invalid email and/or password'});
            }
        }
    });
    
});

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/images/avatars')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// });
 
// var upload = multer({ storage: storage });

// router.post('/uploadavatar', upload.single('myFile'), (req, res, next) => {
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   res.send(file)
// });

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/images/avatars/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

router.post('/uploadavatar', (req, res) => {
    // 'myFile' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('myFile');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});

module.exports = router;
