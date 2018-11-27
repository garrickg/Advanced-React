import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import { Mutation, Query } from 'react-apollo';

import Error from './error-message';
import SickButton from './styles/SickButton';
import Table from './styles/Table';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission]!, $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                <th>Update</th>
              </tr>
            </thead>
            <tbody>{data.users.map(user => <UserPermissions user={user} key={user.id} />)}</tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = (e) => {
    const { permissions } = this.state;
    const checkbox = e.target;
    let updatedPermissions = [...permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
    }
    this.setState({
      permissions: updatedPermissions,
    });
  }

  render() {
    const { user } = this.props;
    const { permissions } = this.state;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions,
          userId: user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && <tr><Error error={error} /></tr>}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )
        }
      </Mutation>
    );
  }
}

export default Permissions;
