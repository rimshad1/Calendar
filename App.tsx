import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import SplashScreen from './Spash';
import Calendar from './Calendar';
import Event from './Event';
import {store} from './store';
import {Provider} from 'react-redux';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('calendar');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const navigateToCalendar = () => setScreen('calendar');
  const navigateToEvent = (date: any) => {
    setSelectedDate(date);
    setScreen('event');
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {screen == 'splash' && <SplashScreen />}
        {screen == 'calendar' && <Calendar onDayPress={navigateToEvent} />}
        {screen == 'event' && selectedDate !== null && (
          <Event date={selectedDate} onBack={navigateToCalendar} />
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
