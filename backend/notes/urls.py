from django.urls import path
from .views import (
    subject_list,
    note_list,
    delete_note,
)

urlpatterns = [
    path("subjects/", subject_list),
    path("notes/", note_list),
    path("notes/<int:pk>/", delete_note),
]