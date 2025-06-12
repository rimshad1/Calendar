import LottieView from 'lottie-react-native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar App</Text>
      <LottieView
        source={require('./assets/calendar.json')} // path to your JSON
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  text: {fontSize: 24, color: 'white', fontWeight: 'bold'},
  animation: {
    width: 200,
    height: 200,
  },
});
