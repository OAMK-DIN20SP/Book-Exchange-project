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