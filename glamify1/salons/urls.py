from django.contrib import admin
from django.urls import path, include
from salons.views import SalonDetailView, SalonListView

urlpatterns = [
    path('', SalonListView.as_view(), name='salon-list'),
    path('<slug:slug>/', SalonDetailView.as_view(), name='salon-detail'),
]
