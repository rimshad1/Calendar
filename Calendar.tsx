import React, {useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from './store';

type Props = {
  onDayPress: (day: number) => void;
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({onDayPress}: Props) => {
  const events = useSelector((state: RootState) => state.events.events);
  const {height, width} = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDay = selectedDate.getDate();
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const holidays: {day: number; type: 'public' | 'bank' | 'mercantile'}[] = [
    {day: 4, type: 'public'},
    {day: 10, type: 'bank'},
    {day: 15, type: 'mercantile'},
    {day: 25, type: 'public'},
    {day: 4, type: 'mercantile'},
    {day: 10, type: 'bank'},
    {day: 25, type: 'mercantile'},
    {day: 15, type: 'public'},
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedYear, selectedMonth + offset, 1);
    setSelectedDate(newDate);
  };

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);


  return (
    <SafeAreaView style={{flex: 1, width: width, height: height}}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Text style={styles.arrow}>◀︎</Text>
          </TouchableOpacity>
          <Text style={styles.header}>
            {selectedDate.toLocaleString('default', {month: 'long'})}{' '}
            {selectedYear}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Text style={styles.arrow}>▶︎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {days.map(day => (
            <Text key={day} style={styles.dayHeader}>
              {day.slice(0, 1)}
            </Text>
          ))}
        </View>

        <View style={styles.row}>
          {[...Array(monthDays)].map((_, i) => {
            const day = i + 1;
            const isToday =
              day === new Date().getDate() &&
              selectedMonth === new Date().getMonth() &&
              selectedYear === new Date().getFullYear();

            const hasEvent = (day: number) =>
              events.some(event => event.date === day);

            const getHolidayTypesForDay = (day: number) => {
              return holidays.filter(h => h.day === day).map(h => h.type);
            };

            const event = events.find(e => e.date === day);
            

            return (
              <TouchableOpacity key={day} onPress={() => onDayPress(day)}>
                <View style={[styles.dayCell, isToday && styles.today]}>
                  <Text style={styles.dayCellText}>{day}</Text>
                  {[...getHolidayTypesForDay(day), hasEvent(day) && 'event']
                    .filter(Boolean)
                    .map((type, index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          type === 'public' && styles.publicHoliday,
                          type === 'bank' && styles.bankHoliday,
                          type === 'mercantile' && styles.mercantileHoliday,
                          {left: index * 8},
                        ]}
                      />
                    ))}
                  {event?.title && (
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.devider} />

        <View style={styles.holidayContainer}>
          <Text style={styles.holidayTitle}>Holidays</Text>
          {[
            {color: 'red', label: 'Public Holiday'},
            {color: 'blue', label: 'Bank Holiday'},
            {color: '#ff00aa', label: 'Mercantile Holiday'},
            {color: '#9300ff40', label: 'Any Event Add'},
          ].map(({color, label}) => (
            <View key={label} style={styles.holidayDetails}>
              <View style={[styles.holidayDot, {backgroundColor: color}]} />
              <Text style={styles.holidayText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  arrow: {
    fontSize: 24,
    color: '#000',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00000099',
  },
  dayCell: {
    width: 50,
    height: 50,
    marginVertical: 10,
    marginHorizontal: Platform.OS === 'ios' ? 5 : 2.5,
    borderRadius: 25,
    paddingTop: 15,
    position: 'relative',
  },
  dayCellText: {
    color: '#000',
    textAlign: 'center',
  },
  today: {
    fontWeight: '900',
    backgroundColor: '#1a1a1a10',
  },
  publicHoliday: {
    backgroundColor: 'red',
  },
  bankHoliday: {
    backgroundColor: 'blue',
  },
  mercantileHoliday: {
    backgroundColor: '#ff00aa',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 7,
    height: 7,
    borderRadius: 50,
  },
  devider: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#1a1a1a30',
    marginTop: 20,
  },
  holidayContainer: {
    alignItems: 'center',
    gap: 20,
    height: 300,
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  holidayTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  holidayDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    width: 150,
  },
  holidayDot: {
    width: 15,
    height: 15,
    borderRadius: 50,
  },
  holidayText: {
    color: '#000',
    fontSize: 14,
  },
  eventTitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#444',
    marginTop: 20,
    paddingVertical: 2,
    backgroundColor: '#9300ff40',
    borderRadius: 2,
  },
});

export default Calendar;
