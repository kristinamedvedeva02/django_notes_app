from django.conf import settings
from django.db import models


class SubscriptionPlan(models.Model):

    code = models.CharField(
        max_length=50,
        unique=True,
    )
    name = models.CharField(
        max_length=50,
        unique=True,
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    description = models.TextField(
        blank=True,
    )
    duration_days = models.PositiveIntegerField()
    is_active = models.BooleanField(
        default=True,
    )


    class Meta:
        db_table = 'subscription_plans'

    def __str__(self):
        return self.name



class Subscription(models.Model):


    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACTIVE = "active", "Active"
        FAILED = "failed", "Failed"


    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions",
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    ) 
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    start_date = models.DateTimeField(          # Дата начала и конца подписки
        null=True,
        blank=True,
    )     
    end_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = 'subscriptions'

    def __str__(self):
        return (
            f"{self.user} — "
            f"{self.plan.name} — "
            f"{self.status}"
        )
