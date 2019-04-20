import React, { Component } from 'react';

import './style.css';

export default class NewIssue extends Component {
  
	constructor(props) {
    super(props);

		var state =  {episodes: [], titles: [], issue: {date: '', num: '', cnum: ''}};

		if (props.match.params.data) {
			state.loadedData = JSON.parse(props.match.params.data);
		}

		this.state = state;

		this.addEpisode = this.addEpisode.bind(this);
		this.addNew = this.addNew.bind(this);
		this.removeEpisode = this.removeEpisode.bind(this);

		this.type = this.type.bind(this);
		this.check = this.check.bind(this);
		
		this.commit = this.commit.bind(this);
	}

  componentDidMount() {
    this.fetch();
  }

	render() {
		const gridStyleA = {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
			gridColumnGap: '10px',
		};
		
		const gridStyleB = {
			display: 'grid',
			gridTemplateColumns: '30px 30px 1fr 30px',
			gridColumnGap: '10px',
		};
		
		const dateInputGridStyle = {
			display: 'grid',
			gridTemplateColumns: '50px 2fr 50px 1fr 50px 1fr',
		};

		const textInputGridStyle = {
			display: 'grid',
			gridTemplateColumns: '55px 1fr',
			gridColumnGap: '10px',
		};

		const textInputStyle = {
			width: '90%',
			padding: '6px'
		};

		const issue = this.state.issue;

		return (
			<div>
				<div style={gridStyleA}>
					{this.state.titles.map(title => 
						<div key={title.name} className="overflow-hidden" onClick={() => this.addEpisode(title)}>
							<div className="ellipsis">{this.state.episodes.includes(title) ? title.name : <b>{title.name}</b>}</div>
							<div className="ellipsis gray">{title.author}</div>
						</div>
					)}
					<div onClick={this.addNew}><b>Add new series</b></div>
				</div>
				<br/>
				<div style={dateInputGridStyle}>
					<div style={textInputStyle}>Date</div>
					<input type="text" name="date" value={issue.date} onChange={event => this.type(event, issue)} style={textInputStyle} />
					<div style={textInputStyle}>num</div>
					<input type="text" name="num" value={issue.num} onChange={event => this.type(event, issue)} style={textInputStyle} />
					<div style={textInputStyle}>cnum</div>
					<input type="text" name="cnum" value={issue.cnum} onChange={event => this.type(event, issue)} style={textInputStyle} />
				</div>
				<br/>
				<div>
					{this.state.episodes.map((entry, index) => {
						if (entry.id !== undefined) {
							return (
								<div style={gridStyleB} key={index}>
									<div className="text-right">{index + 1}</div>
									<div className="text-center" onClick={() => this.removeEpisode(index)}>X</div>
									<div>
										<div>{entry.name}</div>
										<div>
											<input type="checkbox" name="color" defaultChecked={entry.color === 1} onChange={event => this.check(event, entry)}/> Color
										</div>
									</div>
								</div>
							);
						} else {
							return (
								<div style={gridStyleB} key={index}>
									<div className="text-right">{index + 1}</div>
									<div className="text-center" onClick={() => this.removeEpisode(index)}>X</div>
									<div>
										<div style={textInputGridStyle}>
											<div style={textInputStyle}>Name:</div>
											<input type="text" name="name" value={entry.name} onChange={event => this.type(event, entry)} style={textInputStyle} />
										</div>
										<div style={textInputGridStyle}>
											<div style={textInputStyle}>Author:</div>
											<input type="text" name="author" value={entry.author} onChange={event => this.type(event, entry)} style={textInputStyle} />
										</div>
										<div>
											<input type="checkbox" name="yomikiri" defaultChecked={entry.yomikiri === 1} onChange={event => this.check(event, entry)}/> 読切
											<span style={{display: 'inline-block', width: '10px'}}/>
											<input type="checkbox" name="color" defaultChecked={entry.color === 1} onChange={event => this.check(event, entry)}/> Color
										</div>
									</div>
								</div>
							);
						}
					})}
				</div>
				<div>
					<button onClick={this.commit}>Commit</button>
				</div>
			</div>
		);
	}

	addEpisode(title) {
		var episodes = this.state.episodes;
		episodes.push(title);
		this.setState({episodes: episodes});
	}

	addNew() {
		var episodes = this.state.episodes;
		episodes.push({name: '', author: ''});
		this.setState({episodes: episodes});
	}
	
	removeEpisode(index) {
		var episodes = this.state.episodes;
		episodes.splice(index, 1);
		this.setState({episodes: episodes});
	}
	
	type(event, entry) {
		entry[event.target.name] = event.target.value;
		this.setState({});
	}
	
	check(event, entry) {
		entry[event.target.name] = event.target.checked;
	}
	
	commit() {
		const that = this;
		const url = '/api/new/add';
		const data = {
			episodes: this.state.episodes,
			issue: this.state.issue
		};
		const options = {
			method: 'POST',
			headers: {
    	  'Accept': 'application/json',
  	    'Content-Type': 'application/json'
	    },
			body: JSON.stringify(data)
		};

		fetch(url, options)
    .then(() => {	that.props.history.push('/'); });
	}

	onData(data) {
		var episodes = [];
		if (this.state.loadedData) {
			var map = {};
			data.forEach(row => { map[row.name] = row; });
			this.state.loadedData.forEach((item, index) => {
				let row = map[item.title];
				if (row) {
					if (index === 0)
						row.color = 1;
					episodes.push(row);
				} else {
					episodes.push({name: item.title, author: item.creator, yomikiri: 1});
				}
			});
			console.log(data);
		}
		this.setState({titles: data, episodes: episodes});
	}

	fetch() {
		const that = this;
		const url = '/api/new/select';

		fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
			that.onData(data);
		});
	}
}
