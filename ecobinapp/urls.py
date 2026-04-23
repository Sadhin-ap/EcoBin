from django.urls import path
from . import views

urlpatterns=[

    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('booking/', views.booking, name='booking'),
    path("create-order/", views.create_order),
]