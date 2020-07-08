import React from 'react';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';

// should be in .env file, here for an example
const process = {
  env: {
    REACT_APP_SECRET : 'supersecret',
    REACT_APP_API : 'https://class-34-auth.herokuapp.com'
  }
}

const API = process.env.REACT_APP_API;

export const LoginContext = React.createContext();

class LoginProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      login: this.login,
      logout: this.logout,
      user: {},
    };
  }

  login = async (username, password) => {

      try {
        
        // check this : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        
        const result = await fetch(`${API}/signin`, {
          method: 'post',
          mode: 'cors',
          cache: 'no-cache',
          headers: new Headers({
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          })
        })
        let res =  await result.json();
        console.log("res : ",res)
        this.validateToken(res.token);
      } catch(ex) {
        console.error(ex);
      }
  }

  validateToken = token => {
    try {

      console.log("token: ",token)
      let user = jwt.verify(token, process.env.REACT_APP_SECRET);
      console.log("user : ",user)
      
      this.setLoginState(true, token, user);
    }
    catch (e) {
      this.setLoginState(false, null, {});
      console.log('Token Validation Error', e);
    }

  };

  logout = () => {
    this.setLoginState(false, null, {});
  };

  setLoginState = (loggedIn, token, user) => {
    cookie.save('auth', token);
    this.setState({ token, loggedIn, user });
  };

  componentDidMount() {
    const cookieToken = cookie.load('auth');
    const token = cookieToken || null;
    this.validateToken(token);
  }

  render() {
    return (
      <LoginContext.Provider value={this.state}>
        {this.props.children}
      </LoginContext.Provider>
    );
  }
}

export default LoginProvider;
