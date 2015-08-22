'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './view/hello';
import Navigator from 'react-navigator';

import './css/base';

// Copy image files to build folder
import 'file-loader?name=[path][name].[ext]&context=./img/*';

// Copy index.html to build folder
import './html/index.html';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'Main', component: Hello, index: 0}}
        renderScene={(route, navigator) => {
          return React.createElement(route.component, {navigator});
        }}/>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('content'));
