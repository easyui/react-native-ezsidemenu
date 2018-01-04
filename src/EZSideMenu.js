/**
 * react-native-ezsidemenu
 * @author Zhu Yangjun<zhuyangjun@gmail.com>
 * @url https://github.com/easyui/react-native-ezsidemenu
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableWithoutFeedback,
    Animated,
    Easing,
    StyleSheet,
    Dimensions,
    PanResponder,
    ViewPropTypes
} from 'react-native'

const direction = {
    Left: 'left',
    Right: 'right',
};

const type = {
    Default: 'default',
    Overlay: 'overlay',
    Slide: 'slide'
  };

const DEVICE_SCREEN = Dimensions.get('window');

export default class EZSideMenu extends Component<{}> {
    static direction = direction
    static type = type

    /**
    | -------------------------------------------------------
    | EZSideMenu component life
    | -------------------------------------------------------
    */
    static propTypes = {
        ...ViewPropTypes,
        menu: PropTypes.object.isRequired,
        shadowStyle: View.propTypes.style,
        menuStyle: View.propTypes.style,
        direction: PropTypes.oneOf(Object.values(direction)),
        type: PropTypes.oneOf(Object.values(type)),
        position: PropTypes.object,
        width: PropTypes.number,
        animationFunction: PropTypes.func,

        panGestureEnabled: PropTypes.bool,
        panWidthFromEdge: PropTypes.number,
        panTolerance: PropTypes.object,

        onPanStartMove: PropTypes.func,
        onPanMove: PropTypes.func,
        onPanEndMove: PropTypes.func,
        onSliding: PropTypes.func,
        onMenuStateChaned: PropTypes.func,


    };

    static defaultProps = {
        shadowStyle: { backgroundColor: 'rgba(0,0,0,.4)' },
        menuStyle: {},
        direction: direction.Left,
        type: type.Slide,
        position: new Animated.Value(0),
        width: DEVICE_SCREEN.width * 0.7,
        animationFunction: (prop, value) => Animated.timing(prop, {
            easing: Easing.inOut(Easing.ease),
            duration: 300,
            toValue: value
        }),

        panGestureEnabled: true,
        panWidthFromEdge: 60,
        panTolerance: { x: 6, y: 20 },
    };

    constructor(props) {
        super(props);

        this.open = this._open.bind(this)
        this.close = this._close.bind(this)
        this.events = {
            onPanStartMove: this._onPanStartMove.bind(this),
            onPanMove: this._onPanMove.bind(this),
            onPanEndMove: this._onPanEndMove.bind(this),
            onSliding: this._onSliding.bind(this),
            onMenuStateChaned: this._onMenuStateChaned.bind(this),
        }
        this.panGestures = {
            panResponder: PanResponder,
            initSeekPanResponder: this._initSeekPanResponder.bind(this),
            handleonStartShouldSetPanResponder: this._handleonStartShouldSetPanResponder.bind(this),
            handleonStartShouldSetPanResponderCapture: this._handleonStartShouldSetPanResponderCapture.bind(this),
            handleonMoveShouldSetPanResponder: this._handleonMoveShouldSetPanResponder.bind(this),
            handleonMoveShouldSetPanResponderCapture: this._handleonMoveShouldSetPanResponderCapture.bind(this),
            handleonPanResponderTerminationRequest: this._handleonPanResponderTerminationRequest.bind(this),
            handleonPanResponderGrant: this._handleonPanResponderGrant.bind(this),
            handleonPanResponderMove: this._handleonPanResponderMove.bind(this),
            handleonPanResponderRelease: this._handleonPanResponderEnd.bind(this),
            handleonPanResponderTerminate: this._handleonPanResponderEnd.bind(this),
        }

        this.isPan = false

        const position = props.position;
        this.state = {
            position,
            isOpen: false,
            isMoving: false
        };
        position.addListener(this.events.onSliding);

  
        this.childrenLeft = this.props.direction === EZSideMenu.direction.Left ?
            position.interpolate({
                inputRange: [0, DEVICE_SCREEN.width],
                outputRange: [0,DEVICE_SCREEN.width],
            }) :
            position.interpolate({
                inputRange: [0, DEVICE_SCREEN.width],
                outputRange: [0,-DEVICE_SCREEN.width],
            });

        this.nemuLeft = this.props.direction === EZSideMenu.direction.Left ?
            position.interpolate({
                inputRange: [0, this.props.width],
                outputRange: [-this.props.width, 0],
            }) :
            position.interpolate({
                inputRange: [0, this.props.width],
                outputRange: [DEVICE_SCREEN.width, DEVICE_SCREEN.width - this.props.width],
            });

        this.shadowOpacity = position.interpolate({
                inputRange: [0, this.props.width],
                outputRange: [0, 1],
            })
    }

    componentWillMount() {
        this.panGestures.initSeekPanResponder()
    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillUpdate(newProps, newState) {
        if (newState.isOpen !== this.state.isOpen) {
            this.events.onMenuStateChaned(newState.isOpen)
        }
    }

    /**
    | -------------------------------------------------------
    | public api
    | -------------------------------------------------------
    */
    _close() {
        this.setState({ isMoving: true });
        this.props
            .animationFunction(this.state.position, 0)
            .start(
            () => {
                if (!this.isPan) {
                    this.setState({ isOpen: false, isMoving: false });
                }
            }
            );
    };

    _open() {
        this.setState({ isMoving: true });
        this.props
            .animationFunction(this.state.position, this.props.width)
            .start(
            () => {
                if (!this.isPan) {
                    this.setState({ isOpen: true, isMoving: false });
                }
            }
            );
    };

    /**
    | -------------------------------------------------------
    | private api
    | -------------------------------------------------------
    */


    /**
    | -------------------------------------------------------
    |  events
    | -------------------------------------------------------
    */
    _onPanStartMove(){
        if (typeof this.props.onPanStartMove === 'function') {
            this.props.onPanStartMove(...arguments);
        }
    }

    _onPanMove(x) {
        if (typeof this.props.onPanMove === 'function') {
            this.props.onPanMove(...arguments);
        }
    }

    _onPanEndMove(){
        if (typeof this.props.onPanEndMove === 'function') {
            this.props.onPanEndMove(...arguments);
        }
    }

    _onSliding(e) {

        const val = e.value / this.props.width;

        if (typeof this.props.onSliding === 'function') {
            this.props.onSliding(e.value, val);
        }
    };

    _onMenuStateChaned(isOpen) {
        if (typeof this.props.onMenuStateChaned === 'function') {
            this.props.onMenuStateChaned(...arguments);
        }
    }
    /**
    | -------------------------------------------------------
    | PanResponder 
    | -------------------------------------------------------
    */
    _initSeekPanResponder() {
        this.panGestures.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.panGestures.handleonStartShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: this.panGestures.handleonStartShouldSetPanResponderCapture,
            onMoveShouldSetPanResponder: this.panGestures.handleonMoveShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: this.panGestures.handleonMoveShouldSetPanResponderCapture,
            onPanResponderTerminationRequest: this.panGestures.handleonPanResponderTerminationRequest,
            onPanResponderGrant: this.panGestures.handleonPanResponderGrant,
            onPanResponderMove: this.panGestures.handleonPanResponderMove,
            onPanResponderRelease: this.panGestures.handleonPanResponderRelease,
            onPanResponderTerminate: this.panGestures.handleonPanResponderTerminate,
        });
    };

    _handleonStartShouldSetPanResponder(evt, gestureState) {
        this.isVerticalMoved = false
        return false
    };

    _handleonStartShouldSetPanResponderCapture(evt, gestureState) {
        return false
    };

    _handleonMoveShouldSetPanResponder(evt, gestureState) {
        if (!this.props.panGestureEnabled || this.isVerticalMoved || this.state.isMoving) {
            return false;
        }

        const x = Math.round(Math.abs(gestureState.dx));
        const y = Math.round(Math.abs(gestureState.dy));
        const isHorizontalMoved = x > this.props.panTolerance.x && y < this.props.panTolerance.y;
        this.isVerticalMoved = x < this.props.panTolerance.x && y > this.props.panTolerance.y; //如果是竖向划动后就不会在走横向逻辑了

        if (!isHorizontalMoved) {
            return false;
        }

        const offset = this.props.panWidthFromEdge;
        const direction = this.props.direction;
        const isOpen = this.state.isOpen;

        let shoudMove = false
        if (isOpen) {
            if (direction === EZSideMenu.direction.Left) {
                shoudMove = gestureState.dx < 0
            } else {
                shoudMove = gestureState.dx > 0
            }
        } else {
            if (direction === EZSideMenu.direction.Left) {
                shoudMove = gestureState.moveX <= offset && gestureState.dx > 0
            } else {
                shoudMove = (DEVICE_SCREEN.width - gestureState.moveX <= offset) && gestureState.dx < 0
            }
        }
        if (shoudMove) {
            this.isPan = true
            this.setState({ isMoving: true });
        }
        return shoudMove
    };

    _handleonMoveShouldSetPanResponderCapture(evt, gestureState) {
        return false
    };

    _handleonPanResponderTerminationRequest(evt, gestureState) {
        return true
    };

    _handleonPanResponderGrant(evt, gestureState) {
        this.events.onPanStartMove()
        this.state.position.setOffset(this.state.position._value);
        this.state.position.setValue(0);
    };

    _handleonPanResponderMove(evt, gestureState) {
        const { dx } = gestureState;
        const position = this.props.direction === EZSideMenu.direction.Left ? dx : -dx;

        const x = Math.max(Math.min(position, this.props.width - this.state.position._offset),this.state.isOpen ? - this.props.width :0 );
        if (x !== this.state.position._value) {
            this.state.position.setValue(x);
            this.events.onPanMove(x)
        }
    };

    _handleonPanResponderEnd(evt, gestureState) {
        this.isPan = false
        this.events.onPanEndMove()

        this.state.position.flattenOffset();
        const velocity = this.props.direction === EZSideMenu.direction.Left ? gestureState.vx : -gestureState.vx;
        const percent = this.state.position._value / this.props.width;
        //速度优先判断，然后是距离
        if (velocity > 0.5) {
            this.open();
        } else if (velocity < -0.5) {
            this.close();
        } else if (percent > 0.5) {
            this.open();
        } else {
            this.close();
        }
    };

    /**
    | -------------------------------------------------------
    | Render
    | -------------------------------------------------------
    */
    render() {
        const { isOpen, position } = this.state;
        const { type, direction, width, shadowStyle, menuStyle, children, menu, style } = this.props;

        let shadowView = null
        if (this.state.isMoving || this.state.isOpen) {
            shadowView = (<TouchableWithoutFeedback onPress={this.close}>
                <Animated.View style={[absoluteStyle, {opacity: this.shadowOpacity }, shadowStyle]}>
                    <View style={{ width: width }}>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>)
        }
        let view 
        if (type === EZSideMenu.type.Default) {
            view =  <View style={[styles.container, style]} {...this.panGestures.panResponder.panHandlers}>
            <View style={[absoluteStyle, { [direction === EZSideMenu.direction.Left ? 'right': 'left'] : DEVICE_SCREEN.width - width},menuStyle]}>
            {menu}
            </View>
            <Animated.View style={[absoluteStyle, { left: this.childrenLeft, width: DEVICE_SCREEN.width }]}>
            {children}
            {shadowView}
            </Animated.View>
        </View>
        } else if(type ===  EZSideMenu.type.Overlay){
            view =  <View style={[styles.container, style]} {...this.panGestures.panResponder.panHandlers}>
            {children}
            {shadowView}
            <Animated.View style={[absoluteStyle, { left: this.nemuLeft, width: width }, menuStyle]}>
            {menu}
            </Animated.View>
        </View>
        }else{
            view =  <View style={[styles.container, style]} {...this.panGestures.panResponder.panHandlers}>
            <Animated.View style={[absoluteStyle, { left: this.nemuLeft, width: width }, menuStyle]}>
            {menu}
            </Animated.View>
            <Animated.View style={[absoluteStyle, { left: this.childrenLeft, width: DEVICE_SCREEN.width }]}>
            {children}
            {shadowView}
            </Animated.View>
            </View>
        }

        return (
        view
        );
    }
}


const absoluteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    menuStyle: {
        ...absoluteStyle,
    },
    shadow: {
        ...absoluteStyle,
    }
});


