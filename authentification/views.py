# from django.shortcuts import render

from django.contrib.auth import login
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import RegisterForm


class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = "auth/registration.html"    
    success_url = reverse_lazy("home")  #переадрессация на главную страницу

    def form_valid(self, form):
        response = super().form_valid(form)

        login(                          #автоматическая авторизация после регистрации
            self.request,
            self.object
        )

        return response


class HomeView(TemplateView):
    template_name = "home/main_page.html"    



class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
        })
    
