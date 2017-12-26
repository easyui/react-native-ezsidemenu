/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

/*
*/
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  WebView,
  Linking,
  Dimensions
} from 'react-native';
import EZSideMenu from './EZSideMenu'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const DEVICE_SCREEN = Dimensions.get('window');

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      animation: new Animated.Value(0)
    }

    this.toggle = this._toggle.bind(this)
  }

  _toggle() {
    if (this.refs.menu) {
      this.state.isOpen ? this.refs.menu.close() : this.refs.menu.open()
    }
  }

  contentView() {
    return <View style={styles.container}>
      <View style={{ flexDirection: 'row', paddingTop: 33, backgroundColor: 'gray' }}>
        <TouchableOpacity
          onPress={this.toggle}
          style={styles.button}
        >
          <Image
            source={require(`./resource/leftMenu.png`)}
            style={styles.button}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity
          onPress={this.toggle}
          style={styles.button}
        >
          <Image
            source={require(`./resource/rightMenu.png`)}
            style={styles.button}
          />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', backgroundColor: 'white' }}>
        <Text>{`isOpen: ${this.state.isOpen}`}</Text>
      </View>
      <ScrollView style={[styles.scrollView]} contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.welcome}>
          Welcome to React Native!
 </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
 </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        {
          (new Array(10).fill(1)).map((item, index) => {
            return <View key={index}>
              <Text style={styles.welcome}>
                Welcome to React Native!
            </Text>
              <Text style={styles.instructions}>
                To get started, edit App.js
          </Text>
              <Text style={styles.instructions}>
                {instructions}
              </Text>
            </View>
          })
        }
      </ScrollView>
    </View>
  }

  menu(opacity) {
    const menu = (
      <Animated.View style={{ flex: 1, backgroundColor: 'transparent', opacity }}>
        <WebView
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{ uri: 'https://www.taobao.com/' }}
          scalesPageToFit
          renderError={(e) => {
            if (e === 'WebKitErrorDomain') {
              return null
            }
          }}
          onShouldStartLoadWithRequest={(event) => {
            if (event.url.startsWith('http://') || event.url.startsWith('https://')) {
              return true;
            } else {
              Linking.canOpenURL(event.url)
                .then(supported => {
                  if (supported) {
                    return Linking.openURL(url);
                  } else {
                    return false;
                  }
                }).catch(err => {
                  return false;
                })
            }
          }}
        />
      </Animated.View>
    );
    return menu
  }

  simpleMenu() {
    return <EZSideMenu
      menu={this.menu()}
      ref="menu">
      {this.contentView()}
    </EZSideMenu>
  }

  advancedMenu() {
    const menuWidth = DEVICE_SCREEN.width * 0.8;
    const opacity = this.state.animation.interpolate({
      inputRange: [0, menuWidth],
      outputRange: [0, 1],
    });
    return <EZSideMenu
      onMenuStateChaned={(isOpen) => { this.setState({ isOpen }) }}
      onPanMove={(x) => { console.log('onPanMove ' + x) }}
      onSliding={(x, persent) => { console.log('onSliding x ' + x + ' persent ' + persent) }}

      menuStyle={styles.container}
      shadowStyle={{ backgroundColor: 'rgba(20,20,20,.7)' }}
      direction={EZSideMenu.direction.Right}
      ref="menu"
      left={this.state.animation}
      width={menuWidth}
      menu={this.menu(opacity)}
      animationFunction={(prop, value) => Animated.spring(prop, {
        friction: 10,
        toValue: value
      })}>
      {this.contentView()}
    </EZSideMenu>
  }

  render() {
    // return this.simpleMenu()
    return this.advancedMenu()
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  button: {
    width: 44,
    height: 44
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
