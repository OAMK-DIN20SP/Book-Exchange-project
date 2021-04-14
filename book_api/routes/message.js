const express = require('express');
const router = express.Router();
const message = require('../models/message_model');

router.get('/', (req, res) => {
  console.log('req.query.idmember:', req.query.idmember);
  return message.getByIdmember(req.query.idmember, (err, dbResult) => {
    if (err) {
      res.json(err);
    } else {
      res.render('message', { data: dbResult });
      console.log('messageRouter.get, dbResult:', dbResult);
    }
  });
});

router.get('/latest', (req, res) => {
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