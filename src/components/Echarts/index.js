import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import renderChart from './renderChart';
import echarts from './echarts.min';

export default class App extends Component {
  constructor(props) {
    super(props);
    chart: WebView;
    this.setNewOption = this.setNewOption.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.option) !== JSON.stringify(this.props.option)) {
      // if (Platform.OS === 'android') {
      //   this.chart.reload();
      // } else {
        // 解决数据改变时页面闪烁的问题
        this.setNewOption(nextProps.option);
      // }
    }
  }

  // 预防过渡渲染
  shouldComponentUpdate(nextProps, nextState) {
    // const thisProps = this.props || {}
    // nextProps = nextProps || {}
    // if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
    //   return true
    // }
    // for (const key in nextProps) {
    //   if (JSON.stringify(thisProps[key]) != JSON.stringify(nextProps[key])) {
    //     return true
    //   }
    // }
    return false
  }

  setNewOption(option) {
    this.chart.postMessage(JSON.stringify(option));
  }

  render() {
    return (
      <View style={{ flex: 1, height: this.props.height || 400 }}>
        <WebView
          ref={w => this.chart = w}
          scrollEnabled={false}
          injectedJavaScript={renderChart(this.props)}
          style={{
            height: this.props.height || 400,
            backgroundColor: this.props.backgroundColor || 'transparent'
          }}
          // scalesPageToFit={Platform.OS !== 'ios'}
          originWhitelist={['*']}
          source={Platform.OS === 'ios' ? require('./tpl.html') : { uri: 'file:///android_asset/tpl.html' }}
          onMessage={event => this.props.onPress ? this.props.onPress(JSON.parse(event.nativeEvent.data)) : null}
        />
      </View>
    );
  }
}
