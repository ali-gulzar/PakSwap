import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Image, Modal, Alert } from 'react-native'
import {WebView} from 'react-native-webview';
import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';
import url from 'url';
import * as firebase from 'firebase';
import PhoneInput from 'react-native-phone-input'

const VALID_PHONENUMBER = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/

const captchaUrl = `https://ali-gulzar.github.io/HostRecaptcha/`

export default class LoginScreen extends Component {

  static navigationOptions = {
    headerStyle: {
    height: 16 * 4,
    backgroundColor: theme.colors.white, // or 'white
    borderBottomColor: "transparent",
    elevation: 0, // for android
    },
    headerBackImage: <Image source={require('../../assets/icons/back.png')} />,
    headerBackTitle: null,
    headerLeftContainerStyle: {
    alignItems: 'center',
    marginLeft: 16 * 2,
    paddingRight: 16,
    },
    headerRightContainerStyle: {
    alignItems: 'center',
    paddingRight: 16,
    },
  };

  constructor(props) {
    super(props)
    this.state = {
      phonenumber: "",
      errors: [],
      loading: false,
      phoneInputEditable: true,
      showModal: false,
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.renderCaptchaView = this.renderCaptchaView.bind(this);
    this._sendConfirmationCode = this._sendConfirmationCode.bind(this);

  }
  
  handleLogin = () => {
    var { phonenumber } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    const validPhoneNumber = `+92${phonenumber}`
    
    // check with backend API or with some static data
    if (!VALID_PHONENUMBER.test(validPhoneNumber)) {
      errors.push('phonenumber');
      this.setState({ errors, loading: false});
    }

    if (!errors.length) {
      this.setState({showModal: true})
    } else {
      Alert.alert(
        'Error',
        'Please enter a valid Pakistan phone number.',
        [
          { text: 'Try again', }
        ],
        { cancelable: false }
      )
    }
  }

  _handleResponse = data => {
    let query = url.parse(data.url, true).query;

    if (query.hasOwnProperty('token')) {
      this._sendConfirmationCode(query.token);
    } else if (query.hasOwnProperty('cancel')) {
      this.setState({ showModal: false });
    }
  }

  _sendConfirmationCode = (captchaToken) => {
    this.setState({ showModal: false });
    let number = `+92${this.state.phonenumber}`;
    const captchaVerifier = {
      type: 'recaptcha',
      verify: () => Promise.resolve(captchaToken)
    }
    const { navigation } = this.props;
    firebase.auth().signInWithPhoneNumber(number, captchaVerifier)
    .then((confirmation) => {
      this.setState({loading: false})
      navigation.navigate('Verify', {confirmation})
    })
    .catch((err) => {
      this.setState({loading: false})
      Alert.alert(
        'Error',
        'Verification failed for this number. Please try again later.',
        [
          { text: 'Try again', }
        ],
        { cancelable: false }
      )
    });
  }

  renderCaptchaView = () => {
    return (
      <Modal animationType="slide" visible={this.state.showModal} onRequestClose={() => this.setState({ showModal: false })}>
          <WebView
            source={{ uri: captchaUrl }}
            onNavigationStateChange={data =>
              this._handleResponse(data)
            }
            injectedJavaScript={`document.f1.submit()`}
          />
      </Modal>
    )
  }

  render() {
    const { loading, errors, phoneInputEditable } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Login</Text>
          <Block middle>
            <PhoneInput ref='phone' initialCountry="pk" value="+92" disabled={true}/>
            <Input
              label="Phone Number"
              error={hasErrors('phonenumber')}
              style={[styles.input, hasErrors('phonenumber')]}
              defaultValue={this.state.phonenumber}
              onChangeText={text => this.setState({ phonenumber: text })}
              editable={phoneInputEditable}
              keyboardType="number-pad"
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> : 
                <Text bold white center>Send Verification Code</Text>
              }
            </Button>
          </Block>
        </Block>
        {this.renderCaptchaView()}
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  login: {
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