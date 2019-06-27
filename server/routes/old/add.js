'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function(router, db) {
  const titleNormMap = {
    まんがコント55号: '漫画コント55号'
  };

  var getIssue = async function(issue) {
    const query = "SELECT id FROM issues WHERE rel = '" + issue.rel + "'";

    var result = await db.promisifyQuery(query);

    if (result.length > 0) {
      issue.id = result[0].id;
      return;
    }

    var insert = 'INSERT INTO issues (rel, num';

    const [rel, num, cnum] = [issue.rel, issue.num, issue.cnum];

    if (cnum) {
      insert += ", cnum) VALUES ('" + rel + "', " + num + ', ' + cnum + ')';
    } else {
      insert += ") VALUES ('" + rel + "', " + num + ')';
    }

    result = await db.promisifyQuery(insert);
    issue.id = result.insertId;
  };

  var getTitle = async function(title) {
    var name = title.title;

    if (titleNormMap[name]) name = titleNormMap[name];

    const query = "SELECT id FROM titles WHERE name = '" + name + "';";

    var result = await db.promisifyQuery(query);

    if (result.length > 0) {
      title.id = result[0].id;
      return;
    }

    const insert =
      "INSERT INTO titles (name, author) VALUES ('" +
      name +
      "', '" +
      title.author +
      "')";

    result = await db.promisifyQuery(insert);
    title.id = result.insertId;
  };

  var insertEpisodes = async function(issue, json) {
    var values = [];
    const issueId = issue.id;

    json.list.forEach((row, index) => {
      var value =
        '(' + issueId + ',' + row.id + ',' + index + ',' + (index + 1);
      value += row.note ? ',"' + row.note + '"' : ', null';
      value += row.type ? ',"' + row.type + '"' : ', null';
      value += ')';
      values.push(value);
    });

    var insert =
      'INSERT INTO episodes (issueId, titleId, rawOrder, trueOrder, note, type) VALUES ' +
      values.join(',');

    await db.promisifyQuery(insert);
  };

  router.get('/api/old/insert/:_id', function(req, res) {
    const file = path.join(__dirname, '../../../db/data/', req.params._id);
    fs.readFile(file, async function(err, data) {
      const json = JSON.parse(data);

      if (json.list === undefined || json.list.length === 0) {
        res.sendStatus(200);
        return;
      }

      var issue = {
        rel: json.date.replace(/\//g, '-'),
        num: json.number,
        cnum: json.cnum
      };
      await getIssue(issue);
      for (var i = 0; i < json.list.length; i++) {
        await getTitle(json.list[i]);
      }
      await insertEpisodes(issue, json);
      res.sendStatus(200);
    });
  });
};
