# _*_ coding: utf-8 _*_
# @File : users.py
# @Author : Xa_ier
# @time : 18-10-9 下午8:48



def jwt_response_payload_handler(token, user=None, request=None):
    """
    自定义jwt认证成功返回数据
    """
    return {
        'token': token,
        'user_id': user.id,
        'username': user.username
    }

import re
from users.models import User
from django.contrib.auth.backends import ModelBackend

def get_user_by_account(account):

    try:
        if re.match(r'1[345789]\d{9}',account):
            user = User.objects.get(mobile=account)
        else:
            user = User.objects.get(username=account)
    except User.DoesNotExist:
        user = None

    return user


class UsernameMobileAuthBackend(ModelBackend):
    """
    自定义用户名或手机号认证
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        user = get_user_by_account(username)
        if user is not None and user.check_password(password):
            return user