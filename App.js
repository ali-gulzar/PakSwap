import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation';

import IntroScreen from './screens/IntroScreen';
import Navigation from './screens/Login';

import * as firebase from 'firebase';

// console.disableYellowBox = true;

const firebaseConfig = {
  apiKey: "AIzaSyBMemWFNuj0NSFs2HDz8p6_2Pnv6LALlMk",
  authDomain: "pakswap-2f7ae.firebaseapp.com",
  databaseURL: "https://pakswap-2f7ae.firebaseio.com",
  projectId: "pakswap-2f7ae",
  storageBucket: "pakswap-2f7ae.appspot.com",
  messagingSenderId: "168408814405",
  appId: "1:168408814405:web:ef42f0b02e6a1f8e96e42c",
  measurementId: "G-VGPPY21ZJ0"
};

export default class App extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      isLoadingComplete: false,
      introDone: false,
      loggedIn: true,
    }

    this.loadResourcesAsync = this.loadResourcesAsync.bind(this);
    this._retrieveAsyncStorageData = this._retrieveAsyncStorageData.bind(this);
    this.handleLoadingError = this.handleLoadingError.bind(this);
    this.handleFinishLoading = this.handleFinishLoading.bind(this);
    this.saveAndChangeintroDone = this.saveAndChangeintroDone.bind(this);
    this.intializeFirebase = this.intializeFirebase.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  async loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        ...Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      })
    ]).then((values) => {
      this._retrieveAsyncStorageData();
      this.intializeFirebase();
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

  intializeFirebase = () => {
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig)
    } else {
      firebase.app();
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({loggedIn: true})
      } else {
        this.setState({loggedIn: false})
      }
   });
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

  logOut = () => {
    this.setState({loggedIn: false})
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
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          {introDone ? (loggedIn ? <AppNavigator logout={this.logOut}/> : <Navigation/>) : <IntroScreen onDone={this.saveAndChangeintroDone}/>}
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
