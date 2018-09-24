'use strict';

module.exports = function(router, db) {
	
	var getIssue = async function(issue) {
		const query = "SELECT id FROM issues WHERE rel = \'" + issue.date + "\'";
		
		var result = await db.promisifyQuery(query);

		if (result.length > 0) {
			issue.id = result[0].id;
			return;
		}

		var insert = "INSERT INTO issues (rel, num";

		const [rel, num, cnum] = [issue.date, issue.num, issue.cnum];

		if (cnum !== '') {
			insert += ", cnum) VALUES (\'" + rel + "\', " + num + ", " + cnum + ")";
		} else {
			insert += ") VALUES (\'" + rel + "\', " + num + ")";
		}
		
		result = await db.promisifyQuery(insert);
		issue.id = result.insertId;
	}

	var getTitle = async function(title) {
		var name = title.name;

		const query = "SELECT id FROM titles WHERE name = \'" + name + "\';";
		
		var result = await db.promisifyQuery(query);

		if (result.length > 0) {
			title.id = result[0].id;
			return;
		}

		var author = title.author;
		var insert = "INSERT INTO titles (name, author";

		if (title.yomikiri) {
			insert += ", yomikiri) VALUES (\'" + name + "\', \'" + author + "\', true)";
		} else {
			insert += ") VALUES (\'" + name + "\', \'" + author + "\')";
		}
		
		result = await db.promisifyQuery(insert);
		title.id = result.insertId;
	}
	
	var insertEpisodes = async function(input) {
		var values = [];
		const issueId = input.issue.id;
		
		await db.promisifyQuery("DELETE FROM episodes where issueId = " + issueId);

		input.episodes.forEach((row, index) => {
			var value = "(" + issueId + "," + row.id + "," + index + "," + (index + 1);
			value += row.color ? ",\'カラー\'" : ", null";
			value += ")";
			values.push(value);
		});
		
		var insert = "INSERT INTO episodes (issueId, titleId, rawOrder, trueOrder, note) VALUES " + values.join(',');

		await db.promisifyQuery(insert);
	}

	router.post('/api/new/add', async function (req, res) {
		const input = req.body;

		if (input.issue.date === '' ||
				input.issue.num === '' ||
				input.episodes.length === 0) {
			res.sendStatus(200);
			return;
		}
		
		var issue = input.issue;
		await getIssue(issue);
		
		for (var i = 0; i < input.episodes.length; i++) {
			if (input.episodes[i].id !== undefined)
				continue;

			await getTitle(input.episodes[i]);
		}
			
		await insertEpisodes(input);
		res.sendStatus(200);
	});
};
