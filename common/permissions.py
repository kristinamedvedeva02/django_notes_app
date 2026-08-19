from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Разрешает доступ только
    авторизованным администраторам.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_staff
        )