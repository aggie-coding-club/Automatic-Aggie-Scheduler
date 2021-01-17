import Meeting, { MeetingType } from '../types/Meeting';
import Section, { InstructionalMethod } from '../types/Section';
import Instructor from '../types/Instructor';

export default async function fetch(route: string): Promise<Response> {
  const course = /\/api\/(.+)\/meetings/.exec(route);
  const testSection1 = new Section({
    id: 123456,
    crn: 123456,
    subject: course[1].split('%20')[0],
    courseNum: course[1].split('%20')[1],
    sectionNum: '501',
    minCredits: 0,
    maxCredits: 0,
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
  const testSection2 = new Section({
    id: 123458,
    crn: 123459,
    subject: course[1].split('%20')[0],
    courseNum: course[1].split('%20')[1],
    sectionNum: '502',
    minCredits: 0,
    maxCredits: 0,
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
  const testSection3 = new Section({
    id: 123457,
    crn: 123457,
    subject: course[1].split('%20')[0],
    courseNum: course[1].split('%20')[1],
    sectionNum: '503',
    minCredits: 0,
    maxCredits: 0,
    currentEnrollment: 0,
    maxEnrollment: 0,
    honors: false,
    remote: false,
    asynchronous: false,
    instructor: new Instructor({
      name: 'Somebody Else',
    }),
    grades: null,
    instructionalMethod: InstructionalMethod.NONE,
  });
  const testSection4 = new Section({
    id: 830262,
    crn: 67890,
    subject: course[1].split('%20')[0],
    courseNum: course[1].split('%20')[1],
    sectionNum: '200',
    minCredits: 0,
    maxCredits: 0,
    currentEnrollment: 0,
    maxEnrollment: 0,
    honors: false,
    remote: false,
    asynchronous: false,
    instructor: new Instructor({
      name: 'Dr. Pepper',
    }),
    grades: null,
    instructionalMethod: InstructionalMethod.NONE,
  });

  // test that different sections do different things
  if (course[1] === 'MATH%20151') {
    return new Response(JSON.stringify([
      new Meeting({
        id: 87328,
        building: 'BLOC',
        meetingDays: [false, true, false, true, false, true, false],
        startTimeHours: 9,
        startTimeMinutes: 10,
        endTimeHours: 10,
        endTimeMinutes: 0,
        meetingType: MeetingType.LEC,
        section: testSection4,
      }),
    ]));
  }

  // test empty sections
  if (course[1] === 'BIOL%20100') return new Response(JSON.stringify([]));

  return new Response(JSON.stringify([
    new Meeting({
      id: 12345,
      building: 'HRBB',
      meetingDays: [true, false, true, false, true, false, false],
      startTimeHours: 8,
      startTimeMinutes: 0,
      endTimeHours: 8,
      endTimeMinutes: 50,
      meetingType: MeetingType.LEC,
      section: testSection1,
    }),
    new Meeting({
      id: 12346,
      building: 'ZACH',
      meetingDays: [false, true, false, false, false, false, false],
      startTimeHours: 11,
      startTimeMinutes: 10,
      endTimeHours: 12,
      endTimeMinutes: 25,
      meetingType: MeetingType.LAB,
      section: testSection1,
    }),
    new Meeting({
      id: 12347,
      building: 'HRBB',
      meetingDays: [true, false, true, false, true, false, false],
      startTimeHours: 8,
      startTimeMinutes: 0,
      endTimeHours: 8,
      endTimeMinutes: 50,
      meetingType: MeetingType.LEC,
      section: testSection2,
    }),
    new Meeting({
      id: 12348,
      building: 'ZACH',
      meetingDays: [false, false, true, false, false, false, false],
      startTimeHours: 12,
      startTimeMinutes: 45,
      endTimeHours: 14,
      endTimeMinutes: 0,
      meetingType: MeetingType.LAB,
      section: testSection2,
    }),
    new Meeting({
      id: 12347,
      building: 'ZACH',
      meetingDays: [true, false, true, false, true, false, false],
      startTimeHours: 11,
      startTimeMinutes: 10,
      endTimeHours: 12,
      endTimeMinutes: 25,
      meetingType: MeetingType.LEC,
      section: testSection3,
    }),
  ]));
}
