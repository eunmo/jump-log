'use strict';

module.exports = function(router, db) {
  async function getIssues(titles) {
    var issueIds = [];

    titles.forEach(row => {
      issueIds[row.max] = row.max;
      issueIds[row.min] = row.min;
    });

    issueIds = issueIds.filter(i => i);

    const query =
      'SELECT id, rel FROM issues WHERE id in (' + issueIds.join(',') + ')';

    var issues = await db.promisifyQuery(query);

    return issues;
  }

  router.get('/api/title/select/all', async function(req, res) {
    const query1 =
      'SELECT id, count(*) count, max(issueId) max, min(issueId) min, name, author, complete, yomikiri' +
      ' FROM titles t, episodes e' +
      ' WHERE t.id = e.titleId' +
      ' GROUP BY id';

    var result1 = await db.promisifyQuery(query1);

    const issues = await getIssues(result1);

    res.json({ titles: result1, issues: issues });
  });

  router.get('/api/title/select/current', async function(req, res) {
    const query1 =
      'SELECT id, count(*) count, max(issueId) max, min(issueId) min, name, author, complete, yomikiri' +
      ' FROM titles t, episodes e' +
      ' WHERE t.id = e.titleId' +
      '   AND t.complete = false' +
      '   AND t.yomikiri = false' +
      ' GROUP BY id';

    var result1 = await db.promisifyQuery(query1);

    const issues = await getIssues(result1);

    res.json({ titles: result1, issues: issues });
  });

  router.get('/api/title/select/:_year', async function(req, res) {
    const year = req.params._year;

    const query1 =
      'SELECT * FROM (' +
      'SELECT id, count(*) count, max(issueId) max, min(issueId) min, name, author, complete, yomikiri' +
      ' FROM titles t, episodes e' +
      ' WHERE t.id = e.titleId' +
      '   AND t.yomikiri = false' +
      ' GROUP BY id) a' +
      ' WHERE a.min in (SELECT id FROM issues WHERE YEAR(rel) = ' +
      year +
      ')';

    var result1 = await db.promisifyQuery(query1);

    const issues = await getIssues(result1);

    res.json({ titles: result1, issues: issues });
  });
};
