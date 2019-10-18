import React, { Component } from 'react'
import { Animated, Modal, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Button, Block, Text } from '../../components';
import { theme } from '../../constants';
import Colors from '../../constants/Colors';

class Welcome extends Component {

  static navigationOptions = {
    header: null,
    headerBackImage: <Image source={require('../../assets/icons/back.png')} />
};

  scrollX = new Animated.Value(0);

  state = {
    showTerms: false,
  }

  renderTermsService() {
    return (
      <Modal animationType="slide" visible={this.state.showTerms} onRequestClose={() => this.setState({ showTerms: false })}>
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]} space="between">
          <Text h2 light>Terms of Service</Text>

          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              1. First version of this app may include bugs. 
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              2. This app requires you to provide your phone number for registration.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              3. You understand that PakSwap uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              4. You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service, PakSwap, or any other PakSwap service. 
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              5. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by PakSwap.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              6. We may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              7. Verbal, physical, written or other abuse (including threats of abuse or retribution) of any PakSwap customer, employee, member, or officer will result in immediate account termination.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              8. You understand that the technical processing and transmission of the Service, including your Content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </Text>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              9. You must not upload, post, host, or transmit unsolicited e-mail, SMSs, or "spam" messages.
            </Text>
          </ScrollView>

          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button gradient onPress={() => this.setState({ showTerms: false })}>
              <Text center white>I understand</Text>
            </Button>
          </Block>
        </Block>
      </Modal>
    )
  }

  renderIllustrations() {
    return (
      <FontAwesome
          style={{ backgroundColor: 'transparent' }}
          name='exchange'
          size={200}
          color={Colors.primary}
      />
    )
  }
  
  render() {
    const { navigation } = this.props;
    return (
      <Block>
        <Block center bottom flex={0.4}>
            <Text h1 center bold primary>
              PAK
              <Text h1 > Swap</Text>
            </Text>
            <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
              Exchange greener.
            </Text>
        </Block>
        <Block center middle>
          {this.renderIllustrations()}
        </Block>
        <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2]}>
          <Button gradient onPress={() => navigation.navigate('Login')}>
            <Text center semibold white>Login | SignUp</Text>
          </Button>
          <Button onPress={() => this.setState({ showTerms: true })}>
            <Text center caption gray style={{paddingBottom: 50}}>Terms of service</Text>
          </Button>
        </Block>
        {this.renderTermsService()}
      </Block>
    )
  }
}

export default Welcome;
