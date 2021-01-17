import { Matcher, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import MeetingCard from '../../components/SchedulingPage/Schedule/MeetingCard/MeetingCard';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import autoSchedulerReducer from '../../redux/reducer';

const testSection = new Section({
  id: 123456,
  crn: 123456,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '200',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 0,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting = new Meeting({
  id: 12345,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 18,
  endTimeMinutes: 50,
  meetingType: MeetingType.LEC,
  section: testSection,
});

function ignoreInvisible(query: string | RegExp): Matcher {
  return (content: string, element: HTMLElement): boolean => {
    if (element.style.display === 'none') return false;
    return content.match(query) && content.match(query).length > 0;
  };
}

let store: Store = null;

beforeAll(() => { store = createStore(autoSchedulerReducer); });

describe('Meeting Card', () => {
  describe('displays subject, course number, and meeting type', () => {
    test('when given meeting and color as props', () => {
      const { container, getByText } = render(
        <Provider store={store}>
          <MeetingCard
            meeting={testMeeting}
            bgColor="#500000"
            firstHour={8}
            lastHour={21}
          />
        </Provider>,
      );
      expect(container).toBeTruthy();
      expect(getByText(/CSCE/)).toBeTruthy();
      expect(getByText(/121/)).toBeTruthy();
      expect(getByText(ignoreInvisible(/LEC/i))).toBeTruthy();
    });
  });
});
