import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

import IntroScreen from './screens/IntroScreen';
import Welcome from './screens/Login/Welcome'; 

export default class App extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      isLoadingComplete: false,
      introDone: false,
      loggedIn: false,
    }

    this.loadResourcesAsync = this.loadResourcesAsync.bind(this)
    this._retrieveAsyncStorageData = this._retrieveAsyncStorageData.bind(this)
    this.handleLoadingError = this.handleLoadingError.bind(this)
    this.handleFinishLoading = this.handleFinishLoading.bind(this)
    this.saveAndChangeintroDone = this.saveAndChangeintroDone.bind(this)
  }

  async loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      })
    ]).then((values) => {
      this._retrieveAsyncStorageData();
    });
  }
  
  async _retrieveAsyncStorageData () {
    try {
      const value = await AsyncStorage.getItem('@introDone:key');
      if (value !== null) {
        this.setState({introDone: true});
      } else {
        return;
      }
    } catch (error) {
      return;
    }
  };
  
  handleLoadingError(error) {
    console.warn(error);
  }
  
  handleFinishLoading() {
    this.setState({isLoadingComplete: true})
  }

  async saveAndChangeintroDone () {
    try {
      await AsyncStorage.setItem('@introDone:key', 'true');
    } catch (error) {
      return;
    }
    this.setState({introDone: true})
  }

  render() {
    const {introDone, loggedIn} = this.state;
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {introDone ? (loggedIn ? <AppNavigator/> : <Welcome/>) : <IntroScreen onDone={this.saveAndChangeintroDone}/>}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
