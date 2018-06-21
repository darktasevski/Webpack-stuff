import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Counter from './counter';

function render(Component) {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('react-root')
	);
}

render(Counter);

if (module.hot) {
	module.hot.accept('./counter.js', () => {
		const NewCounter = require('./counter.js').default;
		render(NewCounter);
	});
}
