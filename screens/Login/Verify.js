import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';

import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';
import Toast from 'react-native-root-toast';
import * as firebase from 'firebase';

var generate = require('project-name-generator');

const VALID_CODE = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/

export default class Verify extends Component {

  static navigationOptions = {
    header: null,
    headerBackImage: <Image source={require('../../assets/icons/back.png')} />
  };

  constructor(props) {
    super(props)

    this.state = {
      code: "",
      errors: [],
      loading: false,
    }

    this.handleVerify = this.handleVerify.bind(this);
    this._confirmCode = this._confirmCode.bind(this);
    this.makeUserData = this.makeUserData.bind(this);
  }

  handleVerify = () => {
    const { navigation } = this.props;
    const { code } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (code === '') {
      errors.push('code');
      this.setState({ errors, loading: false });
    }

    if (!errors.length) {
      this._confirmCode(code);
    } else {
      this.setState({loading: false})
    }
  }

  _confirmCode = (code) => {
    const {navigation} = this.props;
    const confirmation = navigation.getParam('confirmation', '');
    confirmation.confirm(code)
    .then(async(result) => {
      await this.makeUserData();
      this.setState({loading: false})
      navigation.navigate('Browse')
      Toast.show('Logged in successfully', {
        duration: 1000,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: theme.colors.primary,
        paddingTop: 20,
    });
    })
    .catch((err) => {
      this.setState({loading: false})
      Alert.alert(
        'Error',
        'Please enter a valid code.',
        [
          { text: 'Try again', }
        ],
        { cancelable: false }
      )
    });
  }

  makeUserData = () => {
    if (firebase.auth().currentUser) {
      const user = firebase.auth().currentUser;
      if (user) {
        firebase.database().ref('users/').child(user.uid).once('value', function(snapshot) {
          var exists = (snapshot.val() !== null);
          if (!exists) {
            firebase.database().ref('users/' + user.uid).set({
              phoneNumber: user.phoneNumber,
              name: generate().spaced,
              items: 0
            })
          }
        })
      }
    }
  }

  sendMessage = () => {
    Toast.show('Will be released in the next version. You can try from the start again. Sorry for the inconvenience.', {
      duration: 1000,
      position: 50,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: theme.colors.primary,
      paddingTop: 20,
  });
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.forgot} behavior="padding">
        <Block style={{marginTop: 20}} padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Verify Phone Number</Text>
          <Block middle>
            <Input
              label="Verification code"
              error={hasErrors('code')}
              style={[styles.input, hasErrors('code')]}
              defaultValue={this.state.code}
              onChangeText={text => this.setState({ code: text })}
              keyboardType="number-pad"
            />
            <Button gradient onPress={() => this.handleVerify()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Login</Text>
              }
            </Button>
            <Button onPress={() => this.sendMessage()}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Resend verification code
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  forgot: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})