from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Note(models.Model):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="notes"
    )

    title = models.CharField(max_length=200)

    file = models.FileField(upload_to="notes/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title