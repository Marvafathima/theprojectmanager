from django.urls import path
from views import ProjectViewSet
urlpatterns = [
    # Signup
    path('projects/', ProjectViewSet.as_view(), name='projects'),
]