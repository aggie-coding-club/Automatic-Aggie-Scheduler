import unittest

import asyncio
from aiohttp import ClientSession
from scraper.banner_requests import generate_session_id, get_term_code
from scraper.banner_requests import Semester, Location, BannerRequests
from .aio_test_case import AioTestCase

class GenerateSessionIDTests(unittest.TestCase):
    """ Tests generate_session_id from banner_requests.py """
    def test_is_18_chars(self):
        """ Checks that the session_id is 18 characters long """

        # Arrange/Act
        session_id = generate_session_id()

        # Assert
        length = len(session_id)

        assert length == 18 # Should be 18 characters long

class GetTermCodeTests(unittest.TestCase):
    """ Tests get_term_code from banner_requests.py """

    def test_fall_college_station_returns_31(self):
        """ Tests if when given fall semester & at college station if it returns 31 """
        # Arrange
        semester = Semester.fall
        loc = Location.college_station

        # Act
        term_code = get_term_code("2019", semester, loc)

        # Assert
        assert term_code[4:] == "31" # term_code is 201931, but we just want last 2 chars

    def test_spring_galveston_returns_22(self):
        """ Tests if when given spring & at galveston, if the given term ends in 22 """
        # Arrange
        semester = Semester.spring
        loc = Location.galveston

        # Act
        term_code = get_term_code("2019", semester, loc)

        # Assert
        assert term_code[4:] == "12"

    def test_invalid_year_does_raise_error(self):
        """ Provides an invalid year(where len != 4) and passes if it throws an error """
        try:
            _ = get_term_code("9", Semester.fall, Location.college_station)

            assert False # If it doesn't raise an error, then didn't pass
        except ValueError:
            assert True
            return

class BannerRequestsTests(AioTestCase):
    """ Tests BannerRequests for functionality. These access the network for communicating
        with Banner, so they are naturally pretty slow(relatively)
    """

    async def test_get_courses_does_retrieve_correct_department(self):
        """ Tests that get_courses retrieves the correct department """

        # Arrange
        term = "201931" # Fall 2019
        request = BannerRequests(term)

        dept = "CSCE"

        async with ClientSession(loop=asyncio.get_running_loop()) as session:
            session_id = await request.create_session(session)

            # Act
            result = await request.get_courses(session, session_id, dept, 1)

            subject = result[0]["subject"]

            # Assert
            assert subject == dept

    async def test_search_does_retrieve_all(self):
        """ Tests that search retrieves all of the departments it was given """

        # Arrange
        term = "201931" # Fall 2019
        request = BannerRequests(term)

        depts = ["CSCE", "MATH", "ECEN"]

        # Act
        result = await request.search(depts, 1)

        # Get all of the according subjects for the retrieved courses
        depts_result = [result[i][0]['subject'] for i in range(0, len(result))]

        # Assert
        assert depts_result == depts


    def test_get_depts_does_work(self):
        """  Tests that the retrieved departments are the correct amount and that the
             first retrieved department is correct
         """

        # Arrange
        term = "201931"
        request = BannerRequests(term)

        amount = 3

        # Act
        data = request.get_departments(amount)

        result = data[0]['code']

        # Assert
        assert result == "ACCT" # First subject/dept in alphabetical order
        assert len(data) == amount
