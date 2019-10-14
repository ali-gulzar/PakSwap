import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
import Color from '../constants/Colors';

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 300,
    height: 300,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
});

const slides = [
  {
    key: 'first',
    title: 'Pakistan First Barter System',
    text:
      'Exchange your old & unused items with other people around Pakistan.',
    icon: 'exchange',
    colors: [Color.primary, Color.secondary],
  },
  {
    key: 'second',
    title: 'Your account ready in two minutes',
    text:
      'Get access to millions of items around Pakistan ready to be exchanged.',
    icon: 'users',
    colors: [Color.primary, Color.secondary],
  },
  {
    key: 'third',
    title: 'Exchange and enjoy',
    text: 'Exchange your old items with your barter friends',
    icon: 'shopping-cart',
    colors: [Color.primary, Color.secondary],
  },
];

export default class IntroScreen extends React.Component {

  constructor (props){
    super(props)

    this._renderItem = this._renderItem.bind(this)
    this._saveStatus = this._saveStatus.bind(this)

  }

  _saveStatus () {
    this.props.onDone();
  }

  _renderItem = ({ item, dimensions }) => (
      <LinearGradient
          style={[
              styles.mainContent,
              dimensions,
          ]}
          colors={item.colors}
          start={{ x: 0, y: 0.1 }}
          end={{ x: 0.1, y: 1 }}
      >
      <FontAwesome
          style={{ backgroundColor: 'transparent' }}
          name={item.icon}
          size={200}
          color="white"
      />
      <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
      </View>
      </LinearGradient>
  );
  render() {
    return <AppIntroSlider slides={slides} renderItem={this._renderItem} showPrevButton showSkipButton onDone={this._saveStatus} />;
  }
    
}
