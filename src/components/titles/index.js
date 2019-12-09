import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './style.css';

export default class Recent extends Component {
  constructor(props) {
    super(props);

    this.state = { titles: [], year: this.props.match.params.year };

    this.startEdit = this.startEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.commit = this.commit.bind(this);

    this.check = this.check.bind(this);
  }

  componentDidMount() {
    this.fetch(this.state.year);
  }

  componentWillReceiveProps(nextProps) {
    const year = nextProps.match.params.year;

    if (year !== this.state.year) {
      this.setState({ titles: [], year: year });
      this.fetch(year);
    }
  }

  render() {
    const titles = this.state.titles;
    if (titles.length === 0) return <div>{this.getYearSelector()}</div>;

    const issueMap = this.getIssueMap();

    return (
      <div>
        {this.getYearSelector()}
        <br />
        <br />
        {this.state.titles.map(title => [
          <div
            key={title.id}
            className="Titles-grid"
            style={this.getTitleRowStyle(title)}
          >
            <div className="text-right hide-mobile">{title.id}</div>
            <div className="text-center">{title.complete ? '完' : ''}</div>
            <div className="overflow-hidden">
              <div className="ellipsis">{title.name}</div>
              <div className="ellipsis hide-mobile" style={{ color: 'gray' }}>
                {title.author}
              </div>
            </div>
            <div className="text-right">{title.count}</div>
            <div className="Titles-run">
              {issueMap[title.min]}-{issueMap[title.max]}
            </div>
            {this.state.selectedTitle === title ? (
              <button className="hide-mobile" onClick={() => this.cancelEdit()}>
                Cancel
              </button>
            ) : (
              <button
                className="hide-mobile"
                onClick={() => this.startEdit(title)}
              >
                Edit
              </button>
            )}
          </div>,
          this.getEditView(title)
        ])}
        <br />
      </div>
    );
  }

  sortTitles(a, b) {
    if (a.yomikiri && b.yomikiri) return a.id - b.id;

    if (a.yomikiri) return 1;

    if (b.yomikiri) return -1;

    return a.id - b.id;
  }

  getTitleRowStyle(title) {
    if (title.yomikiri) return { background: '#eeeeee' };

    return {};
  }

  getYearView(year, style) {
    var inner = year;

    if (year < 3000) {
      inner = (
        <span>
          <span className="show-mobile">{(year + '').substring(2, 4)}</span>
          <span className="hide-mobile">{year}</span>
        </span>
      );
    }

    return (
      <NavLink
        to={'/titles/' + year}
        key={year}
        style={style}
        activeStyle={{ fontWeight: 'bold' }}
      >
        {inner}
      </NavLink>
    );
  }

  getYearSelector() {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
      gridColumGap: '10px'
    };

    var years = [];
    var i;

    if (window.innerWidth > 543)
      years.push(this.getYearView('new', { gridColumn: '6' }));
    years.push(this.getYearView('current', { gridColumn: '7 / 9' }));

    for (i = 1968; i <= 2020; i++) {
      years.push(this.getYearView(i));
    }

    return (
      <div style={gridStyle} className="text-center">
        {years}
      </div>
    );
  }

  getEditView(title) {
    if (this.state.selectedTitle !== title) return null;

    return (
      <div key="edit" style={this.state.gridStyle}>
        <div />
        <div />
        <div />
        <div />
        <div>
          <div>
            <input
              type="checkbox"
              name="complete"
              defaultChecked={title.complete === 1}
              onChange={this.check}
            />{' '}
            完結
          </div>
          <div>
            <input
              type="checkbox"
              name="yomikiri"
              defaultChecked={title.yomikiri === 1}
              onChange={this.check}
            />{' '}
            読切
          </div>
        </div>
        <button className="Titles-commit" onClick={() => this.commit(title)}>
          Commit
        </button>
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

    issues.forEach(issue => {
      map[issue.id] = issue.rel.substring(0, 10);
    });

    return map;
  }

  commit(title) {
    const that = this;
    const url = '/api/title/update';
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(title)
    };

    fetch(url, options).then(() => {
      that.fetch();
    });
  }

  fetch(year) {
    const that = this;
    const url = '/api/title/select/' + year;

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
