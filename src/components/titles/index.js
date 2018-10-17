import React, { Component } from 'react';

import './style.css';

export default class Recent extends Component {

  constructor(props) {
    super(props);

		const gridStyle = {
			display: 'grid',
			gridTemplateColumns: '50px 30px 1fr 50px 200px 60px',
			gridColumnGap: '10px',
		};
    
		this.state = {titles: [], selectedYear: 2018, gridStyle: gridStyle};

		this.selectYear = this.selectYear.bind(this);
		this.startEdit = this.startEdit.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.commit = this.commit.bind(this);

		this.check = this.check.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

	render() {
		const titles = this.state.titles;
		if (titles.length === 0)
			return null;
		
		const issueMap = this.getIssueMap();
		const year = this.state.selectedYear;
		const filteredTitles = titles.filter(t => Number.parseInt(issueMap[t.min].substring(0, 4), 10) === year);

		return (
			<div>
				{this.getYearSelector()}
				<br/>
				<br/>
				{filteredTitles.map(title => [
					<div key={title.id} style={this.getTitleRowStyle(title)}>
						<div className="text-right">{title.id}</div>
						<div className="text-center">{title.complete ? '完' : ''}</div>
						<div>
							<div>{title.name}</div>
							<div style={{color: 'gray'}}>{title.author}</div>
						</div>
						<div className="text-right">{title.count}</div>
						<div>{issueMap[title.min]}-{issueMap[title.max]}</div>
						{this.state.selectedTitle === title ?
							<button onClick={() => this.cancelEdit()}>Cancel</button> :
							<button onClick={() => this.startEdit(title)}>Edit</button>}
					</div>,
					this.getEditView(title)
				])}
			</div>
		);
	}

	getTitleRowStyle(title) {
		if (title.yomikiri)
			return Object.assign({background: '#eeeeee'}, this.state.gridStyle);

		return this.state.gridStyle;
	}

	getYearView(year) {
		var inner = year;

		if (this.state.selectedYear === year)
			inner = <b>{year}</b>;

		return <div key={year} onClick={() => this.selectYear(year)}>{inner}</div>;
	}

	getYearSelector() {
		const gridStyle = {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
			gridColumGap: '10px',
		};

		var years = [];
		var i;

		for (i = 1960; i < 1968; i++) {
			years.push(<div key={i}/>);
		}

		for (i = 1968; i <= 2018; i++) {
			years.push(this.getYearView(i));
		}

		return (
			<div style={gridStyle} className="text-center">
				{years}
			</div>
		);
	}

	getEditView(title) {
		if (this.state.selectedTitle !== title)
			return null;

		return (
			<div key="edit" style={this.state.gridStyle}>
				<div/>
				<div/>
				<div/>
				<div/>
				<div>
					<div>
						<input type="checkbox" name="complete" defaultChecked={title.complete === 1} onChange={this.check}/> 完結
					</div>
					<div>
						<input type="checkbox" name="yomikiri" defaultChecked={title.yomikiri === 1} onChange={this.check}/> 読切
					</div>
				</div>
				<button className="Titles-commit"  onClick={() => this.commit(title)}>Commit</button>
			</div>
		);
	}

	selectYear(year) {
		this.setState({ selectedYear: year, selectedTitle: null });
	}

	startEdit(title) {
		this.setState({ selectedTitle: title });
	}

	cancelEdit() {
		this.setState({ selectedTitle: null });
	}

	check(event) {
		const title = this.state.selectedTitle;
		title[event.target.name] = event.target.checked;
		this.setState({ selectedTitle: title });
	}

	getIssueMap() {
		const issues = this.state.issues;
		var map = {};

		issues.forEach(issue => {map[issue.id] = issue.rel.substring(0, 10)});

		return map;
	}

	commit(title) {
		const that = this;
		const url = '/api/title/update';
		const options = {
			method: 'POST',
			headers: {
    	  'Accept': 'application/json',
  	    'Content-Type': 'application/json'
	    },
			body: JSON.stringify(title)
		};

		fetch(url, options)
    .then(() => {	that.fetch(); });
	}

	fetch() {
		const that = this;
		const url = '/api/title/select/all';

		fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
			data.selectedTitle = null;
			that.setState(data);
		});
	}
}
