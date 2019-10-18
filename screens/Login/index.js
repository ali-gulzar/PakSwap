import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Login from './Login';
import Welcome from './Welcome';
import Verify from './Verify';

const screens = createStackNavigator({
  Welcome,
  Login,
  Verify
});

export default createAppContainer(screens);