import React from 'react';
import '../css/About.css';

const About = props => {
	const siteConfig = require(`../../data/${props.site}/siteConfig`);
	const MarkdownData = require(`../../data/${props.site}/bio.md`);
	const imagePath = require(`../images/${siteConfig.aboutImage}`);

	return (
		<div>
			<div className="profile">
				<img src={imagePath} />
				<h1>{MarkdownData.title}</h1>
				<div
					className="content"
					dangerouslySetInnerHTML={{ __html: MarkdownData.__content }}
				/>
			</div>
		</div>
	);
};

export default About;
