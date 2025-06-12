// store/eventsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Event = {
  date: number;
  title: string;
  note: string;
  startTime: string;
  endTime: string;
  notification: string;
};

type EventsState = {
  events: Event[];
};

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<Event>) {
      state.events.push(action.payload);
    },
  },
});

export const {addEvent} = eventsSlice.actions;
export default eventsSlice.reducer;
