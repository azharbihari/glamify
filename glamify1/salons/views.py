from rest_framework import generics
from salons.models import Salon
from salons.serializers import SalonSerializer, SalonDetailSerializer


class SalonListView(generics.ListAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer


class SalonDetailView(generics.RetrieveAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonDetailSerializer
    lookup_field = 'slug'
