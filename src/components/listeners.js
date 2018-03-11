import { Component } from 'react';
import PropTypes from 'prop-types';

class Listeners extends Component {
  componentDidMount() {
    window.addEventListener('keypress', this.props.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.props.onKeyPress);
  }

  render() {
    return null;
  }
}

Listeners.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
};

export default Listeners;
