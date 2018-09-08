'use strict';

module.exports = function(router, db) {

	router.get('/api/title/select/all', async function (req, res) {
		const query1 =
			"SELECT id, count(*) count, max(issueId) max, min(issueId) min, name, author, complete, yomikiri" +
			 " FROM titles t, episodes e"+
			" WHERE t.id = e.titleId" +
			" GROUP BY id";

		var result1 = await db.promisifyQuery(query1);

		var issueIds = [];

		result1.forEach(row => {
			issueIds[row.max] = row.max;
			issueIds[row.min] = row.min;
		});
		
		issueIds = issueIds.filter(i => i);

		const query2 =	"SELECT id, rel FROM issues WHERE id in (" + issueIds.join(',') + ")";
		
		var result2 = await db.promisifyQuery(query2);

		res.json({titles: result1, issues: result2});
	});
};
