'use strict';

import React from 'react';
import '../css/base.css';

import World from './world';

class Hello extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleClick = (e) => {
    this.props.navigator.push({name:'World', index: 1, component: World});
  }

  render() {
    return (
      <div style={{padding: 10}}>
        <h1> Hello World </h1>
        <br/>
        <div onClick={this._handleClick}>Click Here to navigate to next page</div>
      </div>
    );
  }

}

export default Hello;
