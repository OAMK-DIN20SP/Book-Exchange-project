const db = require('../database');

const message = {
  getByIdmember: function(idmember, callback) {
    return db.query(
      "select message.*, concat(member1.firstname, ' ', member1.lastname) as sender_name, concat(member2.firstname, ' ', member2.lastname) as receiver_name from message inner join `member` as member1 on member1.idmember=message.idmember inner join `member` as member2 on member2.idmember=message.idreceiver where message.idmember=? or message.idreceiver=? order by time asc",
      [idmember, idmember],
      callback
    );
  },

  getByIdmemberAndTime: function(idmember, time, callback) {
    const timeString = `STR_TO_DATE('${time}', '%Y-%m-%dT%T')`;
    return db.query(
      "select message.*, concat(member1.firstname, ' ', member1.lastname) as sender_name, concat(member2.firstname, ' ', member2.lastname) as receiver_name from message inner join `member` as member1 on member1.idmember=message.idmember inner join `member` as member2 on member2.idmember=message.idreceiver where message.idmember=? or message.idreceiver=? and `time` > ? order by `time` asc",
      [idmember, idmember, time],
      callback
    );
  },

  add: function(message, callback) {
    return db.query(
      'insert into message (idmember, idreceiver, message, time) values(?,?,?, now())',
      [parseInt(message.idmember), parseInt(message.idreceiver), message.message],
      callback
    );
  }
};

module.exports = message;