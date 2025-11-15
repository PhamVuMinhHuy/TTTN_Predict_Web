from djongo import models
from django.utils import timezone


class Users(models.Model):
    UserID = models.ObjectIdField(primary_key=True)
    Username = models.CharField(max_length=50, unique=True)
    PasswordHash = models.CharField(max_length=255)
    Email = models.CharField(max_length=100, blank=True, null=True)
    CreatedAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.Username


class PredictionHistory(models.Model):
    PredictionID = models.ObjectIdField(primary_key=True)
    UserID = models.ForeignKey(Users, on_delete=models.CASCADE)

    StudyHoursPerWeek = models.FloatField()
    PreviousGrade = models.FloatField()
    AttendanceRate = models.FloatField()

    ParentalSupport = models.CharField(
        max_length=10,
        choices=[
            ("Low", "Low"),
            ("Medium", "Medium"),
            ("High", "High")
        ]
    )

    ExtracurricularActivities = models.IntegerField()  # từ 1 đến 3
    FinalGrade = models.FloatField()

    PredictedAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.UserID.Username} → {self.FinalGrade}"
