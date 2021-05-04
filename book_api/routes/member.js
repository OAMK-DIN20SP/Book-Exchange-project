var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');
var member = require('../models/member_model.js');
var async = require('async');
// !!!
const helpers = require('../helpers');
const path = require('path');

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
                    books: responses.books[0], //responses.books: not only data
                    totalMembers: responses.member[0].length, 
                    members: responses.member[0] }
                );
            } else if (accept == 'json'){
                res.json( {
                    'success': true, 
                    totalBooks: responses.books[0].length, 
                    books: responses.books[0], //responses.books: not only data
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

router.post('/login2', 
  function(req, res) {
    if(req.body.emailaddress && req.body.password){
        var emailaddress = req.body.emailaddress;
        var password = req.body.password;
        member.getLogin(req.body.emailaddress, req.body.password, (err, dbResult) => {
            if(err){
                res.json(err);
            }
            else {
                if (dbResult.length > 0) {
                const bcrypt = require('bcryptjs');
                const saltRounds=10;
                bcrypt.compare(password,dbResult[0].password, 
                    function(err,compareResult) {
                    if(compareResult) {
                        console.log("succes");
                        // res.send(true);
                        res.json(dbResult);
                    }
                    else {
                        console.log("wrong password");
                        res.send(false);
                    }			
                    }
                );
                }
                else{
                console.log("user does not exists");
                res.send(false);
                }
            }
        }
        );
    }
    else{
        console.log("Give the emailaddress and password");
        response.send(false);
    }
  }
);

// router.post('/login', (req, res) => {
//     const { emailaddress, password } = req.body;
//     member.get(emailaddress, password, (err, dbResult) => {
//         if (err) {
//             res.json(err);
//         } else {
//             if (dbResult.length > 0) {
//                 res.redirect('/member?idmember=' + dbResult[0].idmember);
//                 // res.json(dbResult);
//             } else {
//                 res.json( {success: false, message: 'Invalid email and/or password'});
//             }
//         }
//     });
    
// });

// router.post('/login2', (req, res) => { // res w/ json, no redirect
//     const { emailaddress, password } = req.body;
//     member.get(emailaddress, password, (err, dbResult) => {
//         if (err) {
//             res.json(err);
//         } else {
//             if (dbResult.length > 0) {
//                 res.json(dbResult);
//                 // res.json(dbResult);
//             } else {
//                 res.json( {success: false, message: 'Invalid email and/or password'});
//             }
//         }
//     });
// });

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
