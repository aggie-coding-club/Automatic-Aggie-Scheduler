import { createStore } from 'redux';
import fetchMock from 'jest-fetch-mock';
import autoSchedulerReducer from '../../redux/reducer';
import { addMeeting, removeMeeting, replaceMeetings } from '../../redux/actions/meetings';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';

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

const testMeeting1 = new Meeting({
  id: 12345,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSection,
});

const testMeeting2 = new Meeting({
  id: 123456,
  building: 'ZACH',
  meetingDays: [false, false, true, false, true, false, false],
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSection,
});

const testMeeting3 = new Meeting({
  id: 234561,
  building: 'ETB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 11,
  startTimeMinutes: 30,
  endTimeHours: 12,
  endTimeMinutes: 20,
  meetingType: MeetingType.LAB,
  section: testSection,
});

beforeAll(() => fetchMock.enableMocks());

test('Initial state has empty meetings', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // assert
  expect(store.getState().meetings).toHaveLength(0);
});

test('Adds meeting to store', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));

  // assert
  expect(store.getState().meetings).toHaveLength(1);
});

test('Removes meeting from store', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));
  store.dispatch(removeMeeting(testMeeting1));

  // assert
  expect(store.getState().meetings).toHaveLength(0);
});

test('Replaces single meeting', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));
  store.dispatch(replaceMeetings([testMeeting2]));

  // assert
  expect(store.getState().meetings).toEqual([testMeeting2]);
});

test('Replaces multiple meetings', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));
  store.dispatch(addMeeting(testMeeting2));
  store.dispatch(replaceMeetings([testMeeting2, testMeeting3]));

  // assert
  expect(store.getState().meetings).toEqual([testMeeting2, testMeeting3]);
});
