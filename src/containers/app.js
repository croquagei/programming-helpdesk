import React, { Component } from 'react';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
    };
    this.sendTestMessage = this.sendTestMessage.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('testResponse', (e, args) => {
      this.setState({ response: args });
    });
  }

  sendTestMessage() {
    ipcRenderer.send('testMessage', 'Can you hear me?');
  }

  render() {
    if (this.state.response) console.log(this.state.response);
    return (
      <div className="app invert">
        <button onClick={this.sendTestMessage}>HP</button>
      </div>
    );
  }
}

export default App;
