from django.urls import path,include
from .views import ProjectViewSet,TaskViewSet

from rest_framework.routers import DefaultRouter
router = DefaultRouter()
# router.register(r'projects',ProjectViewSet)
# router.register(r'tasks',TaskViewSet)
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
urlpatterns = [ 
    path('', include(router.urls)),
]