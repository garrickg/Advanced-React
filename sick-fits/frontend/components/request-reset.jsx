import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { REQUEST_RESET_MUTATION } from '../resolvers/mutation';
import Error from './error-message';
import Form from './styles/Form';

class RequestReset extends Component {
  state = {
    email: '',
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { email } = this.state;
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, { error, loading, called }) => (
          <Form
            data-test="form"
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await requestReset();
              this.setState({
                email: '',
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && <p>Success! Check your email for a reset link!</p>}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <button type="submit">Request Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
