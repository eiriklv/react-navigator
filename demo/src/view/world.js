'use strict';

import React from 'react';
import '../css/base.css';

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  _handleClick = (e) => {
    if (this.state.count <= 5) {
      this.setState({ count: this.state.count + 1 });
      return;
    }
    this.props.navigator.pop();
  }

  _handleTextClick = () => {
    this.props.navigator.replace({name:'WorldX', component: World, index: 1});
  }

  render() {
    return (
      <div style={{padding: 10}}>
        <h1 onClick={this._handleTextClick}> Hello World New Page </h1>
        <br />
        <div onClick={this._handleClick}>{`Click Count: ${this.state.count}`}</div>
      </div>
    );
  }

}

export default World;
