import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import Error from './error-message';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './user';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { resetToken } = this.props;
    const { password, confirmPassword } = this.state;
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken,
          password,
          confirmPassword,
        }}
        refetchQueries={[{
          query: CURRENT_USER_QUERY,
        }]}
      >
        {(resetPassword, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await resetPassword();
              this.setState({
                password: '',
                confirmPassword: '',
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <Error error={error} />
              <label htmlFor="password">
                New Password
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm New Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <button type="submit">Reset Password!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Reset;
export { RESET_MUTATION };
