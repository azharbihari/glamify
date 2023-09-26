from django.contrib import admin
from appointments.models import Appointment


class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'salon', 'stylist',
                    'appointment_datetime', 'status')
    list_filter = ('status', 'stylist', 'salon')
    search_fields = ('user__username', 'stylist__first_name',
                     'stylist__last_name', 'salon__name')
    date_hierarchy = 'appointment_datetime'
    filter_horizontal = ('services',)


admin.site.register(Appointment, AppointmentAdmin)
