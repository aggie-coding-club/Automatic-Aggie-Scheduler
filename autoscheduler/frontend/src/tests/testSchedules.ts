import Section, { InstructionalMethod } from '../types/Section';
import Instructor from '../types/Instructor';
import Meeting, { MeetingType } from '../types/Meeting';

export const DAYS_MWF = [true, false, true, false, true, false, false];
export const DAYS_TR = [false, true, false, true, false, false, false];

const testSection1 = new Section({
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
});

const testSection2 = new Section({
  id: 654321,
  crn: 654321,
  subject: 'DEPT',
  courseNum: '123',
  sectionNum: '524',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 67,
  maxEnrollment: 67,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({
    name: 'James Pennington',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testSection3 = new Section({
  id: 654631,
  crn: 473748,
  subject: 'BIOL',
  courseNum: '319',
  sectionNum: '205',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 24,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({
    name: 'William Cohn',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting = new Meeting({
  id: 123456,
  building: 'HRBB',
  meetingDays: DAYS_TR,
  startTimeHours: 19,
  startTimeMinutes: 30,
  endTimeHours: 22,
  endTimeMinutes: 0,
  meetingType: MeetingType.EXAM,
  section: testSection1,
});

const testMeeting2 = new Meeting({
  id: 222222,
  building: 'ZACH',
  meetingDays: DAYS_TR,
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSection1,
});

const testMeeting3 = new Meeting({
  id: 238732,
  building: 'ZACH',
  meetingDays: DAYS_MWF,
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 8,
  endTimeMinutes: 50,
  meetingType: MeetingType.LEC,
  section: testSection2,
});

const testMeeting4 = new Meeting({
  id: 384723,
  building: 'HELD',
  meetingDays: DAYS_TR,
  startTimeHours: 11,
  startTimeMinutes: 10,
  endTimeHours: 12,
  endTimeMinutes: 25,
  meetingType: MeetingType.LEC,
  section: testSection3,
});

const testSectionA = new Section({
  id: 656565,
  crn: 656565,
  subject: 'BIOL',
  courseNum: '351',
  sectionNum: '200',
  minCredits: 4,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 1,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Deborah Seagle' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting5 = new Meeting({
  id: 555555,
  building: 'BSBE',
  meetingDays: DAYS_MWF,
  startTimeHours: 9,
  startTimeMinutes: 10,
  endTimeHours: 10,
  endTimeMinutes: 0,
  meetingType: MeetingType.LEC,
  section: testSectionA,
});
const testMeeting6 = new Meeting({
  id: 666666,
  building: 'BSBE',
  meetingDays: DAYS_TR,
  startTimeHours: 12,
  startTimeMinutes: 0,
  endTimeHours: 14,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSectionA,
});

const testSectionB = new Section({
  id: 660066,
  crn: 660066,
  subject: 'POLS',
  courseNum: '207',
  sectionNum: '511',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Donald Trump' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting7 = new Meeting({
  id: 777777,
  building: 'BLOC',
  meetingDays: DAYS_MWF,
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSectionB,
});

const testSectionC = new Section({
  id: 670067,
  crn: 670067,
  subject: 'PSYC',
  courseNum: '107',
  sectionNum: '514',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Harley Quinn' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting8 = new Meeting({
  id: 888888,
  building: 'PSYC',
  meetingDays: DAYS_MWF,
  startTimeHours: 11,
  startTimeMinutes: 30,
  endTimeHours: 12,
  endTimeMinutes: 20,
  meetingType: MeetingType.LEC,
  section: testSectionC,
});

const testSectionD = new Section({
  id: 680068,
  crn: 680068,
  subject: 'JAPN',
  courseNum: '201',
  sectionNum: '502',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Naruto Uchiha' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting9 = new Meeting({
  id: 999999,
  building: 'JAPN',
  meetingDays: DAYS_MWF,
  startTimeHours: 12,
  startTimeMinutes: 40,
  endTimeHours: 13,
  endTimeMinutes: 30,
  meetingType: MeetingType.LEC,
  section: testSectionD,
});

const testSectionE = new Section({
  id: 690069,
  crn: 690069,
  subject: 'CSCE',
  courseNum: '314',
  sectionNum: '501',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Shawn Lupoli' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting10 = new Meeting({
  id: 101010,
  building: 'LAAH',
  meetingDays: DAYS_TR,
  startTimeHours: 12,
  startTimeMinutes: 45,
  endTimeHours: 14,
  endTimeMinutes: 0,
  meetingType: MeetingType.LEC,
  section: testSectionE,
});

const testSectionF = new Section({
  id: 700070,
  crn: 700070,
  subject: 'PHYS',
  courseNum: '218',
  sectionNum: '513',
  minCredits: 4,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Albert Einstein' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting11 = new Meeting({
  id: 110011,
  building: 'MPHY',
  meetingDays: DAYS_MWF,
  startTimeHours: 13,
  startTimeMinutes: 50,
  endTimeHours: 14,
  endTimeMinutes: 40,
  meetingType: MeetingType.LEC,
  section: testSectionF,
});

const testSectionG = new Section({
  id: 710071,
  crn: 710071,
  subject: 'THAR',
  courseNum: '201',
  sectionNum: '544',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Leonardo DiCaprio' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting12 = new Meeting({
  id: 121212,
  building: 'MPHY',
  meetingDays: DAYS_MWF,
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 15,
  endTimeMinutes: 50,
  meetingType: MeetingType.LEC,
  section: testSectionG,
});

const testSectionH = new Section({
  id: 720072,
  crn: 720072,
  subject: 'FILM',
  courseNum: '251',
  sectionNum: '527',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Morgan Freeman' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting13 = new Meeting({
  id: 131313,
  building: 'MPHY',
  meetingDays: DAYS_MWF,
  startTimeHours: 16,
  startTimeMinutes: 10,
  endTimeHours: 17,
  endTimeMinutes: 0,
  meetingType: MeetingType.LEC,
  section: testSectionH,
});

export const testSchedule1 = [testMeeting, testMeeting2, testMeeting3, testMeeting4];
export const testSchedule2 = [testMeeting, testMeeting2, testMeeting5, testMeeting6];
export const testSchedule3 = [
  testMeeting, testMeeting2, testMeeting3, testMeeting7, testMeeting8,
  testMeeting9, testMeeting10, testMeeting11, testMeeting12, testMeeting13,
];
