import * as React from 'react';

import Styles from './styles';
import State from './state';
import Services from './services';
import Pages from './components/pages';

// Note Apollo is dependant on State for access to auth tokens
const App = () => (
  <Styles>
    <Services>
      <State>
        <Pages />
      </State>
    </Services>
  </Styles>
);

export default App;
