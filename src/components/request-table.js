import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

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
    <Table.Row key={request.id}>
      <Table.Cell>{request.name}</Table.Cell>
      <Table.Cell>{request.unit}</Table.Cell>
      <Table.Cell>
        <ReactMarkdown source={request.desc} />
      </Table.Cell>
      <Table.Cell>{timeSince(request.timeRequested)}</Table.Cell>
      <Table.Cell
        className="clickable request-row-trash"
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
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Unit</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell />
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
