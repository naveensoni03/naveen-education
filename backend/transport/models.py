from django.db import models

class Vehicle(models.Model):
    bus_number = models.CharField(max_length=20, unique=True) # e.g., UP-15-AB-1234
    driver_name = models.CharField(max_length=100)
    driver_phone = models.CharField(max_length=15)
    capacity = models.IntegerField(default=50)
    route_name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.bus_number} - {self.route_name}"

class TransportAllocation(models.Model):
    # Student link hum baad mein jodenge jab Student app pakka ho jayega
    # Abhi ke liye basic details
    student_roll = models.CharField(max_length=20)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    pickup_point = models.CharField(max_length=100)
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=2000.00)

    def __str__(self):
        return f"{self.student_roll} in {self.vehicle.bus_number}"