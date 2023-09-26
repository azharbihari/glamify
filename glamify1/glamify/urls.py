from django.contrib import admin
from django.urls import path, include
from glamify.views import LoginView, LoggedInUserView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/user/', LoggedInUserView.as_view(), name='logged-in-user'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('salons/', include('salons.urls')),
    path('owners/', include('owners.urls')),
    path('appointments/', include('appointments.urls')),
    # path('auth/', include('rest_framework.urls')),
]
