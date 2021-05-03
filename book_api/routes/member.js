var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');
var member = require('../models/member_model.js');
var async = require('async');
var multer = require('multer');
const helpers = require('../helpers');
const path = require('path');
const bcrypt = require('bcryptjs');

// ADD IMAGE
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/avatars/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
    const { idmember, accept } = req.query;
    async.parallel({
        books: callback => book.getByIdmember(idmember, callback),
        member: callback => member.getByIdmember(idmember, callback)
    }, (err, responses) => {
        if (err) {
            console.log(err);
            responses.json( {success: false} );
        } else {
            if (!accept) {
                res.render( 'member', {
                    'success': true, 
                    totalBooks: responses.books[0].length, 
                    books: responses.books[0],
                    totalMembers: responses.member[0].length, 
                    members: responses.member[0] }
                );
            } else if (accept == 'json'){
                res.json( {
                    'success': true, 
                    totalBooks: responses.books[0].length, 
                    books: responses.books[0],
                    totalMembers: responses.member[0].length, 
                    members: responses.member[0] }
                );
            }
        }
    });
});

router.get('/search', (req, res) => {
    const { idmember } = req.query;
    member.getByIdmember( idmember, (err, dbResult) => {
        if (err) {
            console.log(err);
            err.json( {success: false} );
        } else {
            res.json( {
                'success': true, 
                totalMembers: dbResult.length, 
                members: dbResult }
            );
        }
    });
});

router.post('/add', (req, res) => {
    member.add( req.body, (err, dbResult) => {
        if (err) {
            console.log(err);
            if (err.errno == 1062) {
                res.json( {success: false, message: 'This email address is not available. Please choose another one.'} )
            } else {
                res.json( {success: false, message: 'Error occures. Please contact the website administrator.'} )
            }
        } else {
            res.json( {success: true, message: 'You have successfully registered. You can log in now.'} );
        }
    } )
});

router.post('/login', (req, res) => {
    const { emailaddress, password, accept } = req.body;

    if (!emailaddress.trim() || !password.trim() ) {
        console.log("username or password missing");
        res.json( {success: false, message: 'Invalid email and/or password'});
        return
    }

    member.getByEmailaddress(emailaddress, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {console.log('x');
                bcrypt.compare( password, dbResult[0].password, (err, compareResult) => {
                    if (compareResult) {
                        if (!accept) {
                            res.redirect('/member?idmember=' + dbResult[0].idmember);
                        } else if (accept == 'json'){
                            for (let m of dbResult){
                                delete m['password'];
                            }
                            res.json(dbResult);console.log(dbResult);
                        }
                    } else {
                        console.log('Wrong password');
                        res.json( {success: false, message: 'Invalid email and/or password'});
                    }
                });
                
            } else {
                console.log("user does not exists");
                res.json( {success: false, message: 'Invalid email and/or password'});
            }
        }
    });
    
});

// NEW
router.put('/', upload.single('image'), (req, res) => {
    if (req.file) {
        req.body.image = req.file.filename;
        member.update1( req.query.idmember, req.body, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json(dbResult);
            }
        });
    }
    else {
        member.update2( req.query.idmember, req.body, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json(dbResult);
            }
        });
    }
});

module.exports = router;
