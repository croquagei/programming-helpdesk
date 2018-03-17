import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const RequestTable = props => {
  const timeSince = time => {
    const now = new Date();
    const then = new Date(time);
    const difference = now.getTime() - then.getTime();
    const mins = new Date(difference).getMinutes();
    const phrasing = mins === 1 ? 'min' : 'mins';
    const msg = mins > 0 ? `${mins} ${phrasing} ago` : 'just now';
    return msg;
  };
  const renderRow = request => (
    <Table.Row key={request.id} className="request-row">
      <Table.Cell>{request.name}</Table.Cell>
      <Table.Cell>{request.unit}</Table.Cell>
      <Table.Cell>{request.desc}</Table.Cell>
      <Table.Cell>{timeSince(request.timeRequested)}</Table.Cell>
      <Table.Cell
        className="clickable"
        onClick={() => props.closeRequest(request.id)} // eslint-disable-line react/prop-types
      >
        <Icon name="trash" />
      </Table.Cell>
    </Table.Row>
  );

  const renderTable = () => {
    const { requests } = props; // eslint-disable-line react/prop-types
    return (
      <Table padded="very" className="center aligned">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="request-header">Name</Table.HeaderCell>
            <Table.HeaderCell className="request-header">Unit</Table.HeaderCell>
            <Table.HeaderCell className="request-header">
              Description
            </Table.HeaderCell>
            <Table.HeaderCell className="request-header">Time</Table.HeaderCell>
            <Table.HeaderCell className="request-header">
              Remove
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {requests.length > 0 ? (
          <Table.Body>{requests.map(renderRow)}</Table.Body>
        ) : (
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                No active help requests
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    );
  };
  return renderTable();
};

RequestTable.propTypes = {
  closeRequest: PropTypes.func.isRequired,
  requests: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default RequestTable;
