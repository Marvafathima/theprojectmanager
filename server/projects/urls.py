from django.urls import path,include
from .views import ProjectViewSet,TaskViewSet,MyTasksViewSet

from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'mytasks',MyTasksViewSet,basename='mytask')

urlpatterns = [ 
    path('', include(router.urls)),
]