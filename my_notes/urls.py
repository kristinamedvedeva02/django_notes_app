from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from rest_framework.permissions import IsAdminUser

urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "accounts/",
        include("django.contrib.auth.urls")
    ),
    path(
        'api/schema/',
        SpectacularAPIView.as_view(),   # SpectacularAPIView.as_view(permission_classes=[IsAdminUser])
        name='schema'
    ),
    path(
        'api/swagger/',
        SpectacularSwaggerView.as_view(
            url_name='schema',
            # permission_classes=[IsAdminUser]      # Закрыть свагер для обычных пользователей
            ),
        name='swagger-ui'
    ),

    path( 'api/auth/', include("authentification.urls")),
    path('api/notes/', include('notes.urls')),

]