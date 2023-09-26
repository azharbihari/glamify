from rest_framework import serializers
from appointments.models import Appointment
from salons.models import Stylist, Salon, Service


class StylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stylist
        fields = '__all__'


class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = ['name', 'city']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['name', 'duration', 'price']


class AppointmentSerializer(serializers.ModelSerializer):
    stylist = StylistSerializer()
    salon = SalonSerializer()
    services = ServiceSerializer(many=True)
    status = serializers.CharField(source='get_status_display', read_only=True)
    appointment_datetime = serializers.DateTimeField(
        format='%A, %B %d, %Y %I:%M %p')

    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status']
