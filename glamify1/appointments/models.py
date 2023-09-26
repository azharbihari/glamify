from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from salons.models import Salon, Stylist, Service
from django.db.models import Sum


class Appointment(models.Model):
    APPOINTMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE)
    appointment_datetime = models.DateTimeField()
    total_duration = models.IntegerField()
    services = models.ManyToManyField(Service, related_name='appointments')
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(
        max_length=10, choices=APPOINTMENT_STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Appointment at {self.salon.name} with {self.stylist.first_name} {self.stylist.last_name} on {self.appointment_datetime}"

    class Meta:
        ordering = ['-appointment_datetime']
