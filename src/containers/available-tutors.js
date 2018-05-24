import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class AvailableTutors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutors: [],
      loading: true,
    };
    this.toggleAvailability = this.toggleAvailability.bind(this);
  }

  componentDidMount() {
    this.fetchTutors();
  }

  toggleAvailability(i) {
    const { tutors } = this.state;
    tutors[i].available = !tutors[i].available;
    this.setState({ tutors });
  }

  fetchTutors() {
    fetch('./units.json')
      .then(response => response.json())
      .then(response => {
        // eslint-disable-next-line
        const tutors = response.map(tutor => {
          return { ...tutor, available: false };
        });
        this.setState({ tutors, loading: false });
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
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
    const { tutors, loading } = this.state;
    return loading ? (
      <p>Loading tutors</p>
    ) : (
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
