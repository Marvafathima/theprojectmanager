
from django.urls import path,include
from rest_framework_simplejwt.views import TokenVerifyView
from .views import (
    SignupView, 
    CustomTokenObtainPairView, 
    CustomTokenRefreshView, 
    LogoutView,UserViewSet
)
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'users', UserViewSet)
urlpatterns = [
    # Signup
    path('signup/', SignupView.as_view(), name='signup'),
    
    path('user/', include(router.urls)),
    # Token endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Logout
    path('logout/', LogoutView.as_view(), name='logout'),
]