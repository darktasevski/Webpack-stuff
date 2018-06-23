import React, { Component } from 'react';

import MarkdownData from '../data/post.md';

export default class AppRoot extends Component {
	constructor(props) {
		super(props);

		this.state = {
			count: 0,
		};

		this.climb = this.climb.bind(this);
	}

	climb() {
		return this.setState({ count: this.state.count + 1 });
	}

	render() {
		return (
			<div className="profile">
				<img src={require('../images/link.jpg')} alt="" />
				<h1>{MarkdownData.title}</h1>
				<p>{MarkdownData.author}</p>
				<h2 dangerouslySetInnerHTML={{ __html: MarkdownData.__content }} />
			</div>
		);
	}
}
