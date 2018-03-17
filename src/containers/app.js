import React, { Component } from 'react';
import { Button, Modal, Transition } from 'semantic-ui-react';
import RequestTable from '../components/request-table';
import RequestForm from '../components/request-form';
import AvailableTutors from './available-tutors';
import BellSample from '../sounds/bell.wav';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorMessage: false,
      errorMessageHeader: '',
      errorMessageContent: '',
      showHelpModal: false,
      request: {},
      requests: [],
      animateButton: true,
      animation: 'jiggle',
    };
    this.Bell = new Audio(BellSample);
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.getRequests = this.getRequests.bind(this);
    this.closeRequest = this.closeRequest.bind(this);
    this.openHelpModal = this.openHelpModal.bind(this);
    this.closeHelpModal = this.closeHelpModal.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
  }

  componentDidMount() {
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
    this.triggerAnimation();
  }

  getRequests() {
    ipcRenderer.send('getAllRequests');
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
      this.closeHelpModal();
      this.Bell.play();
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
    this.setState({
      showErrorMessage: true,
      errorMessageHeader: header,
      errorMessageContent: content,
    });
    setTimeout(this.clearErrorMessage.bind(this), duration);
  }

  openHelpModal() {
    this.clearRequestForm();
    this.setState({ showHelpModal: true });
  }

  closeHelpModal() {
    this.setState({
      showHelpModal: false,
      request: {},
      showErrorMessage: false,
    });
  }

  triggerAnimation() {
    const { showHelpModal } = this.state;
    if (!showHelpModal) {
      const { animateButton } = this.state;
      const animations = ['jiggle', 'shake', 'pulse', 'tada', 'bounce'];
      const randomNumber = Math.floor(Math.random() * animations.length);
      const animation = animations[randomNumber];
      this.setState({ animateButton: !animateButton, animation });
    }
    setTimeout(this.triggerAnimation, 10000);
  }

  renderModal() {
    const {
      showHelpModal,
      showErrorMessage,
      errorMessageHeader,
      errorMessageContent,
      displayErrorMessage,
      request,
    } = this.state;
    return (
      <Modal open={showHelpModal} onClose={this.closeHelpModal}>
        <Modal.Header>Tell us a little more about the issue</Modal.Header>
        <Modal.Content>
          <RequestForm
            request={request}
            handleFormInput={this.handleFormInput}
            handleFormSubmit={this.handleFormSubmit}
            closeHelpModal={this.closeHelpModal}
            showErrorMessage={showErrorMessage}
            errorMessageHeader={errorMessageHeader}
            errorMessageContent={errorMessageContent}
            displayErrorMessage={displayErrorMessage}
          />
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    const { requests, animateButton, animation } = this.state;
    return (
      <div className="app">
        <header>
          <h1>Welcome to the Programming Helpdesk</h1>
        </header>
        <div className="available-tutors">
          <AvailableTutors />
        </div>
        <main>
          <RequestTable requests={requests} closeRequest={this.closeRequest} />
        </main>
        <footer>
          <Transition
            animation={animation}
            duration={700}
            visible={animateButton}
          >
            <Button
              color="green"
              className="help-btn"
              size="massive"
              onClick={this.openHelpModal}
              fluid
            >
              Ask for help
            </Button>
          </Transition>
        </footer>
        {this.renderModal()}
      </div>
    );
  }
}

export default App;
