import React from 'react';
import '../css/Gallery.css';

const getBundle = () => {
	import('lodash').then(_ => {
		console.log('imported', _);
	});
};

const Gallery = () => (
	<div>
		<h1 onClick={getBundle}>Gallery</h1>
	</div>
);

export default Gallery;
