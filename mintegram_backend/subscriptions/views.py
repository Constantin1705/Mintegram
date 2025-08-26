from django.shortcuts import render
from rest_framework import generics
from .models import Subscription
from .serializers import SubscriptionSerializer
import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class SubscriptionListView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        sub_type = self.request.query_params.get('type')
        if sub_type in ['hearts', 'diamonds']:
            return Subscription.objects.filter(type=sub_type)
        return Subscription.objects.all()

class CreateStripeSessionView(APIView):
    def post(self, request):
        sub_id = request.data.get('subscription_id')
        try:
            sub = Subscription.objects.get(id=sub_id)
            stripe.api_key = settings.STRIPE_SECRET_KEY
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'ron',
                        'product_data': {
                            'name': sub.name,
                            'description': sub.description,
                        },
                        'unit_amount': int(sub.price * 100),  # Stripe folosește bani în bani (ex: 100 RON = 10000)
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='https://siteul-tau.ro/succes',  # schimbă cu url-ul tău
                cancel_url='https://siteul-tau.ro/anulat',
            )
            return Response({'sessionId': session.id})
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
