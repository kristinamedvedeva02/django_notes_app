# from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']

    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]


    def get_queryset(self):
        return Note.objects.filter(
            author=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user
        )


   