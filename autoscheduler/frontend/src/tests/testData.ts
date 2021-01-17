/* eslint-disable @typescript-eslint/camelcase */

import { GenerateSchedulesResponse } from '../types/APIResponses';
import { InstructionalMethod } from '../types/Section';

/**
 * Mocks the fetch call made to the API to retrieve all sections of a given course. Should return
 * 3 sections with 5 meetings total for CSCE classes and 1 section with 1 meeting total for MATH
 * classes. The term is required but doesn't affect outcome
 * @param route the normal API route to fetch sections/meetings
 */
export default async function testFetch(route: string): Promise<Response> {
  const [, subject, course_num] = /\/api\/sections\?dept=(.+)&course_num=(.+)&term=.+/.exec(route);
  const testSection1 = {
    id: 123456,
    crn: 123456,
    subject,
    course_num,
    section_num: '501',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 25,
    honors: false,
    remote: false,
    asynchronous: false,
    instructor_name: 'Aakash Tyagi',
    instructional_method: InstructionalMethod.F2F,
  };
  const testSection2 = {
    id: 123458,
    crn: 123459,
    subject,
    course_num,
    section_num: '502',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 25,
    max_enrollment: 25,
    honors: false,
    remote: false,
    asynchronous: false,
    instructor_name: 'Aakash Tyagi',
    instructional_method: InstructionalMethod.NONE,
  };
  const testSection3 = {
    id: 123457,
    crn: 123457,
    subject,
    course_num,
    section_num: '503',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 26,
    max_enrollment: 25,
    honors: false,
    remote: false,
    asynchronous: false,
    instructor_name: 'Somebody Else',
    instructional_method: InstructionalMethod.NONE,
  };
  const testSection4 = {
    id: 830262,
    crn: 67890,
    subject,
    course_num,
    section_num: '201',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: true,
    remote: false,
    asynchronous: false,
    instructor_name: 'Dr. Pepper',
    instructional_method: InstructionalMethod.NONE,
  };
  // for asynchronous testing
  const testSection5 = {
    id: 810262,
    crn: 65890,
    subject,
    course_num,
    section_num: '301',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: false,
    remote: false,
    asynchronous: true,
    instructor_name: 'Coca Cola',
    instructional_method: InstructionalMethod.NONE,
  };

  // test that different sections do different things
  if (subject === 'MATH') {
    return new Response(JSON.stringify([{
      ...testSection4,
      meetings: [{
        id: 87328,
        building: 'BLOC',
        days: [false, true, false, true, false, true, false],
        start: '09:10',
        end: '10:00',
        type: 'LEC',
        section: null,
      }],
    }]));
  }

  // for asynchronous testing
  if (subject === 'ENGR') {
    return new Response(JSON.stringify([{
      ...testSection5,
      meetings: [{
        id: 81328,
        building: 'ZACH',
        days: [false, true, false, true, false, true, false],
        start: '09:10',
        end: '10:00',
        type: 'LEC',
        section: null,
      }],
    }]));
  }

  // test that placeholder is shown if there are no sections
  if (subject === 'BIOL') {
    return new Response('[]');
  }

  return new Response(JSON.stringify([
    {
      ...testSection1,
      meetings: [{
        id: 12345,
        building: 'HRBB',
        days: [true, false, true, false, true, false, false],
        start: '08:00',
        end: '08:50',
        type: 'LEC',
      },
      {
        id: 12346,
        building: 'ZACH',
        days: [false, true, false, false, false, false, false],
        start: '11:10',
        end: '12:25',
        type: 'LAB',
      }],
    },
    {
      ...testSection2,
      meetings: [
        {
          id: 12347,
          building: 'HRBB',
          days: [true, false, true, false, true, false, false],
          start: '08:00',
          end: '08:50',
          type: 'LEC',
        },
        {
          id: 12348,
          building: 'ZACH',
          days: [false, false, true, false, false, false, false],
          start: '12:45',
          end: '14:00',
          type: 'LAB',
        },
      ],
    },
    {
      ...testSection3,
      meetings: [{
        id: 12347,
        building: 'ZACH',
        days: [true, false, true, false, true, false, false],
        start: '11:10',
        end: '12:25',
        type: 'LEC',
      }],
    },
  ]));
}

export async function mockFetchSchedulerGenerate(): Promise<Response> {
  const testSection1 = {
    id: 123456,
    crn: 123456,
    subject: 'DEPT',
    course_num: '123',
    section_num: '200',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    instructor_name: 'Aakash Tyagi',
    meetings: [{
      id: 1234560,
      building: 'HRBB',
      days: [true, false, true, false, true, false, false], // MWF
      start: '08:00',
      end: '08:50',
      type: 'LEC',
    }],
    honors: false,
    remote: false,
    asynchronous: false,
  };

  // common values for testSection2 & 3
  const csce121 = {
    subject: 'CSCE',
    course_num: '121',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    instructor_name: 'Aakash Tyagi',
    honors: false,
    remote: false,
    asynchronous: false,
  };

  const testSection2 = {
    ...csce121,
    section_num: '501',
    id: 123458,
    crn: 123458,
    meetings: [
      {
        id: 1234580,
        building: 'HRBB',
        days: [false, true, false, true, false, false, false], // TR
        start: '08:00',
        end: '08:50',
        type: 'LEC',
      },
    ],
  };
  const testSection3 = {
    ...csce121,
    section_num: '200',
    id: 123457,
    crn: 123457,
    meetings: [{
      id: 1234570,
      building: 'ZACH',
      days: [false, true, false, true, false, false, false], // TR
      start: '11:10',
      end: '12:25',
      type: 'LAB',
    }],
  };

  const response: GenerateSchedulesResponse = {
    schedules: [
      [testSection1, testSection2],
      [testSection1, testSection3],
    ],
    message: '',
  };
  return new Response(JSON.stringify(response));
}

export async function mockGetSavedSchedules(): Promise<Response> {
  const testSection4 = {
    id: 830262,
    crn: 67890,
    subject: 'MATH',
    course_num: '151',
    section_num: '201',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: true,
    remote: false,
    asynchronous: false,
    instructor_name: 'Dr. Pepper',
    meetings: [{
      id: 87328,
      building: 'BLOC',
      days: [false, true, false, true, false, true, false],
      start_time: '09:10',
      end_time: '10:00',
      type: 'LEC',
    }],
  };

  const ret = [{
    name: 'Schedule 1',
    sections: [testSection4],
  }];

  return new Response(JSON.stringify(ret));
}
