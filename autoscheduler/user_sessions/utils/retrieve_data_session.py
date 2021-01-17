from contextlib import contextmanager
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.sessions.models import Session
from user_sessions.models import UserToDataSession

@contextmanager
def retrieve_data_session(request):
    """ Checks if the user already has a session assigned to them in which
        to store their data. If so, saves the session id of that session to
        their current session. Otherwise, creates a session for them, and a
        user_to_data_session entry that associates them with the session
        before saving that session id to their current session
    """
    print('retrieve_data_session')
    # Get user id
    user_id = request.user.id
    # Session stuff
    try:
        if user_id is None:
        # The User is anonymous, uses request.session
            print('user_id is None')
            data_session = request.session
            yield data_session
        else:
        # If user is logged in and model exists, uses the session in the model
            session_key = UserToDataSession.objects.get(user_id=user_id).session_key
            print(f'user_id is not None: {user_id} {session_key}')
            data_session = SessionStore(session_key=session_key)
            SessionStore.clear_expired()
            ret = ""
            for key, value in data_session.items():
                ret = f'{ret}{key}: {value}, '
            print(f'new: {ret}')
            yield data_session
    except UserToDataSession.DoesNotExist:
        print('UserToDataSession.DoesNotExist')
        # The user is logged in but the model doesn't exist.
        # Create the model before returning the corresponding data session
        # Create a session object
        data_session = SessionStore()
        data_session.create()
        session_key = data_session.session_key
        # Copy data from session used before logging in to the data session.
        # This is to prevent user progress from being lost on their first login
        request_session_object = Session.objects.get(pk=request.session.session_key)
        data_session_object = Session.objects.get(pk=session_key)
        data_session_object.session_data = request_session_object.session_data
        data_session_object.save()
        # Create a user_to_data_session entry
        UserToDataSession(user_id=user_id, session_key=session_key).save()
        data_session = SessionStore(session_key=session_key)
        yield data_session
    finally:
        data_session.save()
