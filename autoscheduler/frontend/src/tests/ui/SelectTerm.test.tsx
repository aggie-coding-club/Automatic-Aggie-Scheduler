import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { navigate } from '@reach/router';
import SelectTerm from '../../components/LandingPage/SelectTerm/SelectTerm';
import autoSchedulerReducer from '../../redux/reducer';

// Mocks navigate, so we can assert that it redirected to the correct url for Redirects to /schedule
// This must be outside of all describes in order to function correctly
jest.mock('@reach/router', () => ({
  navigate: jest.fn(),
}));

// Mocks the fetch call to api/terms
const mockTermsAPI = (): void => {
  fetchMock.mockResponseOnce(JSON.stringify({
    'Fall 2020': '202031',
    'Summer 2020': '202021',
    'Spring 2020': '202011',
    'Fall 2019': '201931',
    'Summer 2019': '201921',
    'Spring 2019': '201911',
  }));
};

describe('SelectTerm', () => {
  beforeEach(mockTermsAPI);

  afterEach(fetchMock.mockReset);

  describe('Menu opens', () => {
    test('after button is clicked', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      const { findByText } = render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );

      // act
      const button = await findByText('Select Term');
      fireEvent.click(button);

      // assert
      expect(document.getElementsByClassName('MuiPopover-root')[0]).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Menu is closed', () => {
    test('on initialization', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );

      // act
      const menu = await waitFor(() => document.getElementsByClassName('MuiPopover-root')[0]);

      // assert
      expect(menu).toHaveAttribute('aria-hidden');
    });
  });

  describe('Redirects to /schedule', () => {
    test('when a term is selected', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      const { findByText } = render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );

      // Mock sessions/set_last_term
      fetchMock.mockResponseOnce(JSON.stringify({}));

      // act
      const button = await findByText('Select Term');
      fireEvent.click(button);
      // Wait for SelectTerm to finish rendering
      const testSemester = await findByText('Fall 2020');
      fireEvent.click(testSemester);

      // assert
      // see jest.mock at top of the file
      waitFor(() => expect(navigate).toHaveBeenCalledWith('/schedule'));
    });
  });

  describe('Makes the correct API call to /sessions/set_last_term', () => {
    test('when a term is selected', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      const { findByText } = render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );
      // Mock sessions/set_last_term
      const setLastTerm = fetchMock.mockResponseOnce(JSON.stringify({}));

      // act
      const button = await findByText('Select Term');
      fireEvent.click(button);
      // Wait for SelectTerm to finish rendering
      const testSemester = await findByText('Fall 2020');
      fireEvent.click(testSemester);

      // assert
      // see jest.mock at top of the file
      expect(setLastTerm).toHaveBeenCalledWith(
        'sessions/set_last_term?term=202031',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });

  describe('Only calls api/terms once', () => {
    test('when multiple SelectTerm components are rendered', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      render(
        <Provider store={store}>
          <SelectTerm />
          <SelectTerm />
        </Provider>,
      );

      // act - terms API will automatically fetch

      // assert - if api/terms is called a second time then it won't be mocked, throwing an error
    });
  });
});
