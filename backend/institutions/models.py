from django.db import models

class Institution(models.Model):
    TYPE_CHOICES = (
        ('School', 'School'),
        ('College', 'College'),
        ('Coaching', 'Coaching'),
        ('University', 'University')
    )

    # --- 1. Basic Info ---
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True, help_text="Ex: SCH-101")
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='School')
    affiliation = models.CharField(max_length=100, blank=True, null=True, help_text="Ex: CBSE, ICSE, State Board")
    affiliation_number = models.CharField(max_length=100, blank=True, null=True)
    
    # --- 2. Contact & Location (For Receipts/ID Cards) ---
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    # --- 3. Branding & Head ---
    principal_name = models.CharField(max_length=100, blank=True, null=True)
    logo = models.ImageField(upload_to='institutes/logos/', blank=True, null=True)
    signature = models.ImageField(upload_to='institutes/signatures/', blank=True, null=True)

    # --- 4. System ---
    status = models.CharField(max_length=50, default="Active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"