import React, { Component }  from 'react';
import './SignIn.css';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value })
  }

  saveAuthTokenInSession = (token) => {
      window.sessionStorage.setItem('token', token);
  }

  onSubmitSignIn = () => {
    fetch('https://blooming-shelf-98482.herokuapp.com/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    }).then(response => response.json())
      .then(data => {
        if (data.userId && data.success === 'true') {
          this.saveAuthTokenInSession(data.token);
          fetch(`https://blooming-shelf-98482.herokuapp.com/profile/${data.userId}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': data.token
            }
          })
              .then(res => res.json())
              .then(user => {
                if (user && user.email) {
                  this.props.loadUser(user);
                  this.props.onRouteChange('home');
                }
              })
        }
      })
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 shadow-5 w-100 w-50-m w-25-l mw5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
                onClick={ this.onSubmitSignIn }
              />
            </div>
            <div className="lh-copy mt3">
              <p
                className="f6 link dim black db pointer"
                onClick={() => onRouteChange('register')} >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
};

export default SignIn;