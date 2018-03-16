import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class AvailableTutors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutors: [
        {
          unit: 'Introduction to Programming',
          available: false,
        },
        {
          unit: 'Object-Oriented Programming',
          available: false,
        },
        {
          unit: 'Creating Web Applications',
          available: false,
        },
        {
          unit: 'Computer Systems',
          available: false,
        },
        {
          unit: 'Technical Software Development',
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
        color={tutor.available ? 'green' : 'red'}
        onClick={this.toggleAvailability.bind(this, i)} // eslint-disable-line react/jsx-no-bind
      >
        {tutor.unit}
      </Button>
    );
  }

  render() {
    const { tutors } = this.state;
    return (
      <div>
        <h2>Tutors currently in the room</h2>
        <Button.Group widths={tutors.length}>
          {tutors.map((tutor, i) => this.renderButton(tutor, i))}
        </Button.Group>
      </div>
    );
  }
}

export default AvailableTutors;
