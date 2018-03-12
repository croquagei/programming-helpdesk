import React from 'react';
import { Button, Input, Dropdown, Icon, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Listeners from './listeners';

const RequestForm = props => {
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      props.handleFormSubmit();
    }
  };
  const units = [
    {
      value: 'Introduction to Programming',
      text: 'Introduction to Programming',
    },
    {
      value: 'Object-Oriented Programming',
      text: 'Object-Oriented Programming',
    },
    {
      value: 'Creating Web Applications',
      text: 'Creating Web Applications',
    },
    {
      value: 'Computer Systems',
      text: 'Computer Systems',
    },
    {
      value: 'Technical Software Development',
      text: 'Technical Software Development',
    },
    {
      value: 'Other',
      text: 'Other',
    },
  ];
  return (
    <div>
      <Input
        type="text"
        id="name"
        placeholder="name"
        onChange={props.handleFormInput}
        fluid
        iconPosition="left"
      >
        <Icon name="user" />
        <input autoFocus />
      </Input>
      <br />
      <Dropdown
        id="unit"
        onChange={props.handleFormInput}
        placeholder="unit"
        fluid
        search
        selection
        options={units}
      />
      <br />
      <Input
        type="text"
        id="desc"
        placeholder="desc"
        onChange={props.handleFormInput}
        fluid
        iconPosition="left"
      >
        <Icon name="talk" />
        <input />
      </Input>
      <br />
      {props.showErrorMessage && (
        <div>
          <Message negative>
            <Message.Header>{props.errorMessageHeader}</Message.Header>
            <p>{props.errorMessageContent}</p>
          </Message>
          <br />
        </div>
      )}
      <Button color="green" floated="right" onClick={props.handleFormSubmit}>
        <Icon name="checkmark" />
        Submit
      </Button>
      <Button color="red" floated="right" onClick={props.closeHelpModal}>
        <Icon name="close" />
        Cancel
      </Button>
      <br />
      <Listeners onKeyPress={handleKeyPress} />
      <br />
    </div>
  );
};

RequestForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  handleFormInput: PropTypes.func.isRequired,
  showErrorMessage: PropTypes.bool.isRequired,
  errorMessageHeader: PropTypes.string.isRequired,
  errorMessageContent: PropTypes.string.isRequired,
  closeHelpModal: PropTypes.func.isRequired,
};

export default RequestForm;
