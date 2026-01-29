from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=50) # e.g., "6 Months"
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True) # ✅ LMS Look
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ✅ Naya Model: Course ke andar ke chapters/videos ke liye
class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    video_url = models.URLField(help_text="YouTube or Vimeo link", blank=True, null=True)
    content = models.TextField(blank=True, help_text="Lesson notes or description")
    order = models.PositiveIntegerField(default=0, help_text="Sequence of the lesson")
    is_preview = models.BooleanField(default=False, help_text="Can student see this without buying?")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.name} - {self.title}"

# ✅ Naya Model: PDF aur Assignment Files ke liye
class Resource(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='resources')
    file_title = models.CharField(max_length=100)
    file = models.FileField(upload_to='course_resources/')

    def __str__(self):
        return self.file_title