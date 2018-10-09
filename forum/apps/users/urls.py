# _*_ coding: utf-8 _*_
# @File : url.py
# @Author : Xa_ier
# @time : 18-10-9 下午8:25
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from . import views

urlpatterns = [
    #/users/usernames/(?P<username>\w{5,20})/count/
    url(r'^usernames/(?P<username>\w{5,20})/count/$',views.RegisterUsernameCountAPIView.as_view()),
    url(r'^phones/(?P<mobile>1[345789]\d{9})/count/$',views.RegisterPhoneCountAPIView.as_view()),
    url(r'auths/', obtain_jwt_token, name='auths'),
]