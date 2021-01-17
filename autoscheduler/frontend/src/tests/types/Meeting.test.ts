import Meeting, { MeetingType } from '../../types/Meeting';
import { Indexable, fetchMock } from '../util';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';

// arrange
const correctArgs: Indexable = {
  id: 123456,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: new Section({
    id: 123456,
    crn: 123456,
    subject: 'SUBJ',
    courseNum: '234',
    sectionNum: '500',
    minCredits: 3,
    maxCredits: null,
    currentEnrollment: 56,
    maxEnrollment: 56,
    honors: false,
    remote: false,
    asynchronous: false,
    instructor: new Instructor({
      name: 'Aakash Tyagi',
    }),
    grades: null,
    instructionalMethod: InstructionalMethod.NONE,
  }),
};
const createMeeting = jest.fn((args) => new Meeting(fetchMock(args)));

test('Meeting accepts correct arguments', () => {
  // act
  createMeeting(correctArgs);

  // assert
  expect(createMeeting).toReturn();
});

const nonNullableArgs = ['id', 'meetingDays', 'startTimeHours', 'startTimeMinutes',
  'endTimeHours', 'endTimeMinutes', 'meetingType', 'section'];
test.each(nonNullableArgs)('Meeting rejects null %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = null;

  // act and assert
  expect(() => createMeeting(badArgs)).toThrow();
});

test.each(Object.keys(correctArgs))('Meeting rejects undefined %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = undefined;

  // act and assert
  expect(() => createMeeting(badArgs)).toThrow();
});

test('Meeting rejects meetingDays of wrong length', () => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs.meetingDays = new Array(14).fill(true);

  // act and assert
  expect(() => createMeeting(badArgs)).toThrow();
});

test('Meeting rejects string id', () => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs.id = '123456';

  // act and assert
  expect(() => createMeeting(badArgs)).toThrow();
});
