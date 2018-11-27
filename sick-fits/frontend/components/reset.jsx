import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { RESET_MUTATION } from '../resolvers/mutation';
import { CURRENT_USER_QUERY } from '../resolvers/query';
import Error from './error-message';
import Form from './styles/Form';

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
