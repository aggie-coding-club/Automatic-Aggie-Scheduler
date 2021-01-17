import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  render, fireEvent, waitFor, queryByText as queryContainerByText,
} from '@testing-library/react';
import * as router from '@reach/router';
import autoSchedulerReducer from '../../redux/reducer';
import SchedulingPage from '../../components/SchedulingPage/SchedulingPage';
import { mockFetchSchedulerGenerate } from '../testData';
import { noSchedulesText } from '../../components/SchedulingPage/SchedulePreview/SchedulePreview';

describe('Scheduling Page UI', () => {
  // setup and teardown spy function on navigate
  const navSpy = jest.spyOn(router, 'navigate');
  // don't actually call navigate
  beforeAll(() => navSpy.mockImplementation(() => null));
  // restore navigate to original
  afterAll(navSpy.mockRestore);

  beforeEach(fetchMock.mockReset);

  describe('redirects to the homepage', () => {
    // reset navigate counter for this test
    beforeAll(navSpy.mockClear);

    test('when no term is selected', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // sessions/get_last_term
      fetchMock.mockResponseOnce(JSON.stringify({}));

      // act
      render(
        <Provider store={store}>
          <SchedulingPage />
        </Provider>,
      );

      // assert
      // see jest.mock at top of the file
      waitFor(() => expect(navSpy).toHaveBeenCalledWith('/'));
    });
  });
  describe("doesn't redirect to the homepage", () => {
    // reset navigate counter for this test
    beforeAll(navSpy.mockClear);

    test('when a term is selected', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // set term to something
      // sessions/get_last_term
      fetchMock.mockResponseOnce(JSON.stringify({ term: '202031' }));
      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({}));
      // sessions/get_saved_schedules
      fetchMock.mockResponseOnce(JSON.stringify([]));
      // sessions/get_saved_availabilities
      fetchMock.mockResponseOnce(JSON.stringify([]));

      // act
      render(
        <Provider store={store}>
          <SchedulingPage />
        </Provider>,
      );

      // assert that navigate isn't called
      waitFor(() => expect(navSpy).not.toHaveBeenCalled());
    });
  });

  describe('indicates that there are no schedules', () => {
    test('when there are no schedules to show', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // sessions/get_last_term
      fetchMock.mockResponseOnce(JSON.stringify({}));

      // act
      const { findByText } = render(
        <Provider store={store}>
          <SchedulingPage hideSchedulesLoadingIndicator />
        </Provider>,
      );

      // assert
      expect(await findByText(noSchedulesText)).toBeTruthy();
    });
  });
  describe('adds schedules to the Schedule Preview', () => {
    test('when the user clicks Generate Schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // sessions/get_last_term
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const { getByText, queryByText } = render(
        <Provider store={store}>
          <SchedulingPage hideSchedulesLoadingIndicator />
        </Provider>,
      );

      // Mock scheduler/generate
      fetchMock.mockImplementationOnce(mockFetchSchedulerGenerate);

      // act
      fireEvent.click(getByText('Generate Schedules'));
      await new Promise(setImmediate);

      // assert
      expect(queryByText(noSchedulesText)).toBeFalsy();
      expect(queryByText('Schedule 1')).toBeTruthy();
    });
  });

  describe('changes the meetings shown in the Schedule', () => {
    test('when the user clicks on a different schedule in the Schedule Preview', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // sessions/get_last_term
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const {
        getByLabelText, getByRole, findAllByLabelText, findAllByText,
      } = render(
        <Provider store={store}>
          <SchedulingPage hideSchedulesLoadingIndicator />
        </Provider>,
      );

      // Mock scheduler/generate/
      fetchMock.mockImplementationOnce(mockFetchSchedulerGenerate);

      // act
      fireEvent.click(getByRole('button', { name: 'Generate Schedules' }));
      const schedule2 = (await findAllByLabelText('Schedule preview'))[1];
      fireEvent.click(schedule2);
      // DEPT 123 will be added to the schedule no matter which schedule is chosen
      await findAllByText(/DEPT 123.*/);
      const calendarDay = getByLabelText('Tuesday');

      // assert
      // Schedule 1 has section 501 (LEC) in it
      // Schedule 2 has section 200 (LAB) instead
      // we check Tuesday to avoid selecting the equivalent text in SchedulePreview
      const selectedCSCE = queryContainerByText(calendarDay, /CSCE 121.*/);
      expect(queryContainerByText(selectedCSCE, 'LEC')).toBeFalsy();
      expect(queryContainerByText(selectedCSCE, 'LAB')).toBeTruthy();
    });
  });

  describe('updates redux term based on sessions/get_last_term result', () => {
    test('when the page is loaded', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // sessions/get_last_term
      fetchMock.mockResponseOnce(JSON.stringify({ term: '202031' }));
      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({}));
      // sessions/get_saved_availabilities
      fetchMock.mockResponseOnce(JSON.stringify([]));
      // sessions/get_saved_schedules
      fetchMock.mockResponseOnce(JSON.stringify([]));

      render(
        <Provider store={store}>
          <SchedulingPage />
        </Provider>,
      );

      const { term } = store.getState();

      // assert
      waitFor(() => expect(term).toBe('202031'));
    });
  });
});
