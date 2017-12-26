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

const positions = {
    Left: 'left',
    Right: 'right',
};

const DEVICE_SCREEN = Dimensions.get('window');

export default class EZSideMenu extends Component<{}> {
    static positions = positions
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
        direction: PropTypes.string,
        left: PropTypes.object,
        width: PropTypes.number,
        animationFunction: PropTypes.func,

        panGestureEnabled: PropTypes.bool,
        panWidthFromEdge: PropTypes.number,
        panTolerance: PropTypes.object,

        onPanMove: PropTypes.func,
        onSliding: PropTypes.func,
        onMenuStateChaned: PropTypes.func,


    };

    static defaultProps = {
        shadowStyle: { backgroundColor: 'rgba(0,0,0,.4)' },
        menuStyle: {},
        direction: positions.Left,
        left: new Animated.Value(0),
        width: DEVICE_SCREEN.width * .66,
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
            onPanMove: this._onPanMove.bind(this),
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
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onResponderTerminationRequest: (event) => { return false }
        }

        this.isPan = false

        const left = props.left;
        this.state = {
            left,
            isOpen: false,
            isMoving: false
        };
        left.addListener(this.events.onSliding);
    }

    componentWillMount() {
        this.panGestures.initSeekPanResponder()
    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {

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
            .animationFunction(this.state.left, 0)
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
            .animationFunction(this.state.left, this.props.width)
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
    _onPanMove(x) {
        if (typeof this.props.onPanMove === 'function') {
            this.props.onPanMove(...arguments);
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
        if (!this.props.panGestureEnabled || this.isVerticalMoved) {
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
            if (direction === positions.Left) {
                shoudMove = gestureState.dx < 0
            } else {
                shoudMove = gestureState.dx > 0
            }
        } else {
            if (direction === positions.Left) {
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
        this.state.left.setOffset(this.state.left._value);
        this.state.left.setValue(0);
    };

    _handleonPanResponderMove(evt, gestureState) {
        const { dx } = gestureState;
        const position = this.props.direction === positions.Left ? dx : -dx;

        const x = Math.min(position, this.props.width - this.state.left._offset);
        if (x !== this.state.left._value) {
            this.state.left.setValue(x);
            this.events.onPanMove(x)
        }
    };

    _handleonPanResponderEnd(evt, gestureState) {
        this.isPan = false

        this.state.left.flattenOffset();
        const velocity = this.props.direction === positions.Left ? gestureState.vx : -gestureState.vx;
        const percent = this.state.left._value / this.props.width;
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
        const { isOpen, left } = this.state;
        const { direction, width, shadowStyle, menuStyle, children, menu, style } = this.props;

        const nemuLeft = direction === positions.Left ?
            left.interpolate({
                inputRange: [0, this.props.width],
                outputRange: [-width, 0],
            }) :
            left.interpolate({
                inputRange: [0, this.props.width],
                outputRange: [DEVICE_SCREEN.width, DEVICE_SCREEN.width - width],
            });

        const opacity = left.interpolate({
            inputRange: [0, this.props.width],
            outputRange: [0, 1],
        });

        let shadowView = null
        if (this.state.isMoving || this.state.isOpen) {
            shadowView = (<TouchableWithoutFeedback onPress={this.close}>
                <Animated.View style={[styles.shadow, { opacity }, shadowStyle, { position: 'absolute' }]}>
                    <View style={{ width: width }}>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>)
        }

        return (
            <View style={[styles.container, style]} {...this.panGestures.panResponder.panHandlers}>
                {children}
                {shadowView}
                <Animated.View style={[styles.menuStyle, { left: nemuLeft, width: width }, menuStyle]}>
                    {menu}
                </Animated.View>
            </View>
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


