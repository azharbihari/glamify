from rest_framework import generics
from salons.models import Salon, Stylist
from appointments.models import Appointment
from owners.serializers import SalonSerializer, SalonUpdateSerializer, StylistSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.response import Response
from appointments.serializers import AppointmentSerializer, AppointmentUpdateSerializer
from django.core.exceptions import ValidationError


class SalonListView(generics.ListAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def list(self, request):
        salons = Salon.objects.filter(owner=self.request.user)
        pending_appointments = Appointment.objects.filter(
            salon__in=salons, status='pending').count()
        completed_appointments = Appointment.objects.filter(
            salon__in=salons, status='completed').count()
        confirmed_appointments = Appointment.objects.filter(
            salon__in=salons, status='confirmed').count()
        cancelled_appointments = Appointment.objects.filter(
            salon__in=salons, status='cancelled').count()
        insights = {'pending_appointments': pending_appointments, 'completed_appointments': completed_appointments,
                    'confirmed_appointments': confirmed_appointments, 'cancelled_appointments': cancelled_appointments}
        queryset = self.get_queryset()
        serializer = SalonSerializer(queryset, many=True)
        return Response({'insights': insights, 'salons': serializer.data})


class SalonStatusChangeView(generics.UpdateAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonUpdateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_open = not instance.is_open

        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'detail': 'Salon status changed successfully', 'data': serializer.data}, status=status.HTTP_200_OK)


class AppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        salons = Salon.objects.filter(owner=self.request.user)
        return Appointment.objects.filter(salon__in=salons)


class StylistListView(generics.ListAPIView):
    queryset = Stylist.objects.all()
    serializer_class = StylistSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        salons = Salon.objects.filter(owner=self.request.user)
        return Stylist.objects.filter(salon__in=salons)


class AppointmentCancellationView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentUpdateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status == 'pending' or instance.status == 'confirmed':
            instance.status = 'cancelled'
            instance.save()
            return Response({'detail': 'Appointment cancelled successfully'}, status=status.HTTP_200_OK)
        else:
            raise ValidationError(
                'Cannot cancel appointment that is not in a pending or confirmed state')
