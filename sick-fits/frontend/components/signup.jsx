import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { SIGNUP_MUTATION } from '../resolvers/mutation';
import { CURRENT_USER_QUERY } from '../resolvers/query';
import Error from './error-message';
import Form from './styles/Form';

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { email, name, password } = this.state;
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await signup();
              this.setState({
                name: '',
                email: '',
                password: '',
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account</h2>
              <Error error={error} />
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
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
