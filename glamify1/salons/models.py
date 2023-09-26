from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify


class Salon(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    is_open = models.BooleanField(default=True)
    is_accepting_appointment = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    services = models.ManyToManyField(
        'Service', related_name='salons', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def pending_appointments(self):
        return self.appointment_set.filter(status='pending').count()

    @property
    def confirmed_appointments(self):
        return self.appointment_set.filter(status='confirmed').count()

    @property
    def cancelled_appointments(self):
        return self.appointment_set.filter(status='cancelled').count()

    @property
    def completed_appointments(self):
        return self.appointment_set.filter(status='completed').count()


class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration = models.IntegerField()

    def __str__(self):
        return self.name


class Stylist(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    bio = models.TextField(blank=True, null=True)
    services = models.ManyToManyField(
        'Service', related_name='stylists', blank=True)
    salon = models.ForeignKey(
        Salon, on_delete=models.CASCADE, related_name='stylists')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
