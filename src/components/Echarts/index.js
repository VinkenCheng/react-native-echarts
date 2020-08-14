import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import renderChart from './renderChart';
import echarts from './echarts.min';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.setNewOption = this.setNewOption.bind(this);
  }

  // 预防过渡渲染
  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {}
    nextProps = nextProps || {}
    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
      return true
    }
    for (const key in nextProps) {
      if (JSON.stringify(thisProps[key]) != JSON.stringify(nextProps[key])) {
        return true
      }
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.option !== this.props.option) {
      // this.refs.chart.reload();
      this.refs.chart.injectJavaScript(renderChart(nextProps))
    }
  }

  setNewOption(option) {
    this.refs.chart.postMessage(JSON.stringify(option));
  }

  render() {
    return (
      <View style={{ flex: 1, height: this.props.height || 400, }}>
        <WebView
          ref="chart"
          useWebKit={true}
          scrollEnabled={false}
          injectedJavaScript={renderChart(this.props)}
          style={{
            height: this.props.height || 400,
            backgroundColor: this.props.backgroundColor || 'transparent'
          }}
          scalesPageToFit={Platform.OS !== 'ios'}
          originWhitelist={['*']}
          source={Platform.OS === 'ios' ? require('./tpl.html') : { uri: 'file:///android_asset/tpl.html' }}
          onMessage={event => this.props.onPress ? this.props.onPress(JSON.parse(event.nativeEvent.data)) : null}
        />
      </View>
    );
  }
}
