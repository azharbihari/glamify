from django.urls import path
from owners.views import SalonListView, SalonStatusChangeView, AppointmentListView, StylistListView, AppointmentCancellationView

urlpatterns = [
    path('', SalonListView.as_view(), name='salon-list'),
    path('<slug:slug>/status/', SalonStatusChangeView.as_view(),
         name='salon-status-change'),
    path('appointments/', AppointmentListView.as_view(),
         name='appointment-list'),
    path('stylists/', StylistListView.as_view(),
         name='stylist-list'),
    path('appointments/<int:pk>/cancel/', AppointmentCancellationView.as_view(),
         name='appointment-cancel'),

]
