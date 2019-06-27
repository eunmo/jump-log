'use strict';

module.exports = function(router, db) {
  router.post('/api/title/update', async function(req, res) {
    const input = req.body;

    if (input.id === undefined) {
      res.sendStatus(200);
      return;
    }

    const query =
      'UPDATE titles' +
      ' SET yomikiri=' +
      input.yomikiri +
      ', complete=' +
      input.complete +
      ' WHERE id=' +
      input.id;

    await db.promisifyQuery(query);
    res.sendStatus(200);
  });
};
