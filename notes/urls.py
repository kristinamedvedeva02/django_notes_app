from rest_framework.routers import DefaultRouter
from .views import NoteViewSet
from django.urls import include, path


router = DefaultRouter()

router.register('notes', NoteViewSet, basename='notes')

urlpatterns = [
    path('', include(router.urls))
]