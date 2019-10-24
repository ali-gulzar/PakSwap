import React, { Component } from 'react';
import { Dimensions, Image, FlatList, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';

import { Button, Block, Text } from '../components';
import { theme } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as firebase from 'firebase';
import Toast from 'react-native-root-toast';
const { width, height } = Dimensions.get('window');

class Product extends Component {

  constructor(props) {
    super(props)

    this.state = {
      product: {},
      loading: false
    }

  }


  async componentWillMount() {

    const {navigation} = this.props;
    let product = navigation.getParam("product");
    this.setState({product});
  }

  renderGallery() {
    const { product } = this.state;
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        data={[product.imageURL]}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item}) => (
          <Image
            source={{uri: item}}
            resizeMode="contain"
            style={{ width, height: height / 2.8 }}
          />
        )}
      />
    );
  }

  renderFooter(user) {

    const {loading} = this.props;

    return (
      <LinearGradient
        locations={[0.5, 1]}
        style={styles.footer}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)']}
      >
        <Button gradient style={{ width: width / 2.678 }} onPress={() => this.contactSeller(user)}>
          {loading ? <ActivityIndicator/> : <Text bold white center>Contact Seller</Text>}
        </Button>
      </LinearGradient>
    )
  }

  contactSeller = (number) => {
    this.setState({loading: true})
    const contacting = `sms:${number}`
    Linking.canOpenURL(contacting).then(supported => {
      if(supported){
          Linking.openURL(contacting);
      } else {
        Toast.show(`Can not contact seller on number ${number}`, {
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
    })
  }

  render() {
    const { product } = this.state;

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 15}}>
        {this.renderGallery()}

        <Block style={styles.product}>
          <Text h1 bold>{product.itemName}</Text>
          <Block flex={false} row margin={[theme.sizes.base, 0, 0, 0]}>
          <Text caption gray style={styles.tag}>
              {`Price: ${product.price}`}
          </Text>
          <Text caption gray style={styles.tag}>
              {`Location: ${product.location}`}
          </Text>
          </Block>
          <Block flex={false} row margin={[theme.sizes.base/2, 0]}>
          <Text caption gray style={styles.tag}>
                {`Item Condition: ${product.itemCondition}`}
          </Text>
          </Block>

          <Block margin={[theme.sizes.base/2, 0]} >
            <Text h2 light style={{marginBottom: 10}}>Product Description</Text>
            <Text gray light height={22}>{product.description}</Text> 
          </Block>
        </Block>

        <Block center space="between">
          {this.renderFooter(product.phoneNumber)}
        </Block>
        
      </ScrollView>
    )
  }
}

Product.defaultProps = {
  // product: mocks.products[0],
}

export default Product;

const styles = StyleSheet.create({
  product: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingVertical: theme.sizes.padding,
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
  },
  image: {
    width: width / 3.26,
    height: width / 3.26,
    marginRight: theme.sizes.base,
  },
  more: {
    width: 55,
    height: 55,
  }
})
