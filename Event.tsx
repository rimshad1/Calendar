import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addEvent} from './store/eventsSlice';
import {RootState} from './store';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  date: number;
  onBack: () => void;
};

const mergeDateAndTime = (date: number, time: Date): Date => {
  const eventDate = new Date(date);
  const newDate = new Date(eventDate);

  newDate.setHours(time.getHours());
  newDate.setMinutes(time.getMinutes());
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

const EventScreen = ({date, onBack}: Props) => {
  const events = useSelector((state: RootState) => state.events);
  const existingEvent = events.events.find(event => event.date === date);

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [note, setNote] = useState(existingEvent?.note || '');
  const [startTime, setStartTime] = useState<Date | null>(
    existingEvent?.startTime ? new Date(existingEvent.startTime) : null,
  );
  const [endTime, setEndTime] = useState<Date | null>(
    existingEvent?.endTime ? new Date(existingEvent.endTime) : null,
  );
  const [notification, setNotification] = useState(
    existingEvent?.notification || '',
  );
  const [customDate, setCustomDate] = useState<Date | null>(
    existingEvent?.notification &&
      !['15m', '1h', '1d'].includes(existingEvent.notification)
      ? new Date(existingEvent.notification)
      : null,
  );

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const dispatch = useDispatch();

  const isValid =
    title.trim() !== '' &&
    startTime !== null &&
    endTime !== null &&
    startTime < endTime && 
    (notification !== '' || customDate !== null);

  const handleSave = () => {
    if (!isValid) return;
    const event = {
      date,
      title,
      note,
      startTime: startTime?.toISOString() || '',
      endTime: endTime?.toISOString() || '',
      notification: customDate ? customDate.toISOString() : notification,
    };
    dispatch(addEvent(event));
    console.log('Event Saved:', event);
    onBack();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.arrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          Date: {date}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={setTitle}
          value={title}
        />

        <TouchableOpacity
          onPress={() => setShowStartTimePicker(true)}
          style={styles.timePicker}>
          <Text style={styles.timePickerText}>
            {startTime
              ? startTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : 'Select Start Time'}
          </Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(Platform.OS === 'ios');
              if (selectedTime) {
                const mergedDate = mergeDateAndTime(date, selectedTime);
                setStartTime(mergedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => setShowEndTimePicker(true)}
          style={styles.timePicker}>
          <Text style={styles.timePickerText}>
            {endTime
              ? endTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : 'Select End Time'}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(Platform.OS === 'ios');
              if (selectedTime) {
                const mergedDate = mergeDateAndTime(date, selectedTime);
                setEndTime(mergedDate);
              }
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Note"
          onChangeText={setNote}
          value={note}
        />

        <Text style={{fontWeight: 'bold', marginTop: 10}}>Notify Before:</Text>

        <View style={styles.optionsContainer}>
          {['15m', '1h', '1d'].map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setNotification(option);
                setCustomDate(null);
              }}
              style={[
                styles.optionButton,
                notification === option && styles.optionButtonSelected,
              ]}>
              <Text
                style={{
                  color: notification === option ? '#fff' : '#000',
                }}>
                {option === '15m'
                  ? '15 mins'
                  : option === '1h'
                  ? '1 hour'
                  : '1 day'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, !isValid && {backgroundColor: '#ccc'}]}
          disabled={!isValid}>
          <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {padding: 20, gap: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 12,
    borderRadius: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#000',
    paddingHorizontal: 20
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: '#007bff',
  },
  saveBtn: {
    paddingVertical: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 8,
  },
  timePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  timePickerText: {
    color: '#000',
  },
});
