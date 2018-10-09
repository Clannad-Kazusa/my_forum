# _*_ coding: utf-8 _*_
# @File : serializers.py
# @Author : Xa_ier
# @time : 18-10-9 下午8:18
import re
from django_redis import get_redis_connection
from rest_framework import serializers
from .models import User


# serializers.ModelSerializer　　　
# serializers.Serializer

class RegisterUserSerializer(serializers.ModelSerializer):
    # 短信字段 如何生成???请求参数有６个
    # 用户名,密码,手机号 ：模型类只储存有这三种
    # 确认密码,短信,是否同意协议：我们需要添加的
    password2 = serializers.CharField(label='确认密码',write_only=1,allow_blank=0,allow_null=0)
    allow = serializers.CharField(label='是否同意协议',write_only=1,allow_blank=0,allow_null=0)
    # 后端生成的一个token，只读
    token = serializers.CharField(label='token',read_only=1)

    class Meta:
        model = User
        # 因为 ModelSerializer 是根据 fileds字段来生成 序列化的字段的,
        # 首先先看模型中是否有对应的字段,如果有自动生成
        # 如果没有 看我们自己是否实现了,如果没有实现就报错了
        fields = ['username','password','mobile','sms_code','password2','allow','token']
        extra_kwargs = {
            'username':{
                'min_length':5,
                'max_length':20,
                'error_messages':{
                    'min_length':'仅允许5-20个字符的用户名',
                    'max_length':'仅允许5-20个字符的用户名',
                }
            },
            'password':{
                'write_only':True,
                'min_length': 8,
                'max_length': 20,
                'error_messages': {
                    'min_length': '仅允许8-20个字符的用户名',
                    'max_length': '仅允许8-20个字符的用户名',
                }
            }
        }

    # 对数据的校验 有 4中方式
        # 1. 字段类型
        # 2. 选项
        # 3. 单个字段校验 , 单个字段的值我们可以实现 验证    def validate_filename
        # 4. 多个字段校验
    def validate_mobile(self,value):
        if not re.match('1[3-9]\d{9}',value):
            raise serializers.ValidationError('手机号码格式不对')
        return value

    def validate_allow(self,value):
        if value != 'true':
            raise serializers.ValidationError('没有同意协议')
        return value

    def validate(self, attrs):
        # 密码和确认密码需要多个字段比较
        password = attrs.get('password')
        password2 = attrs.get('password2')

        if password != password2:
            raise serializers.ValidationError('密码不一致')

        return attrs

    # 当序列化器调用 save方法的时候 会自动调用 序列化器中的 create方法,将数据保存到数据库中
    def create(self, validated_data):
        # User.objects.create(**validated_data)
        # validated_data为校验之后的数据
        # 父类方法不能满足我们的需求，所以我们要重写他
        # 因为validated_data中有６个字段，实际入库的只要３个，所以最终我们需要将多余的字段删除
        del validated_data['allow']
        del validated_data['password2']

        # 处理完后就可以入库了
        user = super().create(validated_data)

        # 这个时候user的密码还是明文，所以要加密,
        user.set_password(validated_data['password'])
        user.save()

        # 这里是 数据入库,并且修改密码的地方,我们生成一个token,然后再把token经过序列化返回给客户端
        # jwt 的token如何生成呢?

        from rest_framework_jwt.settings import api_settings
        #　需要两个方法
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        # 将用户的信息放到payload中
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        # token就是生成好的jwt_token:给字段token赋值
        user.token = token

        return user


class UserInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id','username','mobile','email','email_active')













