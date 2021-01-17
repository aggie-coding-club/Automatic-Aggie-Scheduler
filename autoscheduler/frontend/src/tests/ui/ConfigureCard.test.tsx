import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import ConfigureCard from '../../components/SchedulingPage/ConfigureCard/ConfigureCard';
import autoSchedulerReducer from '../../redux/reducer';
import { updateCourseCard } from '../../redux/actions/courseCards';
import { CustomizationLevel, SectionFilter, SectionSelected } from '../../types/CourseCardOptions';
import testFetch from '../testData';
import { GenerateSchedulesResponse } from '../../types/APIResponses';
import { errorGeneratingSchedulesMessage } from '../../redux/actions/schedules';

describe('ConfigureCard component', () => {
  beforeEach(fetchMock.mockReset);

  describe('makes an API call', () => {
    test('when the user clicks Fetch Schedules', () => {
      // arrange
      fetchMock.mockOnce('[]');

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Generate Schedules'));

      // assert
      expect(fetchMock).toBeCalledWith('scheduler/generate', expect.any(Object));
    });
  });

  describe('shows a loading spinner', () => {
    test('when the user clicks Fetch Schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText, findByRole } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      fetchMock.mockImplementation((): Promise<Response> => new Promise(
        (resolve) => setTimeout(resolve, 500, {
          json: (): any[] => [],
        }),
      ));

      // act
      fireEvent.click(getByText('Generate Schedules'));
      const loadingSpinner = await findByRole('progressbar');

      // assert
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  describe('Clicking generate schedules', () => {
    test('Sends a list of section numbers when customization level is Section', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      fetchMock.mockImplementationOnce(testFetch); // Mock api/sections
      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.SECTION,
        honors: 'include',
        remote: 'include',
        asynchronous: 'exclude',
        course: 'CSCE 121',
      }, '201931'));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      // Doesn't need to return anything valid
      fetchMock.mockOnce('[]'); // mocks scheduler/generate call

      const getCardSections = (): SectionSelected[] => store.getState().courseCards[0].sections;
      // wait for Redux to fill in sections
      await waitFor(() => expect(getCardSections()).not.toHaveLength(0));

      // Make all of the sections selected
      store.dispatch<any>(updateCourseCard(0, {
        sections: getCardSections().map((sec) => ({
          section: sec.section,
          selected: true,
          meetings: sec.meetings,
        })),
      }));

      // act
      fireEvent.click(getByText('Generate Schedules'));

      // second call is the /scheduler/generate call. Second index of that call is the body
      const { body } = fetchMock.mock.calls[1][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object,
      // then get the honors & remote fields
      const { courses } = JSON.parse(body.toString());

      // assert
      expect(courses[0].sections).toEqual(['501', '502', '503']);
    });

    test('Does not send honors and remote when customization level is Section', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      fetchMock.mockImplementationOnce(testFetch); // Mock api/sections
      // Doesn't need to return anything valid
      fetchMock.mockOnce('[]'); // mocks scheduler/generate call

      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.SECTION,
        honors: 'include',
        remote: 'include',
        asynchronous: 'exclude',
        course: 'CSCE 121',
      }, '201931'));

      const cardSections = store.getState().courseCards[0].sections;

      // Make all of the sections selected
      store.dispatch<any>(updateCourseCard(0, {
        sections: cardSections.map((sec) => ({
          section: sec.section,
          selected: true,
          meetings: sec.meetings,
        })),
      }));

      // act
      await new Promise(setImmediate);
      fireEvent.click(getByText('Generate Schedules'));

      // second call is the /scheduler/generate call. Second index of that call is the body
      const { body } = fetchMock.mock.calls[1][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object,
      // then get the honors & remote fields
      const { courses } = JSON.parse(body.toString());
      const { honors, remote } = courses[0];

      // assert
      // no_preference is the default value
      expect(remote).toEqual(SectionFilter.NO_PREFERENCE);
      expect(honors).toEqual(SectionFilter.NO_PREFERENCE);
    });

    test('Does not send sections when "BASIC" customization level is selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      fetchMock.mockImplementationOnce(testFetch);
      fetchMock.mockOnce('[]'); // mocks scheduler/generate call

      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.BASIC,
        honors: 'exclude',
        remote: 'exclude',
        asynchronous: 'exclude',
        // Add a selected section so its added to selectedSections internally
        course: 'CSCE 121',
      }, '201931'));

      const cardSections = store.getState().courseCards[0].sections;

      // Make all of the sections selected
      store.dispatch<any>(updateCourseCard(0, {
        sections: cardSections.map((sec) => ({
          section: sec.section,
          selected: true,
          meetings: sec.meetings,
        })),
      }));

      // act
      fireEvent.click(getByText('Generate Schedules'));

      const { body } = fetchMock.mock.calls[1][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object, then get the courses field
      const { courses } = JSON.parse(body.toString());
      const { sections } = courses[0];

      // assert
      expect(sections.length).toEqual(0);
    });
  });

  describe('shows an error snackbar', () => {
    test('when the backend returns no schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText, findByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      fetchMock.mockResponseOnce(JSON.stringify([]));

      // act
      fireEvent.click(getByText('Generate Schedules'));
      const errorMessage = await findByText(errorGeneratingSchedulesMessage);

      // assert
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('does not show an error snackbar', () => {
    test('when the backend returns schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { queryByText, findByRole } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      const mockedResponse: GenerateSchedulesResponse = {
        schedules: [[], []],
        message: '',
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockedResponse));

      // act
      fireEvent.click(queryByText('Generate Schedules'));
      await findByRole('progressbar');
      const errorMessage = queryByText('No schedules found. Try widening your criteria.');
      // finish all running promises
      await new Promise(setImmediate);

      // assert
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
