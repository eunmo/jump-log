import React, { Component } from 'react';

import './style.css';

export default class Recent extends Component {

  constructor(props) {
    super(props);

    this.state = {titles: []};
  }

  componentDidMount() {
    this.fetch();
  }

	render() {
		const titles = this.state.titles;
		if (titles.length === 0)
			return null;
		
		const issueMap = this.getIssueMap();

		const gridStyle = {
			display: 'grid',
			gridTemplateColumns: '50px 1fr 1fr 50px 200px',
			gridColumGap: '10px',
		};

		return (
			<div>
				{titles.map(title =>
					<div key={title.id} style={gridStyle}>
						<div>{title.id}</div>
						<div>{title.name}</div>
						<div>{title.author}</div>
						<div>{title.count}</div>
						<div>{issueMap[title.min]}-{issueMap[title.max]}</div>
					</div>
				)}
			</div>
		);
	}

	getIssueMap() {
		const issues = this.state.issues;
		var map = {};

		issues.forEach(issue => {map[issue.id] = issue.rel.substring(0, 10)});

		return map;
	}

	fetch() {
		const that = this;
		const url = '/api/title/all';

		fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
			that.setState(data);
		});
	}
}
