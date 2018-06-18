require('babel-runtime/regenerator');
require('./main.css');
require('./images/link.jpg');
require('./index.html');

const a = async args => {
	const { ab, bb } = args;
	await console.log('hello from async', ab);

	console.log('hello from the await', bb);
};

a({ ab: 'test1', bb: 'test2' });
