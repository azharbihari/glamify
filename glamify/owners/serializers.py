from rest_framework import serializers
from salons.models import Salon, Stylist
from salons.serializers import ServiceSerializer


class SalonSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True)
    pending_appointments = serializers.ReadOnlyField()
    confirmed_appointments = serializers.ReadOnlyField()
    cancelled_appointments = serializers.ReadOnlyField()
    completed_appointments = serializers.ReadOnlyField()

    class Meta:
        model = Salon
        fields = '__all__'


class SalonUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = ['is_open']


class StylistSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True)
    completed_appointments_count = serializers.SerializerMethodField()

    class Meta:
        model = Stylist
        fields = '__all__'

    def get_completed_appointments_count(self, stylist):
        completed_count = stylist.appointment_set.filter(
            status='completed').count()
        return completed_count
