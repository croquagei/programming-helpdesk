import React, { Component } from 'react';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      request: {},
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.getRequests = this.getRequests.bind(this);
    this.closeRequest = this.closeRequest.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('addNewRequestResponse', (e, args) => {
      this.setState({ response: args });
    });
    ipcRenderer.on('getAllRequestsResponse', (e, args) => {
      console.log(args);
    });
    ipcRenderer.on('errorResponse', (e, args) => {
      console.log(args);
    });
    this.focusDefaultInput();
  }

  getRequests() {
    ipcRenderer.send('getAllRequests');
  }

  focusDefaultInput() {
    this.refs.nameInput.focus(); // eslint-disable-line
  }

  closeRequest() {
    ipcRenderer.send('closeRequest', JSON.stringify({ id: 20 }));
  }

  handleFormSubmit(e) {
    const { request } = this.state;
    e.preventDefault();
    e.currentTarget.reset();
    this.focusDefaultInput();
    ipcRenderer.send('addNewRequest', JSON.stringify(request));
  }

  handleFormInput(e) {
    const { target } = e;
    const { request } = this.state;
    request[target.id] =
      target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ request });
  }

  render() {
    if (this.state.response) console.log(this.state.response);
    return (
      <div className="app invert">
        <form onSubmit={this.handleFormSubmit}>
          <input
            type="text"
            id="name"
            placeholder="name"
            onChange={this.handleFormInput}
            ref="nameInput" // eslint-disable-line
          />
          <select id="unit" onChange={this.handleFormInput}>
            <option value="">--please select unit--</option>
            <option value="ITP">Introduction to Programming</option>
            <option value="OOP">Object-Oriented Programming</option>
            <option value="CS">Computer Systems</option>
            <option value="TSD">Technical Software Development</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            id="desc"
            placeholder="desc"
            onChange={this.handleFormInput}
          />
          <br />
          <button type="submit">Save</button>
        </form>
        <button type="button" onClick={this.closeRequest}>
          close request
        </button>
        <button type="button" onClick={this.getRequests}>
          getRequests
        </button>
      </div>
    );
  }
}

export default App;
