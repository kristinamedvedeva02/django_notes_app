from rest_framework import serializers

from .models import Subscription, SubscriptionPlan


class SubscriptionPlanSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = SubscriptionPlan

        fields = (
            "id",
            "code",
            "name",
            "price",
            "description",
        )


class CreateSubscriptionSerializer(
    serializers.Serializer
):
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPlan.objects.filter(
            is_active=True
        ),
        source="plan",
    )

    cardholder_name = serializers.CharField(
        max_length=100,
    )

    card_number = serializers.CharField(
        max_length=19,
        write_only=True,
    )


class SubscriptionSerializer(
    serializers.ModelSerializer
):
    plan = SubscriptionPlanSerializer(
        read_only=True,
    )

    class Meta:
        model = Subscription

        fields = (
            "id",
            "plan",
            "price",
            "status",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields