# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractUser
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer,BadData
from django.conf import settings


# Create your models here.
class User(AbstractUser):
    """用户模型类"""

    mobile = models.CharField(max_length=11,unique=1,verbose_name='手机号')
    email_active = models.BooleanField(default=0,verbose_name='邮箱验证状态')
    default_address = models.ForeignKey('Address', related_name='users', null=True, blank=True,
                                        on_delete=models.SET_NULL, verbose_name='默认地址')

    class Meta:
        # 配置相关信息
        db_table = 'tb_users'
        verbose_name = '用户'
        verbose_name_plural = verbose_name

    # 创建一个加密方法，将用户id和email加密后生成token发送给前端
    def generic_verify_url(self):

        #需要将ＩＤ进行处理，同时生成一个url:http://xxxx?token=xxx
        serializer = Serializer(settings.SECRET_KEY,3600)
        # 为了查询和准备，我们可以添加更多的信息
        token = serializer.dumps({'id':self.id,'email':self.email})
        return  'http://www.meiduo.site:8080/success_verify_email.html?token=' + token.decode()

    @staticmethod
    def generic_user_info(token):

        serializer = Serializer(settings.SECRET_KEY,3600)
        try:
            result = serializer.loads(token)
            # 解出来的是{'id':self.id,'email':self.email}
        except BadData:
            return None
        else:
            # 根据id　查询用户信息，多加一个条件为了让查询更准确
            id = result.get('id')
            email = result.get('email')
            # select * from user where id=xxx and email=xxx
            # 只通过一个id也可以查询用户信息，多加　一个条件为了让查询更准确
            try:
                user = User.objects.get(id=id,email=email)
            except User.DoesNotExist:
                return None
            else:
                return user
