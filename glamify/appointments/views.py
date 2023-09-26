from rest_framework import generics
from appointments.models import Appointment
from salons.models import Service, Salon, Stylist
from appointments.serializers import AppointmentSerializer, AppointmentUpdateSerializer
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.db.models import F, Sum
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import views
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class AppointmentCreateView(views.APIView):
    serializer_class = AppointmentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print(request.data)
        user = User.objects.get(username='admin')
        appointment_datetime = datetime.fromisoformat(
            request.data.get('appointment_datetime'))
        # Retrieve the services and calculate total duration and price
        services = Service.objects.filter(
            pk__in=request.data.get('services'))
        total_duration = services.aggregate(total_duration=Sum('duration'))[
            'total_duration']
        total_price = services.aggregate(
            total_price=Sum('price'))['total_price']

        # Retrieve the salon and stylist objects or return a 404 response
        try:
            salon = Salon.objects.get(slug=self.kwargs.get('slug'))
            stylist = Stylist.objects.get(
                pk=request.data.get('stylist'), salon=salon)
        except Salon.DoesNotExist:
            return Response({'detail': 'Salon not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Stylist.DoesNotExist:
            return Response({'detail': 'Stylist not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has already booked an appointment
        existing_appointments = Appointment.objects.filter(
            user=user,
            salon=salon,
            stylist=stylist,
            appointment_datetime__lte=appointment_datetime +
            timedelta(minutes=total_duration),
            appointment_datetime__gte=appointment_datetime
        )

        if existing_appointments.exists():
            return Response({'detail': 'You have already booked an appointment with the same stylist at the same salon during this time.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the selected services match the services offered by the stylist
        unavailable_services = services.exclude(stylists=stylist)

        if unavailable_services.exists():
            return Response({'detail': 'The stylist does not offer one or more of the selected services.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check for overlapping appointments
        overlapping_appointments = Appointment.objects.filter(
            stylist=stylist,
            appointment_datetime__lte=appointment_datetime +
            timedelta(minutes=total_duration),
            appointment_datetime__gte=appointment_datetime
        )

        if overlapping_appointments.exists():
            return Response({'detail': 'The stylist has another appointment during this time.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the appointment
        appointment = Appointment(
            salon=salon,
            stylist=stylist,
            user=user,
            appointment_datetime=appointment_datetime,
            total_price=total_price,
            total_duration=total_duration,
        )
        appointment.save()
        appointment.services.set(services)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(user=user)


class AppointmentCancellationView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentUpdateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status == 'pending':
            instance.status = 'cancelled'
            instance.save()
            return Response({'detail': 'Appointment cancelled successfully'}, status=status.HTTP_200_OK)
        else:
            raise ValidationError(
                'Cannot cancel appointment that is not in a pending state')
