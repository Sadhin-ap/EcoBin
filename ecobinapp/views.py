import re

from django.contrib.auth.models import User
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required   
from .models import Booking


import razorpay
from django.conf import settings
from django.http import JsonResponse

@login_required
def booking(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        phone = request.POST.get('phone', '').strip()
        address = request.POST.get('address', '').strip()
        city = request.POST.get('city', '').strip()
        pincode = request.POST.get('pincode', '').strip()
        waste_types = request.POST.getlist('waste[]')
        weight = request.POST.get('weight', '')
        factory_id = request.POST.get('factory_id', '')
        pickup_date = request.POST.get('pickup_date', '')
        time_slot = request.POST.get('time_slot', '')
        notes = request.POST.get('notes', '')
        payment_method = request.POST.get('payment_method', '')

        if not full_name:
            messages.error(request, 'Please enter your full name.')
        elif not phone:
            messages.error(request, 'Please enter your phone number.')
        elif not address:
            messages.error(request, 'Please enter your pickup address.')
        elif not pickup_date:
            messages.error(request, 'Please select a pickup date.')
        elif not waste_types:
            messages.error(request, 'Please select at least one waste type.')
        elif not factory_id:
            messages.error(request, 'Please select a disposal factory.')
        else:
            booking_obj = Booking.objects.create(
                user=request.user,
                full_name=full_name,
                phone=phone,
                address=address,
                city=city,
                pincode=pincode,
                waste_types=waste_types,
                weight=weight,
                factory_id=factory_id,
                pickup_date=pickup_date,
                time_slot=time_slot,
                notes=notes,
                payment_method=payment_method,
            )

            return redirect('booking_confirm', booking_id=booking_obj.id)

    return render(request, 'booking.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid credentials')

    return render(request, 'login.html')


@login_required  
def home(request):
    return render(request, 'home.html')


def logout_view(request):
    logout(request)
    return redirect('login')



@login_required
def booking_confirm(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        messages.error(request, 'Booking not found.')
        return redirect('booking')

    return render(request, 'booking_confirm.html', {'booking': booking})


def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
        else:
            User.objects.create_user(username=username, password=password)
            messages.success(request, "Account created")
            return redirect('login')

    return render(request, 'register.html')


def create_order(request):
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    payment = client.order.create({
        "amount": 100 * 100,  # ₹100 test
        "currency": "INR",
        "payment_capture": 1
    })

    return JsonResponse({
        "order_id": payment["id"],
        "key": settings.RAZORPAY_KEY_ID,
        "amount": payment["amount"]
    })