import React, { Component } from 'react';
import RequestTable from '../components/request-table';
import Header from '../components/header';
import RequestForm from '../components/request-form';
import AvailableTutors from './available-tutors';
import BellSample from '../sounds/bell.wav';
import Listeners from '../components/listeners';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorMessage: false,
      errorMessageHeader: '',
      errorMessageContent: '',
      request: {
        name: '',
        desc: '',
        unit: '',
      },
      requests: [],
      errorTimeout: null,
      units: [],
    };
    this.Bell = new Audio(BellSample);
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.getRequests = this.getRequests.bind(this);
    this.closeRequest = this.closeRequest.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.fetchUnits();
    ipcRenderer.on('addNewRequestResponse', (e, args) => {
      const json = JSON.parse(args);
      console.log(json); // eslint-disable-line no-console
      this.addRequest(json.doc);
    });
    ipcRenderer.on('closeRequestResponse', (e, args) => {
      const json = JSON.parse(args);
      console.log(json); // eslint-disable-line no-console
    });
    ipcRenderer.on('getAllRequestsResponse', (e, args) => {
      console.log(args); // eslint-disable-line no-console
    });
    ipcRenderer.on('errorResponse', (e, args) => {
      console.log(args); // eslint-disable-line no-console
    });
    this.interval = setInterval(this.forceUpdate.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRequests() {
    ipcRenderer.send('getAllRequests');
  }

  fetchUnits() {
    fetch('./units.json')
      .then(response => response.json())
      .then(units => {
        this.setState({ units });
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleFormSubmit();
    }
  }

  addRequest(request) {
    const { requests } = this.state;
    requests.push(request);
    this.setState({ requests });
  }

  closeRequest(id) {
    ipcRenderer.send('closeRequest', JSON.stringify({ id }));
    let { requests } = this.state;
    requests = requests.filter(request => request.id !== id);
    this.setState({ requests });
  }

  handleFormSubmit() {
    const { request } = this.state;
    if (
      request &&
      request.name &&
      request.unit &&
      request.unit !== '' &&
      request.desc
    ) {
      ipcRenderer.send('addNewRequest', JSON.stringify(request));
      this.Bell.play();
      this.setState({ request: { name: '', desc: '', unit: '' } });
      document.getElementById('name-input').focus();
    } else {
      this.displayErrorMessage(
        'Cannot submit help request',
        'Please fill out every field',
        10000,
      );
    }
  }

  clearRequestForm() {
    this.setState({ request: {}, showErrorMessage: false });
  }

  handleFormInput(e, data) {
    const { request, showErrorMessage } = this.state;
    request[data.id] = data.value;
    this.setState({ request });
    if (showErrorMessage) {
      this.clearErrorMessage();
    }
  }

  clearErrorMessage() {
    this.setState({
      showErrorMessage: false,
      errorMessageHeader: '',
      errorMessageContent: '',
    });
  }

  displayErrorMessage(header, content, duration = 5000) {
    clearTimeout(this.state.errorTimeout);
    const errorTimeout = setTimeout(
      this.clearErrorMessage.bind(this),
      duration,
    );
    this.setState({
      showErrorMessage: true,
      errorMessageHeader: header,
      errorMessageContent: content,
      errorTimeout,
    });
  }

  render() {
    const {
      requests,
      request,
      showErrorMessage,
      errorMessageHeader,
      errorMessageContent,
      units,
    } = this.state;
    return (
      <div className="app">
        <Header />
        <RequestForm
          handleFormInput={this.handleFormInput}
          handleFormSubmit={this.handleFormSubmit}
          request={request}
          showErrorMessage={showErrorMessage}
          errorMessageHeader={errorMessageHeader}
          errorMessageContent={errorMessageContent}
          units={units}
        />
        <AvailableTutors />
        <main>
          <RequestTable requests={requests} closeRequest={this.closeRequest} />
        </main>
        <Listeners onKeyPress={this.handleKeyPress} />
      </div>
    );
  }
}

export default App;
