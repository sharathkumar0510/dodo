from django.db import models
from django.utils import timezone
import random
import string
from datetime import timedelta


class OTP(models.Model):
    mobile = models.CharField(max_length=15)
    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"OTP for {self.mobile}: {self.otp}"

    def save(self, *args, **kwargs):
        # Set expiration time to 10 minutes from creation
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    @classmethod
    def generate_otp(cls, mobile):
        # Generate a 6-digit OTP
        otp = ''.join(random.choices(string.digits, k=6))

        # Delete any existing OTPs for this mobile number
        cls.objects.filter(mobile=mobile).delete()

        # Create a new OTP
        otp_obj = cls.objects.create(
            mobile=mobile,
            otp=otp
        )

        return otp_obj

    @classmethod
    def verify_otp(cls, mobile, otp):
        try:
            otp_obj = cls.objects.get(
                mobile=mobile,
                otp=otp,
                is_verified=False,
                expires_at__gt=timezone.now()
            )
            otp_obj.is_verified = True
            otp_obj.save()
            return True
        except cls.DoesNotExist:
            return False
