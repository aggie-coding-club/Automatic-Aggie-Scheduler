from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.sessions.models import Session # TEMP REMOVE LATER
from user_sessions.utils.retrieve_data_session import retrieve_data_session
from scheduler.views import _serialize_schedules

def _set_state_in_session(request, key: str):
    """ Function that sets the given key in our session to the value of the key in the
        request body. Must have term and the given key in the body of the request.
        Used for save_courses and save_availabilities
    """

    objs = request.data.get(key)
    term = request.data.get('term')

    if objs is None or term is None:
        return Response(f'Request body must contain {key} and term', status=400)

    with retrieve_data_session(request) as data_session:
        data_session.setdefault(term, {})[key] = objs

        return Response()

def _get_state_from_session(request, key: str):
    """ Retrieves the value for the respective key from the session. Must have a term as
        a query parameter. Used for get_courses and get_availabilities.
    """

    term = request.query_params.get('term')
    if not term:
        return None

    with retrieve_data_session(request) as data_session:
        response = data_session.get(term, {}).get(key, [])

        return response

@api_view(['GET'])
def get_last_term(request):
    """ API endpoint that returns JSON containing last term for the user's session. """
    with retrieve_data_session(request) as data_session:
        term = data_session.get('term')
        response = {}
        if term:
            response['term'] = term
        return Response(response)

@api_view(['PUT'])
def set_last_term(request):
    """ API endpoint that sets term for the current session. Called when a term is
        selected, or when the title bar is clicked to unset last term.
    """
    with retrieve_data_session(request) as data_session:
        term = request.query_params.get('term')
        # empty string term is valid (used to unset term), so explicitly check for None
        if term is None:
            return Response(status=400)
        data_session['term'] = term
        return Response()

@api_view(['PUT'])
@parser_classes([JSONParser])
def save_courses(request):
    """ API endpoint that saves course cards for user's current term. Note that this
        doesn't check the formatting, it assumes the frontend can deal with it when
        it's retrieved later
    """
    return _set_state_in_session(request, 'courses')

@api_view(['GET'])
def get_saved_courses(request):
    """ API endpoint that retrieves saved courses for the requested term. """
    courses = _get_state_from_session(request, 'courses')

    if courses is None:
        return Response(status=400)

    return Response(courses)

@api_view(['GET'])
def get_full_name(request):
    """ View that retrieves the first and last name separated by a space for the user
          of the current session
    """
    user_id = request.session.get('_auth_user_id')
    if user_id is None:
        return Response(status=200)
    user = User.objects.get(pk=user_id)
    response = {'fullName': user.get_full_name()}
    return Response(response)

@api_view(['GET'])
def get_saved_availabilities(request):
    """ Returns the saved availabities from the session for the requested term"""
    availabilities = _get_state_from_session(request, 'availabilities')

    if availabilities is None:
        return Response(status=400)

    return Response(availabilities)

@api_view(['PUT'])
@parser_classes([JSONParser])
def save_availabilities(request):
    """ Saves availabilities for the given user in the session """
    return _set_state_in_session(request, 'availabilities')

@api_view(['GET'])
def get_saved_schedules(request):
    """ Returns the saved schedules from the session for the requested term """
    schedules = _get_state_from_session(request, 'schedules')

    if schedules is None:
        return Response(status=400)

    section_tuples = [schedule['sections'] for schedule in schedules]
    serialized = _serialize_schedules(section_tuples)

    ret = [{
        'name': schedule['name'],
        'sections': sections,
    } for schedule, sections in zip(schedules, serialized)]

    return Response(ret)

@api_view(['PUT'])
@parser_classes([JSONParser])
def save_schedules(request):
    """ Saves schedules for the given user in the session """
    return _set_state_in_session(request, 'schedules')

@api_view(['POST'])
def logout(request):
    """ Logs out the user and redirects to index"""
    auth.logout(request)
    return Response()

# TEMP CODE TODO REMOVE AFTER BUG FIX
@api_view(['GET'])
def get_decoded_session_data(request):
    """ Basically a temp cout"""
    key = request.query_params.get('key')
    session = Session.objects.get(pk=key)
    session_data = session.get_decoded()
    return Response(session_data)
