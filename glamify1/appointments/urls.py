from django.urls import path
from appointments.views import AppointmentCreateView, AppointmentListView, AppointmentCancellationView

urlpatterns = [
    path('', AppointmentListView.as_view(), name='appointment-list'),
    path('<int:pk>/cancel/', AppointmentCancellationView.as_view(),
         name='appointment-cancel'),
    path('<slug:slug>/', AppointmentCreateView.as_view(),
         name='appointment-create'),
]
