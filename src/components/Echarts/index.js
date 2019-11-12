import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';
import getTpl from "./tpl";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.setNewOption = this.setNewOption.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option) {
      // this.refs.chart.reload();
      if (Platform.OS === 'android') {
        this.refs.chart.reload();
      } else {
        this.setNewOption(nextProps.option);
      }
    }
  }
  shouldComponentUpdate() {
    return false;
  }

  setNewOption(option) {
    this.refs.chart.postMessage(JSON.stringify(option));
  }

  _handleMessage = (event) => {
    event.persist();
    if (!event) return;

    const data = JSON.parse(event.nativeEvent.data);
    this.props.onPress(data);
    // switch (data.types) {
    //   case 'click':
    //     this.props.onPress(data)
    //     break;
    //   default:
    //     break;
    // }
  };
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
          originWhitelist={['*']}
          source={Platform.OS === "ios" ? { html: getTpl() } : { uri: 'file:///android_asset/tpl.html' }}
          onMessage={this._handleMessage}
        />
      </View>
    );
  }
}
