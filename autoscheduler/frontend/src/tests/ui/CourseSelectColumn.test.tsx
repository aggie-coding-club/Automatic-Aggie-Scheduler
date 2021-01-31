import fetchMock, { enableFetchMocks, MockResponseInit } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import CourseSelectColumn from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectColumn';
import testFetch from '../testData';
import setTerm from '../../redux/actions/term';
import { updateCourseCard } from '../../redux/actions/courseCards';

beforeAll(() => fetchMock.enableMocks());

beforeEach(() => {
  fetchMock.mockReset();
  document.body.innerHTML = '';
});

function ignoreInvisible(query: string | RegExp):
(content: string, element: HTMLElement) => boolean {
  return (content: string, element: HTMLElement): boolean => {
    if (content.match(query) && content.match(query).length > 0) {
      try {
        expect(element).toBeVisible();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };
}

// Function that mocks responses from save_courses and get_saved_courses
const mockCourseAPI = (request: Request): Promise<MockResponseInit | string> => (
  new Promise((resolve) => {
    if (request.url === 'sessions/save_courses') {
      resolve({
        body: '',
        init: { status: 204 },
      });
    }
    resolve(JSON.stringify({}));
  })
);

describe('CourseSelectColumn', () => {
  describe('Adds a course card', () => {
    test('when the Add Course button is clicked', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const { getByText, getAllByLabelText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      // Press the button
      act(() => { fireEvent.click(getByText('Add Course')); });

      // Get the course cards
      const cardsCount = getAllByLabelText('Remove').length;

      // assert
      // There should be now be two since it defaults to one at the beginning
      expect(cardsCount).toEqual(2);
    });
  });

  describe('Removes a course card', () => {
    test('when Remove is clicked on a course card', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const { getByLabelText, queryAllByLabelText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      // Press the button
      act(() => { fireEvent.click(getByLabelText('Remove')); });

      const cardsCount = queryAllByLabelText('Remove').length;

      // assert
      // Starts with 1 by default, so removing one should make it 0
      expect(cardsCount).toEqual(0);
    });
  });

  describe('Section 501 box is checked', () => {
    test('when it is clicked on the second course card', async () => {
      // arrange
      const nodeProps = Object.create(Node.prototype, {});
      // @ts-ignore
      document.createRange = (): Range => ({
        setStart: (): void => {},
        setEnd: (): void => {},
        commonAncestorContainer: {
          ...nodeProps,
          nodeName: 'BODY',
          ownerDocument: document,
        },
      });


      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const {
        getAllByLabelText, findByText, getAllByText,
      } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      fetchMock.mockResponseOnce(JSON.stringify({
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch);

      // act
      fireEvent.click(await findByText('Add Course'));

      // fill in course
      const courseEntry = getAllByLabelText('Course')[0]; // as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'C' } });
      fireEvent.click(await findByText('CSCE 121'));

      // Disable the course card so it doesn't count for 'Mui-checked'
      store.dispatch<any>(updateCourseCard(0, { disabled: true }, '201931'));
      store.dispatch<any>(updateCourseCard(1, { disabled: true }, '201931'));

      // switch to section select and select section 501
      fireEvent.click(getAllByText(ignoreInvisible('Section'))[0]);
      fireEvent.click(
        await findByText(ignoreInvisible('501')),
      );
      await new Promise(setImmediate);

      const checked = document.getElementsByClassName('Mui-checked').length;

      // assert
      expect(checked).toEqual(1);
    });
  });

  describe('fetches saved courses', () => {
    test('when the term is changed', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // sessions/get_saved_courses
      fetchMock.mockResponse(JSON.stringify({}));

      render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act/assert
      // should be called once when term is initially set, and again when changed
      store.dispatch(setTerm('201931'));
      await new Promise(setImmediate);
      expect(fetchMock).toHaveBeenCalledWith('sessions/get_saved_courses?term=201931');

      store.dispatch(setTerm('202031'));
      await new Promise(setImmediate);
      expect(fetchMock).toHaveBeenCalledWith('sessions/get_saved_courses?term=202031');
    });
  });

  describe('saves course cards', () => {
    const expectCardsToBeSavedForTerm = (term: string): void => {
      const saved = fetchMock.mock.calls.some((call) => (
        call[0] === 'sessions/save_courses' && JSON.parse(call[1].body.toString()).term === term
      ));

      if (!saved) throw new Error(`save_courses was not called for term ${term}`);
    };

    test('when the term is changed', async () => {
      // arrange
      fetchMock.mockResponse(mockCourseAPI);

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      store.dispatch(setTerm('202031'));
      store.dispatch(setTerm('201931'));
      await new Promise(setImmediate);

      // assert
      expectCardsToBeSavedForTerm('202031');
    });

    test('when the website is closed', async () => {
      // arrange
      fetchMock.mockResponse(mockCourseAPI);

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031'));

      render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      await new Promise(setImmediate);

      // act
      // dispatch beforeunload event, since jest doesn't handle window.close() properly
      window.dispatchEvent(new Event('beforeunload'));

      // assert
      expectCardsToBeSavedForTerm('202031');
    });
  });

  describe('does not save courses', () => {
    const expectCardsNotToBeSavedForTerm = (term: string): void => {
      const saved = fetchMock.mock.calls.some((call) => (
        call[0] === 'sessions/save_courses' && JSON.parse(call[1].body.toString()).term === term
      ));

      if (saved) throw new Error(`save_courses was called for term ${term}`);
    };

    test('when a course card is loading', async () => {
      // arrange
      fetchMock.mockResponse(mockCourseAPI);

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031'));

      render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act: wait for all cards to finish loading, then make them load again
      // to avoid this test passing by chance
      await new Promise(setImmediate);
      store.dispatch<any>(updateCourseCard(0, { loading: true }));

      // assert
      expectCardsNotToBeSavedForTerm('202031');
    });
  });
});
