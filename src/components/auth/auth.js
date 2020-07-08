import React from 'react';
import { LoginContext } from './context';
import Show from '../show'

class Auth extends React.Component {
  static contextType = LoginContext;
  render() {
    let okToRender = false;

    try {
      okToRender =
        this.context.loggedIn &&
        (this.props.capability
          ? this.context.user.capabilities.includes(this.props.capability)
          : true);
    } catch (e) {
      console.warn('Not Authorized');
    }

    // <Auth> <div /> </Auth>
    /// are you logged in?
    /// was there no capability specified?

    // <Auth capability="foo"> <div /> </Auth>
    /// are you logged in?
    /// Is there a capability that we care about?
    /// do you have it?

    return (
      <Show condition={okToRender}>
        <div>{this.props.children}</div>
      </Show>
    );
  }
}

export default Auth;
