'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function(router, db) {
  router.get('/api/new/select', function(req, res) {
    const query =
      'select * from titles where complete=false and yomikiri=false';

    db.jsonQuery(query, res);
  });
};
