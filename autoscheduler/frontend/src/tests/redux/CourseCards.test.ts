import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { createStore, applyMiddleware } from 'redux';
import { waitFor } from '@testing-library/react';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import {
  parseSectionSelected, clearCourseCards, replaceCourseCards, addCourseCard,
  updateCourseCard, removeCourseCard,
} from '../../redux/actions/courseCards';
import testFetch from '../testData';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Grades from '../../types/Grades';
import {
  CustomizationLevel, CourseCardArray, SerializedCourseCardOptions, SectionFilter,
} from '../../types/CourseCardOptions';

// The input from the backend use snake_case, so disable camelcase errors for this file
/* eslint-disable @typescript-eslint/camelcase */
describe('Course Cards Redux', () => {
  test('Initial state has one empty course card', () => {
    // arrange
    const store = createStore(autoSchedulerReducer);

    // asssert
    expect(store.getState().courseCards).toMatchObject({
      0: {
        course: '',
        customizationLevel: CustomizationLevel.BASIC,
        remote: 'no_preference',
        honors: 'exclude',
        asynchronous: 'no_preference',
        sections: [],
      },
      numCardsCreated: 1,
    });
  });

  describe('parseSections', () => {
    describe('parses correctly', () => {
      test('on a normal input', () => {
        // arrange
        const grades = {
          gpa: 4.0, A: 1, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, U: 0, Q: 0, X: 0, count: 0,
        };

        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          honors: false,
          remote: false,
          asynchronous: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
          grades,
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          honors: false,
          remote: false,
          asynchronous: false,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: new Grades(grades),
          instructionalMethod: InstructionalMethod.NONE,
        });

        const meetings = [new Meeting({
          id: 11,
          building: '',
          meetingDays: [true, false, false, false, false, false, false],
          startTimeHours: 8,
          startTimeMinutes: 0,
          endTimeHours: 8,
          endTimeMinutes: 50,
          meetingType: MeetingType.LEC,
          section,
        })];
        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });

      test('with null maxCredits', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          honors: false,
          remote: false,
          asynchronous: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: null,
          currentEnrollment: 0,
          maxEnrollment: 1,
          honors: false,
          remote: false,
          asynchronous: false,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null,
          instructionalMethod: InstructionalMethod.NONE,
        });

        const meetings = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 8,
            startTimeMinutes: 0,
            endTimeHours: 8,
            endTimeMinutes: 50,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });
    });

    describe('sets start/end time to 00:00', () => {
      test('when start/end time are null', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          honors: false,
          remote: false,
          asynchronous: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              type: 'LEC',
            },
          ],
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          honors: false,
          remote: false,
          asynchronous: false,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null,
          instructionalMethod: InstructionalMethod.NONE,
        });

        const meetings = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 0,
            startTimeMinutes: 0,
            endTimeHours: 0,
            endTimeMinutes: 0,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });
    });

    describe('Grades is null', () => {
      test('When its given as null', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          honors: false,
          remote: false,
          asynchronous: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
          grades: null as any,
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null as any,
          honors: false,
          remote: false,
          asynchronous: false,
          instructionalMethod: InstructionalMethod.NONE,
        });

        const meetings = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 8,
            startTimeMinutes: 0,
            endTimeHours: 8,
            endTimeMinutes: 50,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });
    });
    describe('sorts meetings', () => {
      test('when the meetings are out of order', () => {
        // arrange
        const genericMeetingInput = {
          days: [true, false, false, false, false, false, false],
          start_time: '8:00',
          end_time: '8:50',
        };
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          honors: false,
          remote: false,
          asynchronous: false,
          meetings: [
            {
              ...genericMeetingInput,
              id: 13,
              type: 'EXAM',
            },
            {
              ...genericMeetingInput,
              id: 12,
              type: 'LAB',
            },
            {
              ...genericMeetingInput,
              id: 11,
              type: 'LEC',
            },
          ],
          grades: null as any,
        }];
        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null as any,
          honors: false,
          remote: false,
          asynchronous: false,
          instructionalMethod: InstructionalMethod.NONE,
        });
        const genericMeetingOutput = {
          building: '',
          meetingDays: [true, false, false, false, false, false, false],
          startTimeHours: 8,
          startTimeMinutes: 0,
          endTimeHours: 8,
          endTimeMinutes: 50,
          section,
        };
        const meetings = [
          new Meeting({
            ...genericMeetingOutput,
            id: 11,
            meetingType: MeetingType.LEC,
          }),
          new Meeting({
            ...genericMeetingOutput,
            id: 12,
            meetingType: MeetingType.LAB,
          }),
          new Meeting({
            ...genericMeetingOutput,
            id: 13,
            meetingType: MeetingType.EXAM,
          }),
        ];
        const expected = [{ section, meetings, selected: false }];
        // act
        const output = parseSectionSelected(input);
        // assert
        expect(output).toEqual(expected);
      });
    });
  });
  describe('clearCourseCards', () => {
    test('resets course cards to initial state', () => {
      // arrange
      const expected: CourseCardArray = {
        numCardsCreated: 1,
        0: {
          course: '',
          customizationLevel: CustomizationLevel.BASIC,
          remote: SectionFilter.NO_PREFERENCE,
          honors: SectionFilter.EXCLUDE,
          asynchronous: SectionFilter.NO_PREFERENCE,
          sections: [],
        },
      };
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      // add another course card, should be removed by clearCourseCards()
      store.dispatch(addCourseCard({}));

      // act
      store.dispatch(clearCourseCards());

      // assert
      expect(store.getState().courseCards).toMatchObject(expected);
    });
  });

  describe('replaceCourseCards', () => {
    test('replaces all course cards and keeps all properties not related to sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const expectedCourseCards: CourseCardArray = {
        0: {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          remote: SectionFilter.NO_PREFERENCE,
          honors: SectionFilter.EXCLUDE,
          asynchronous: SectionFilter.NO_PREFERENCE,
        },
        numCardsCreated: 1,
      };
      const courseCards = [
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          remote: SectionFilter.NO_PREFERENCE,
          honors: SectionFilter.EXCLUDE,
          asynchronous: SectionFilter.NO_PREFERENCE,
        },
      ];
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      expect(store.getState().courseCards).toMatchObject(expectedCourseCards);
    });

    test('adds new sections for course cards', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const courseCards: SerializedCourseCardOptions[] = [
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
        },
      ];
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      // testFetch with a MATH course has 1 section, which should be added
      expect(store.getState().courseCards[0].sections).toHaveLength(1);
    });

    test('keeps selected sections from courseCards', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      // section is the id of the section returned by testFetch, should be checked
      const section = 830262;
      fetchMock.mockImplementationOnce(testFetch);

      const courseCards: SerializedCourseCardOptions[] = [
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          sections: [section],
        },
      ];

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      // testFetch with a MATH course has 1 section
      expect(store.getState().courseCards[0].sections[0].selected).toBeTruthy();
    });

    test('maintains card order when fetches finish out of order', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      // wait for second course card to be created to add the first one
      fetchMock.mockImplementationOnce(async (course: string) => {
        await waitFor(() => store.getState().courseCards[1]);
        return testFetch(course);
      });
      fetchMock.mockImplementationOnce(testFetch);

      const courseCards: SerializedCourseCardOptions[] = [
        {
          course: 'CSCE 121',
          customizationLevel: CustomizationLevel.BASIC,
        },
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
        },
      ];

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);
      // have to await again for waitFor to finish
      await new Promise(setImmediate);

      // assert
      expect(store.getState().courseCards.numCardsCreated).toEqual(2);
      expect(store.getState().courseCards[0].course).toEqual('CSCE 121');
      expect(store.getState().courseCards[1].course).toEqual('MATH 151');
    });
  });

  describe('addCourseCard', () => {
    test('Adds an empty course card', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addCourseCard());

      // assert
      expect(store.getState().courseCards.numCardsCreated).toEqual(2);
      expect(store.getState().courseCards[1]).not.toBeUndefined();
    });

    test('collapses other cards and expands the new one', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      // precondition: initial course card is expanded
      expect(store.getState().courseCards[0].collapsed).toBe(false);
      store.dispatch(addCourseCard());

      // assert
      expect(store.getState().courseCards[0].collapsed).toBe(true);
      expect(store.getState().courseCards[1].collapsed).toBe(false);
    });
  });

  describe('removeCourseCard', () => {
    test('Removes a course card', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addCourseCard());
      store.dispatch(addCourseCard());
      store.dispatch(removeCourseCard(1));

      // assert
      expect(store.getState().courseCards.numCardsCreated).toEqual(3);
      expect(store.getState().courseCards[1]).toBeUndefined();
      expect(store.getState().courseCards[2]).not.toBeUndefined();
    });

    describe('when deleting the expanded card', () => {
      test('expands the one after if it exists', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

        // act
        store.dispatch(addCourseCard());
        store.dispatch(addCourseCard());
        store.dispatch<any>(updateCourseCard(1, { collapsed: false }));
        store.dispatch(removeCourseCard(1));

        // assert
        expect(store.getState().courseCards.numCardsCreated).toEqual(3);
        expect(store.getState().courseCards[0].collapsed).toBe(false);
        expect(store.getState().courseCards[1]).toBeUndefined();
        expect(store.getState().courseCards[2].collapsed).toBe(true);
      });

      test("expands the one above if there isn't one below it", () => {
        // arrange
        const store = createStore(autoSchedulerReducer);

        // act
        store.dispatch(addCourseCard());
        store.dispatch(removeCourseCard(1));

        // assert
        expect(store.getState().courseCards.numCardsCreated).toEqual(2);
        expect(store.getState().courseCards[0].collapsed).toBe(false);
        expect(store.getState().courseCards[1]).toBeUndefined();
      });

      test('leaves no cards if no other ones exist', () => {
        // arrange
        const store = createStore(autoSchedulerReducer);

        // act
        store.dispatch(removeCourseCard(0));

        // assert
        expect(store.getState().courseCards.numCardsCreated).toEqual(1);
        expect(store.getState().courseCards[0]).toBeUndefined();
      });
    });
  });

  describe('updateCourseCard', () => {
    test('Updates course card string field', () => {
      // arrange
      fetchMock.mockOnce('[]');
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // act
      store.dispatch<any>(updateCourseCard(0, { course: 'PSYC 107' }, '201931'));

      // assert
      expect(store.getState().courseCards[0].course).toEqual('PSYC 107');
    });

    test('Updates course card basic filter options', () => {
      // arrange
      fetchMock.mockOnce('[]');
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // act
      store.dispatch<any>(updateCourseCard(0, { remote: 'exclude' }));
      store.dispatch<any>(updateCourseCard(0, { honors: 'only' }));
      store.dispatch<any>(updateCourseCard(0, { asynchronous: 'exclude' }));

      // assert
      expect(store.getState().courseCards[0].remote).toBe('exclude');
      expect(store.getState().courseCards[0].honors).toBe('only');
      expect(store.getState().courseCards[0].asynchronous).toBe('exclude');
    });

    test('collapses other cards and expands the provided one when given collapsed: false', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(addCourseCard());

      // act
      // precondition: second course card should be expanded
      expect(store.getState().courseCards[1].collapsed).toBe(false);

      store.dispatch<any>(updateCourseCard(0, { collapsed: false }, '201931'));

      // assert
      expect(store.getState().courseCards[0].collapsed).toBe(false);
      expect(store.getState().courseCards[1].collapsed).toBe(true);
    });
  });
});
