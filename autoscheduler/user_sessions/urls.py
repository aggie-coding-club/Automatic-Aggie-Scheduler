from django.urls import path
from user_sessions.views import(
    get_last_term, set_last_term, save_courses, get_saved_courses, get_full_name,
    get_saved_availabilities, save_availabilities, get_saved_schedules, save_schedules,
    logout, get_decoded_session_data
)

urlpatterns = [
    path('get_last_term', get_last_term),
    path('set_last_term', set_last_term),
    path('get_full_name', get_full_name),
    path('save_courses', save_courses),
    path('get_saved_courses', get_saved_courses),
    path('get_full_name', get_full_name),
    path('get_saved_availabilities', get_saved_availabilities),
    path('save_availabilities', save_availabilities),
    path('get_saved_schedules', get_saved_schedules),
    path('save_schedules', save_schedules),
    path('get_decoded', get_decoded_session_data),
    path('logout', logout),
]
