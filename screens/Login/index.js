import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Login from './Login';
import Welcome from './Welcome';
import SignUp from './SignUp';
import Verify from './Verify';

const screens = createStackNavigator({
  Welcome,
  SignUp,
  Login,
  SignUp,
  Verify
});

export default createAppContainer(screens);