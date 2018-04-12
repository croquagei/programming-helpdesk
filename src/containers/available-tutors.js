import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class AvailableTutors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutors: [
        {
          unit: 'COS10009/COS60006 Introduction to Programming',
          available: false,
        },
        {
          unit: 'COS20007 Object-Oriented Programming',
          available: false,
        },
        {
          unit: 'COS10011/COS60004 Creating Web Applications',
          available: false,
        },
        {
          unit: 'COS10004 Computer Systems',
          available: false,
        },
        {
          unit: 'SWE20004 Technical Software Development',
          available: false,
        },
      ],
    };
    this.toggleAvailability = this.toggleAvailability.bind(this);
  }

  toggleAvailability(i) {
    const { tutors } = this.state;
    tutors[i].available = !tutors[i].available;
    this.setState({ tutors });
  }

  renderButton(tutor, i) {
    return (
      <Button
        key={i}
        color={tutor.available ? 'green' : 'grey'}
        onClick={this.toggleAvailability.bind(this, i)} // eslint-disable-line react/jsx-no-bind
      >
        {tutor.unit}
      </Button>
    );
  }

  render() {
    const { tutors } = this.state;
    return (
      <div className="available-tutors">
        <h2>
          Currently Available Units <small>(Click to Toggle)</small>
        </h2>
        <Button.Group widths={tutors.length}>
          {tutors.map((tutor, i) => this.renderButton(tutor, i))}
        </Button.Group>
      </div>
    );
  }
}

export default AvailableTutors;
