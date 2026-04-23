from django.db import models
from django.contrib.auth.models import User

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)

    waste_types = models.JSONField()
    weight = models.CharField(max_length=20)
    factory_id = models.CharField(max_length=100)

    pickup_date = models.DateField()
    time_slot = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    payment_method = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.pickup_date}"