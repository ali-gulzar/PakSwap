import React, { Component } from 'react'
import { Animated, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Card, Badge, Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import LottieView from "lottie-react-native";

import * as firebase from 'firebase';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";

const { width, height } = Dimensions.get('window');

export default class Explore extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      searchFocus: new Animated.Value(0.6),
      searchString: null,
      category: "",
      searchDone: false,
      data: [],
    }

  }

  componentWillMount () {
    const {navigation, categories} = this.props;
    const category = navigation.getParam('category');
    this.setState({category, categories })
    this.getData(category)
  }

  getData = async(category) => {
    await firebase.database().ref(category).on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({searchDone: true, data: Object.values(snapshot.val())})
      } else {this.setState({searchDone: true})}
    })
  }

  handleSearchFocus(status) {
    Animated.timing(
      this.state.searchFocus,
      {
        toValue: status ? 0.8 : 0.6, // status === true, increase flex size
        duration: 150, // ms
      }
    ).start();
  }

  renderSearch() {
    const { searchString, searchFocus } = this.state;
    const isEditing = searchFocus && searchString;

    return (
      <Block animated middle flex={searchFocus} style={styles.search}>
        <Input
          placeholder="Search"
          placeholderTextColor={theme.colors.gray2}
          style={styles.searchInput}
          onFocus={() => this.handleSearchFocus(true)}
          onBlur={() => this.handleSearchFocus(false)}
          onChangeText={text => this.setState({ searchString: text })}
          value={searchString}
          onRightPress={() => isEditing ? this.setState({ searchString: null }) : null}
          rightStyle={styles.searchRight}
          rightLabel={
            <FontAwesome
              name={isEditing ? "close" : "search"}
              size={theme.sizes.base / 1.6}
              color={theme.colors.gray2}
              style={styles.searchIcon}
            />
          }
        />
      </Block>
    )
  }

  renderExplore() {
    const { navigation } = this.props;
    const {data, category} = this.state;

    if(!data.length) {
      return(
        <LottieView
          autoPlay
          loop
          source={require('../assets/animations/empty.json')}
          style={{flex:4}}
        />
      )
    }

    return (
      <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2}}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate("Product", {product: data[index]})}
              >
                <Card center middle shadow style={styles.category}>
                  <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                    <Image source={{uri: item.imageURL}} style={{width: 50, height: 50, borderRadius: 25}}/> 
                  </Badge>
                  <Text medium height={20}>{item.itemName}</Text>
                  <Text gray caption>{item.location}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
      </ScrollView>
    )
  }

  renderFooter() {
    return (
      <LinearGradient
        locations={[0.5, 1]}
        style={styles.footer}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)']}
      >
        <Button gradient style={{ width: width / 2.678 }}>
          <Text bold white center>Filter</Text>
        </Button>
      </LinearGradient>
    )
  }

  renderLoader = () => {
    return(
      <ScrollView showsVerticalScrollIndicator={false} style={styles.explore}>
      <Placeholder Animation={Fade} Left={PlaceholderMedia} style={styles.placeholder}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
      <Placeholder Animation={Fade} Right={PlaceholderMedia} style={styles.placeholder}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
      <Placeholder Animation={Fade} Left={PlaceholderMedia} style={styles.placeholder}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
      </ScrollView>
    )
  }

  render() {

    const {category, searchDone} = this.state;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>{category}</Text>
          {this.renderSearch()}
        </Block>
        {searchDone? this.renderExplore() : this.renderLoader()}    
      </Block>
    )
  }
}

Explore.defaultProps = {
  images: mocks.explore,
  profile: mocks.profile,
  categories: mocks.categories,
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 2,
    paddingTop: theme.sizes.base
  },
  search: {
    height: theme.sizes.base * 2,
    width: width - theme.sizes.base * 2,
  },
  searchInput: {
    fontSize: theme.sizes.caption,
    height: theme.sizes.base * 2,
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.06)',
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: 'transparent'
  },
  searchIcon: {
    position: 'absolute',
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base / 1.6,
  },
  explore: {
    marginHorizontal: theme.sizes.padding * 1.25,
  },
  image: {
    minHeight: 100,
    maxHeight: 130,
    maxWidth: width - (theme.sizes.padding * 2.5),
    marginBottom: theme.sizes.base,
    borderRadius: 4,
  },
  mainImage: {
    minWidth: width - (theme.sizes.padding * 2.5),
    minHeight: width - (theme.sizes.padding * 2.5),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.1,
    width,
    paddingBottom: theme.sizes.base * 4,
  },
  placeholder: {
    marginBottom: 20
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  }
})
