# react-native-ezsidemenu


[![NPM version][npm-image]][npm-url]
[![release](https://img.shields.io/github/release/easyui/react-native-ezsidemenu.svg?style=flat-square)](https://github.com/easyui/react-native-ezsidemenu/releases)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/joeferraro/react-native-ezsidemenu/master/LICENSE.md)

简单易用的，支持侧滑和自定义的react native菜单组件。 支持iOS和android。


## 安装

```
$ npm install react-native-ezsidemenu --save
```

## 预览

### default 类型
![defaultIos](defaultIos.gif)  ![defaultAndroid](defaultAndroid.gif)

### overlay 类型
![overlayIos](overlayIos.gif)  ![overlayAndroid](overlayAndroid.gif)

### slide 类型
![slideIos](slideIos.gif)  ![slideAndroid](slideAndroid.gif)

## 使用

引入组件：

```js
import EZSideMenu from 'react-native-ezsidemenu';
```

### 简单使用

```js
//App.js
simpleMenu() {
    return <EZSideMenu
      menu={this.menu()}
      ref="menu">
      {this.contentView()}
    </EZSideMenu>
  }
```

### 高级使用

```js
//App.js
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
      type={EZSideMenu.type.Default}
      menuStyle={styles.container}
      shadowStyle={{ backgroundColor: 'rgba(20,20,20,.7)' }}
      direction={EZSideMenu.direction.Right}
      ref="menu"
      position={this.state.animation}
      width={menuWidth}
      menu={this.menu(opacity)}
      animationFunction={(prop, value) => Animated.spring(prop, {
        friction: 10,
        toValue: value
      })}>
      {this.contentView()}
    </EZSideMenu>
  }
```

## API

### 属性

| key | type | default | description |                 
| --- | --- | --- | --- |
| menu | PropTypes.object.isRequired |  | 菜单组件 |
| shadowStyle | View.propTypes.style | { backgroundColor: 'rgba(0,0,0,.4)' } |  菜单旁的样式|
| menuStyle | View.propTypes.style | {} | 菜单组件样式  |
| direction | PropTypes.string | direction.Left | 菜单方向 |
| type | PropTypes.string | type.Default | 菜单划动动画效果 |
| position | PropTypes.object | new Animated.Value(0) | 菜单滑出位置|
| width | PropTypes.number | DEVICE_SCREEN.width * 0.7 | 菜单宽度 |
| animationFunction | PropTypes.func | animationFunction: (prop, value) => Animated.timing(prop, { <br /> easing: Easing.inOut(Easing.ease), <br /> duration: 300, <br /> toValue: value <br /> }), | 菜单划动动画 |
| panGestureEnabled | PropTypes.bool | true | 菜单是否支持手势划动 |
| panWidthFromEdge | PropTypes.number | 60 | 菜单划开有效距离 |
| panTolerance | PropTypes.object | { x: 6, y: 20 } |  菜单划动容错范围 |
| onPanStartMove | PropTypes.func | | 菜单开始划动回调 |
| onPanMove | PropTypes.func | | 菜单划动中回调|
| onPanEndMove | PropTypes.func | | 菜单结束划动回调 |
| onSliding | PropTypes.func | | 菜单动画回调 | 
| onMenuStateChaned | PropTypes.func | | 菜单状态改变回调 |
       

### 方法
| function | description |                    
| --- | --- | 
| open() | 打开菜单 |
| close() | 关闭菜单 |


## License
[MIT License](http://opensource.org/licenses/mit-license.html). © Zhu Yangjun 2017


[npm-image]: https://img.shields.io/npm/v/react-native-ezsidemenu.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-native-ezsidemenu
[travis-image]: https://img.shields.io/travis/yorkie/react-native-ezsidemenu.svg?style=flat-square
[travis-url]: https://travis-ci.org/yorkie/react-native-ezsidemenu
[david-image]: http://img.shields.io/david/yorkie/react-native-ezsidemenu.svg?style=flat-square
[david-url]: https://david-dm.org/yorkie/react-native-ezsidemenu
[downloads-image]: http://img.shields.io/npm/dm/react-native-ezsidemenu.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/react-native-ezsidemenu
[React Native]: https://github.com/facebook/react-native
[react-native-cn]: https://github.com/reactnativecn
[react-native-ezsidemenu]: https://github.com/easyui/react-native-ezsidemenu
[Linking Libraries iOS Guidance]: https://developer.apple.com/library/ios/recipes/xcode_help-project_editor/Articles/AddingaLibrarytoaTarget.html


