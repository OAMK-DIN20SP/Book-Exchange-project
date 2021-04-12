var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');
var member = require('../models/member_model.js');
var async = require('async');

router.get('/', (req, res) => {
    console.log(req.query.idmember);
    async.parallel({
        books: callback => book.getByIdmember(req.query.idmember, callback),
        member: callback => member.getByIdmember(req.query.idmember, callback)
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

module.exports = router;
