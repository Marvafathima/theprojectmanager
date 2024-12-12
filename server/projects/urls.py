from django.urls import path,include
from .views import ProjectViewSet,TaskViewSet

from rest_framework.routers import DefaultRouter
router = DefaultRouter()
# router.register(r'projects',ProjectViewSet)
# router.register(r'tasks',TaskViewSet)
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
urlpatterns = [
    # Signup
    # path('projects/', ProjectViewSet.as_view(), name='projects'),
    # path('tasks/',TaskViewSet.as_view(), name='tasks'),
    # path('projects/latest', ProjectViewSet.as_view(), name='projects'),
path('', include(router.urls)),
]