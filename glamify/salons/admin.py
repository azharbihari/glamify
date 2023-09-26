from django.contrib import admin
from salons.models import Salon, Stylist, Service


class SalonAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'state')
    list_filter = ('owner', 'city', 'state')
    search_fields = ('name', 'owner__username', 'city', 'state')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('services',)


class StylistAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'salon')
    list_filter = ('salon',)
    search_fields = ('first_name', 'last_name')
    filter_horizontal = ('services',)


class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price')
    search_fields = ('name', 'description')


admin.site.register(Salon, SalonAdmin)
admin.site.register(Stylist, StylistAdmin)
admin.site.register(Service, ServiceAdmin)
