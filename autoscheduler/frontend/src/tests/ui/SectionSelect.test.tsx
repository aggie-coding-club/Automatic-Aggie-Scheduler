import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  render, queryByTitle as queryByTitleIn, fireEvent,
} from '@testing-library/react';
import { CourseCardOptions } from '../../types/CourseCardOptions';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import autoSchedulerReducer from '../../redux/reducer';
import setTerm from '../../redux/actions/term';
import { updateCourseCard } from '../../redux/actions/courseCards';
import SectionSelect from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionSelect';

const dummySection: Section = {
  id: 123456,
  crn: 123456,
  sectionNum: '501',
  subject: 'ABCD',
  courseNum: '1234',
  minCredits: 0,
  maxCredits: 0,
  currentEnrollment: 25,
  maxEnrollment: 25,
  remote: false,
  honors: false,
  asynchronous: false,
  instructor: new Instructor({ name: 'Dr. Doofenschmirtz' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
};

const dummyMeeting: Meeting = {
  id: 98765,
  building: 'ACAD',
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 8,
  endTimeMinutes: 50,
  meetingDays: [true, true, true, true, true, true, true],
  meetingType: MeetingType.LEC,
  section: dummySection,
};

/**
 * Helper function that makes a course card. Each argument supplied will be used as the props
 * of a section in the card, and each section will have a single, un-customizaable meeting.
 * Supplying multiple arguments will create multiple sections.
 * @param args properties of the section that matter for this test
 */
function makeCourseCard(...args: any): CourseCardOptions {
  return {
    sections: args.map((props: any) => {
      const section: Section = {
        ...dummySection,
        ...props,
      };
      return {
        section,
        meetings: [{
          ...dummyMeeting,
          section,
        }],
        selected: false,
      };
    }),
  };
}

describe('SectionSelect', () => {
  describe('select all button', () => {
    test('is rendered', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({})));

      // act
      const { getByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      expect(await getByText('SELECT ALL')).toBeInTheDocument();
    });

    describe('is checked', () => {
      test('when all sections are selected manually', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard(
          { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 },
        )));
        const { getByText, getAllByDisplayValue } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        // act
        fireEvent.click(getByText('201'));
        fireEvent.click(getByText('202'));

        // assert
        expect(getAllByDisplayValue('allOn')).toHaveLength(1);
      });
    });

    describe('is unchecked', () => {
      test('by default', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard({})));

        // act
        const { getAllByDisplayValue } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        // assert
        expect(getAllByDisplayValue('allOff')).toHaveLength(1);
      });

      test('when an individual section is unchecked', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard(
          { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 },
        )));
        const { getByText, getAllByDisplayValue } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        // act
        fireEvent.click(getByText('201'));
        fireEvent.click(getByText('202'));
        fireEvent.click(getByText('201'));

        // assert
        expect(getAllByDisplayValue('allOff')).toHaveLength(1);
      });
    });

    test('selects all sections when clicked', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard(
        { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 }, { sectionNum: '203', id: 123458 },
      )));
      const { getByText, getAllByDisplayValue } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // act
      fireEvent.click(getByText('201'));
      fireEvent.click(getByText('201'));
      fireEvent.click(getByText('202'));
      fireEvent.click(getByText('SELECT ALL'));

      // assert
      expect(getAllByDisplayValue('on')).toHaveLength(3);
      expect(getAllByDisplayValue('allOn')).toHaveLength(1);
    });

    test('unselects all sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard(
        { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 }, { sectionNum: '203', id: 123458 },
      )));
      const { getByText, getAllByDisplayValue } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // act
      fireEvent.click(getByText('201'));
      fireEvent.click(getByText('202'));
      fireEvent.click(getByText('203'));
      fireEvent.click(getByText('SELECT ALL'));

      // assert
      expect(getAllByDisplayValue('off')).toHaveLength(3);
      expect(getAllByDisplayValue('allOff')).toHaveLength(1);
    });
  });
  describe('handles honors icon', () => {
    test('by showing it for honors sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        honors: true,
      })));
      const { findByTestId } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      const honorsIcon = await findByTestId('honors');

      // assert
      expect(honorsIcon).toBeInTheDocument();
    });

    test('by hiding it for regular sections', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        honors: false,
      })));
      const { queryByTitle } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      const honorsIcon = queryByTitle('honors');

      // assert
      expect(honorsIcon).not.toBeInTheDocument();
    });

    test('if the same professor has both honors and regular sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        sectionNum: '201',
        instructor: new Instructor({ name: 'Aakash Tyagi' }),
        honors: true,
      }, {
        sectionNum: '501',
        instructor: new Instructor({ name: 'Aakash Tyagi' }),
        honors: false,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // act
      const profNames = await findAllByText('Aakash Tyagi');
      expect(profNames).toHaveLength(2);
      const honorsSection = profNames[0];
      const regularSection = profNames[1];

      // assert
      expect(queryByTitleIn(honorsSection, 'Honors')).toBeInTheDocument();
      expect(queryByTitleIn(regularSection, 'Honors')).not.toBeInTheDocument();
    });
  });

  describe('shows a single meeting time', () => {
    test('for duplicate exam times', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 0,
        meetingType: MeetingType.EXAM,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting, testMeeting, testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText('EXAM')).toHaveLength(1);
    });

    test('for slightly different exam times, as long as they have the same start time', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 30,
        meetingType: MeetingType.EXAM,
        section: testSection,
      });
      const testMeeting2 = {
        ...testMeeting,
        endTimeHours: 21,
        endTimeMinutes: 0,
      };

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting, testMeeting, testMeeting, testMeeting2],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText('EXAM')).toHaveLength(1);
    });

    test('for labs on different days, as long as they have the same start time', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: [true, false, false, false, false, false, false],
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 30,
        meetingType: MeetingType.LAB,
        section: testSection,
      });
      const testMeeting2 = {
        ...testMeeting,
        meetingDays: [false, true, false, false, false, false, false],
        endTimeHours: 21,
        endTimeMinutes: 0,
      };

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting, testMeeting, testMeeting, testMeeting2],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText('LAB')).toHaveLength(1);
    });
  });

  describe('shows multiple meeting times', () => {
    test('for different meeting types at different times', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting1 = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 0,
        meetingType: MeetingType.EXAM,
        section: testSection,
      });
      const testMeeting2 = {
        ...testMeeting1,
        startTimeHours: 9,
        startTimeMinutes: 0,
        endTimeHours: 10,
        endTimeMinutes: 30,
        meetingType: MeetingType.LEC,
      };

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting1, testMeeting2],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText(/(EXAM)|(LEC$)/)).toHaveLength(2);
    });
  });

  describe('displays correct number of seats', () => {
    test('when there are no students enrolled', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        currentEnrollment: 0,
        maxEnrollment: 25,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      // verify text for seats is correct
      const sectionText = (await findAllByText(/ seats left/))[0];
      expect(sectionText).toHaveTextContent('25/25 seats left');
      expect(sectionText).not.toHaveStyle('color: red;');
    });

    test('when a section has max enrollment', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        currentEnrollment: 25,
        maxEnrollment: 25,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      // verify text for seats is correct
      const sectionText = (await findAllByText(/ seats left/))[0];
      expect(sectionText).toHaveTextContent('0/25 seats left');
      expect(sectionText).toHaveStyle('color: red;');
    });

    test('when a section has over max enrollment', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        currentEnrollment: 26,
        maxEnrollment: 25,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      // verify text for seats is correct
      const sectionText = (await findAllByText(/ seats left/))[0];
      expect(sectionText).toHaveTextContent('-1/25 seats left');
      expect(sectionText).toHaveStyle('color: red;');
    });
  });

  describe('shows ONLINE', () => {
    test('if the meeting has no building for online sections', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const {
        getByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: null,
        meetingDays: new Array(7).fill(true),
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 8,
        endTimeMinutes: 50,
        meetingType: MeetingType.LEC,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getByText('ONLINE')).toBeTruthy();
    });

    test('if the meeting has no building for hybrid sections', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const {
        getByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: false,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: null,
        meetingDays: new Array(7).fill(true),
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 8,
        endTimeMinutes: 50,
        meetingType: MeetingType.LEC,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getByText('ONLINE')).toBeTruthy();
    });

    test('for 00:00 meeting times & online section', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const {
        getByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        grades: null,
        asynchronous: false,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 0,
        startTimeMinutes: 0,
        endTimeHours: 0,
        endTimeMinutes: 0,
        meetingType: MeetingType.LEC,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getByText('ONLINE')).toBeTruthy();
    });
  });

  describe('shows N/A', () => {
    test('for 00:00 meeting times & online section', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const {
        getByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 0,
        startTimeMinutes: 0,
        endTimeHours: 0,
        endTimeMinutes: 0,
        meetingType: MeetingType.LEC,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getByText('N/A')).toBeTruthy();
    });

    test('for 00:00 meeting times & hybrid section', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const {
        getByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: false,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 0,
        startTimeMinutes: 0,
        endTimeHours: 0,
        endTimeMinutes: 0,
        meetingType: MeetingType.LEC,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getByText('N/A')).toBeTruthy();
    });
  });

  describe('does not show ONLINE', () => {
    test('for meetings that have a building, even if they are marked as remote', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const {
        queryByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      const testSection = new Section({
        id: 0,
        crn: 0,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '200',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        instructor: new Instructor({
          name: 'Test',
        }),
        honors: false,
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: 'BILD',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 0,
        startTimeMinutes: 0,
        endTimeHours: 0,
        endTimeMinutes: 0,
        meetingType: MeetingType.LEC,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(queryByText('ONLINE')).not.toBeInTheDocument();
      expect(queryByText('BILD')).toBeInTheDocument();
    });
  });

  describe('keeps the first section checked', () => {
    test('when a second section is also selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard(
        { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 },
      )));
      const {
        getByText, getAllByDisplayValue,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      // click the first section
      fireEvent.click(getByText('201'));

      // act
      fireEvent.click(getByText('202'));

      // assert
      expect(getAllByDisplayValue('on')).toHaveLength(2);
    });
  });
});
