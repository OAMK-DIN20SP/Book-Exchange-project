const express = require('express');
const router = express.Router();
const message = require('../models/message_model');
const member = require('../models/member_model');


router.get('/', (req, res) => {
  const { idmember, idbook, accept } = req.query;
  if ( idmember && parseInt(idmember) > 0 && idbook && parseInt(idbook) > 0 ) { // req has both
    return message.getByIdmemberAndIdbook(idmember, idbook, (err, dbResult) => {
      if (err) {
        res.json(err);
      } else {
        console.log('dbResult sample', dbResult[0]);
        if (!accept) {
          res.render('message', { data: dbResult });
        } else if (accept == 'json') {
          res.json({ success: true, totalMessages: dbResult.length, messages: dbResult });
        }
      }
    });
  }

  if ( idmember && parseInt(idmember) ) { // req has only idmember
    return message.getByIdmember(idmember, (err, dbResult) => {
      if (err) {
        res.json(err);
      } else {
        console.log('dbResult sample', dbResult[0]);
        if (!accept) {
          res.render('message', { data: dbResult });
        } else if (accept == 'json') {
          res.json({ success: true, totalMessages: dbResult.length, messages: dbResult });
        }
      }
    });
  }

  res.send('Invalid request');
});

router.post('/b2p', (req, res) => {
  // book and 2 people and last message time
  const { id1, id2, idbook, time } = req.body;
  console.log('time:', time);
  if ( id1 && parseInt(id1) > 0 && id2 && parseInt(id2) > 0 && idbook && parseInt(idbook) > 0 ) {
    return message.getByBookAndTwoPeople(id1, id2, idbook, time, (err, dbResult) => {
      if (err) {
        res.json(err);
      } else {
        console.error('b2p dbResult sample', dbResult[0]);
        res.json( { success: true, totalMessages: dbResult.length, messages: dbResult } );
      }
    });
  }
});

router.delete('/b2p', (req, res) => {
  // delete all messages for the specified: book, person 1, person 2
  const { id1, id2, idbook } = req.query;
  if ( id1 && parseInt(id1) > 0 && id2 && parseInt(id2) > 0 && idbook && parseInt(idbook) > 0 ) {
    return message.deleteByBookAndTwoPeople(id1, id2, idbook, (err, dbResult) => {
      if (err) {
        res.json(err);
      } else {
        console.log(dbResult);
        res.json( { success: true, message:'Conversation deleted.' } );
      }
    });
  }
});

router.get('/withsocket', (req, res) => {
  return member.getAll( (err, dbResult) => {
    if (err) {
      res.json(err);
    } else {
      res.render('message_withsocket', { data: dbResult });
    }
  });
});

router.get('/latest', (req, res) => {  // when did I write this T_T ???
  console.log('req.query:', req.query);
  const idmember = req.query.idmember;
  const time = new Date(req.query.time).toISOString();
  console.log(time);
  return message.getByIdmemberAndTime(idmember, time, (err, dbResult) => {
    if (err) {
      res.json(err);
    } else {
      res.json(dbResult);
      console.log('messageRouter.get, dbResult:', dbResult, dbResult.sqlMessage);
    }
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  message.add(req.body, (err, dbResult) => {
    if (err) {
      console.log(err);
      res.send( {success: false} );
      console.log('error rui');
      console.log(err);
    } else {
      console.log('message insert success, affect rows = ', dbResult.affectedRows);
      res.send( {success: true} );
    }
  });
});




module.exports = router;