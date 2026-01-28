from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
import stripe
from django.conf import settings
import os

# Inițializare Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class CreatePaymentIntentView(APIView):
    """
    POST /api/payments/create-payment-intent/
    Crează un Payment Intent pentru procesarea plăților cu Stripe
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            product_id = request.data.get('product_id')
            amount = request.data.get('amount')  # în cenți
            email = request.data.get('email')
            product_name = request.data.get('product_name')

            if not all([product_id, amount, email]):
                return Response(
                    {"error": "Lipsesc date obligatorii"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validare sumă (minimum 0.50 EUR = 50 cenți)
            if amount < 50:
                return Response(
                    {"error": "Suma minimă este €0.50"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Crează Payment Intent
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="eur",
                metadata={
                    'product_id': product_id,
                    'product_name': product_name,
                    'user_id': request.user.id,
                    'username': request.user.username,
                }
            )

            return Response({
                'clientSecret': intent.client_secret,
                'paymentIntentId': intent.id
            }, status=status.HTTP_200_OK)

        except stripe.error.CardError as e:
            return Response(
                {"error": f"Eroare card: {e.user_message}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.RateLimitError:
            return Response(
                {"error": "Prea multe cereri. Încearcă din nou mai târziu."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        except stripe.error.InvalidRequestError:
            return Response(
                {"error": "Cerere invalidă"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.AuthenticationError:
            return Response(
                {"error": "Autentificare Stripe eșuată"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WebhookView(APIView):
    """
    POST /api/payments/webhook/
    Webhook pentru confirmare plăți Stripe
    """
    permission_classes = []

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError:
            return Response(
                {"error": "Payload invalid"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except stripe.error.SignatureVerificationError:
            return Response(
                {"error": "Semnătură invalidă"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Procesează evenimentele
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # Adaugă recompense utilizatorului
            handle_payment_success(payment_intent)

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            handle_payment_failure(payment_intent)

        return Response({'status': 'received'}, status=status.HTTP_200_OK)


def handle_payment_success(payment_intent):
    """Procesează plata reușită"""
    from accounts.models import User
    from django.db.models import F

    user_id = payment_intent['metadata'].get('user_id')
    product_id = payment_intent['metadata'].get('product_id')
    product_name = payment_intent['metadata'].get('product_name')

    try:
        user = User.objects.get(id=user_id)
        
        # Mapare produs -> recompense
        rewards = {
            1: {'diamonds': 200},  # Pachet Diamante
            2: {'coins': 500},      # Reîncărcare Inimi
            3: {'coins': 300},      # Boost Protecție
            4: {'coins': 150},      # Indiciu Premium
            5: {'diamonds': 150},   # Temă VIP
            6: {'diamonds': 500, 'coins': 500},  # Pachet Magie
        }

        reward = rewards.get(int(product_id), {})
        
        if 'diamonds' in reward:
            user.diamonds = F('diamonds') + reward['diamonds']
        if 'coins' in reward:
            user.coins = F('coins') + reward['coins']
        
        user.save()
        
        # Log tranzacție
        PaymentTransaction.objects.create(
            user=user,
            stripe_payment_intent_id=payment_intent['id'],
            amount=payment_intent['amount'] / 100,  # Convertire din cenți
            currency=payment_intent['currency'].upper(),
            product_name=product_name,
            status='success'
        )

    except User.DoesNotExist:
        pass


def handle_payment_failure(payment_intent):
    """Procesează plata eșuată"""
    from accounts.models import PaymentTransaction
    
    PaymentTransaction.objects.create(
        stripe_payment_intent_id=payment_intent['id'],
        amount=payment_intent['amount'] / 100,
        currency=payment_intent['currency'].upper(),
        status='failed'
    )


class PaymentTransactionView(APIView):
    """
    GET /api/payments/transactions/
    Obține istoricul tranzacțiilor utilizatorului
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from accounts.models import PaymentTransaction
        
        transactions = PaymentTransaction.objects.filter(
            user=request.user
        ).order_by('-created_at')
        
        data = [{
            'id': t.id,
            'amount': t.amount,
            'currency': t.currency,
            'product_name': t.product_name,
            'status': t.status,
            'created_at': t.created_at.isoformat()
        } for t in transactions]
        
        return Response(data, status=status.HTTP_200_OK)
