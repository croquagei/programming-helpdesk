import React from 'react';
import { Button, Input, Dropdown, Message, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const RequestForm = props => {
  const units = [
    {
      value: 'Introduction to Programming',
      text: ' COS10009/COS60006 - Introduction to Programming',
    },
    {
      value: 'Object-Oriented Programming',
      text: 'COS20007 - Object-Oriented Programming',
    },
    {
      value: 'Creating Web Applications',
      text: 'COS10011/COS6004 - Creating Web Applications',
    },
    {
      value: 'Computer Systems',
      text: 'COS10004 - Computer Systems',
    },
    {
      value: 'Technical Software Development',
      text: 'SWE20004 - Technical Software Development',
    },
    {
      value: 'Other',
      text: 'Other',
    },
  ];
  return (
    <div className="help-form">
      <hr />
      <h2 className="help-title">Need Help? Please Queue Here</h2>
      <Form>
        <div className="input-field">
          <Input
            type="text"
            id="name"
            placeholder="What is your name?"
            onChange={props.handleFormInput}
            value={props.request.name}
            fluid
          >
            <input id="name-input" autoFocus />
          </Input>
        </div>
        <div className="input-field">
          <Dropdown
            id="unit"
            onChange={props.handleFormInput}
            placeholder="Which unit?"
            search
            selection
            className="input-field"
            options={units}
            fluid
            value={props.request.unit}
          />
        </div>
        <div className="input-field">
          <Input
            type="text"
            id="desc"
            className="input-field"
            placeholder="What do you need help with?"
            onChange={props.handleFormInput}
            fluid
            value={props.request.desc}
          >
            <input />
          </Input>
        </div>
        <div className="input-field-short">
          <Button color="green" onClick={props.handleFormSubmit} fluid>
            OK
          </Button>
        </div>
      </Form>
      {props.showErrorMessage && (
        <div>
          <br />
          <Message negative>
            <Message.Header>{props.errorMessageHeader}</Message.Header>
            <p>{props.errorMessageContent}</p>
          </Message>
          <br />
        </div>
      )}
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
  request: PropTypes.shape({
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
};

export default RequestForm;
