var host = "http://127.0.0.1:8000/";
var sending_flag = false;
var error_name = false;
function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

var user_login = function(){
    const params = {
        "username": $("#username").val(),
        "password": $("#password").val()
    };
    $.ajax({

        type:"post",
        url:host +'users/auths/',
        contentType: "application/json",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        // 跨域
        xhrFields: {withCredentials: true},
        data: JSON.stringify(params),

    })
    .done(function (response) {

            sessionStorage.clear();
            localStorage.clear();
            // localStorage.token = response.data.token;
            if($("#brand1").val()){
                localStorage.username = response.username;
                localStorage.user_id = response.user_id;
            }
            else {
                sessionStorage.username = response.username;
                sessionStorage.user_id = response.user_id;
            }
            location.href = '/index.html';
        })
    .fail(function (response) {
    	console.log()
        alert("用户名或密码错误")
    })
};


var send_email = function () {
    // if(sending_flag == true){
    //     return;
    // }
    // if (error_name == true) {
    //     sending_flag = false;
    //     return;
    // }

    var num = 60;
    var t = setInterval(function(){
        if (num == 1)
        {
            // 如果计时器到最后, 清除计时器对象
            clearInterval(t);
            sending_flag = false;
            // 将点击获取验证码的按钮展示的文本回复成原始文本
            // $('#sendsms').text('发送');
        }
        else {
            sending_flag = true;
            num -= 1;
            console.log(num+'秒');
            // 展示倒计时信息
            // $('#sendsms').text(num + '秒');
        }
    },1000, 60);
};

$(function(){
	var stuList = getStuList();
	//聚焦失焦input
	$('input').eq(0).focus(function(){
		if($(this).val().length==0){
			$(this).parent().next("div").text("支持中文，字母，数字，'-'，'_'的多种组合");
		}
	});
	$('input').eq(1).focus(function(){
		if($(this).val().length==0){
		    $(this).parent().next("div").text("输入你的绅士通关密码");
		}
	});
	// $('input').eq(2).focus(function(){
	// 	if($(this).val().length==0){
	// 		$(this).parent().next("div").text("请再次输入密码");
	// 	}
	// })

	$('input').eq(2).focus(function(){
		if($(this).val().length==0){
			$(this).parent().next().next("div").text("看不清？点击图片更换验证码");
		}else{
			$(this).parent().next("div").text("");
		}
	})
	//input各种判断
	//用户名：
	$('input').eq(0).blur(function(){
		if($(this).val().length==0){
			$(this).parent().next("div").text("");
			$(this).parent().next("div").css("color",'#ccc');
		}else{
			$(this).parent().next("div").text("");
		}
		// else if($(this).val().length>0 && $(this).val().length<4){
		// 	$(this).parent().next("div").text("长度只能在4-20个字符之间");
		// 	$(this).parent().next("div").css("color",'red');
		// }
			// else if($(this).val().length>=4&& !isNaN($(this).val())){
		// 	$(this).parent().next("div").text("用户名不能为纯数字");
		// 	$(this).parent().next("div").css("color",'red');
		// }
	})
	//密码
	$('input').eq(1).blur(function(){
		if($(this).val().length==0){
			$(this).parent().next("div").text("");
			$(this).parent().next("div").css("color",'#ccc');
		}else{
			$(this).parent().next("div").text("");
		}
	})
	// 确认密码
	$('input').eq(2).blur(function(){
		if($(this).val().length==0){
			$(this).parent().next("div").text("");
			$(this).parent().next("div").css("color",'#ccc');
		}else if($(this).val()!=$('input').eq(1).val()){
			$(this).parent().next("div").text("两次密码不匹配");
			$(this).parent().next("div").css("color",'red');
		}else{
			$(this).parent().next("div").text("");
		}
	})

// 	验证码
//	 验证码刷新
	function code(){
		var str="qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPLKJHGFDSAZXCVBNM";
		var str1=0;
		for(var i=0; i<4;i++){
			str1+=str.charAt(Math.floor(Math.random()*62))
		}
		str1=str1.substring(1)
		$("#code").text(str1);
	}
	code();
	$("#code").click(code);
//	验证码验证
	$('input').eq(2).blur(function(){
		if($(this).val().length==0){
			$(this).parent().next().next("div").text("");
			$(this).parent().next().next("div").css("color",'#ccc');
		}else if($(this).val().toUpperCase()!=$("#code").text().toUpperCase()){
			$(this).parent().next().next("div").text("验证码不正确");
			$(this).parent().next().next("div").css("color",'red');
		}else{
			$(this).parent().next().next("div").text("");
		}
	})
//	提交按钮
	$("#submit_btn").click(function(e){
		for(var j=0 ;j<4;j++){
			if($('input').eq(j).val().length==0){
				$('input').eq(j).focus();
				// if(j==3){
				// 	$('input').eq(j).parent().next().next("div").text("此处不能为空");
				// 	$('input').eq(j).parent().next().next("div").css("color",'red');
				// 	e.preventDefault();
				// 	return;
				// }
				$('input').eq(j).parent().next(".tips").text("此处不能为空");
				$('input').eq(j).parent().next(".tips").css("color",'red');
				e.preventDefault();
				return;
			}
			else{
				$('input').eq(j).parent().next(".tips").text("");
			}
		}
		//协议
		if($("#xieyi")[0].checked){
			//向变量stuList数组添加一个数值，数值内部格式Student(name,password,tel,id)
			//发送用户信息
			//$("form").submit();
			e.preventDefault();
			user_login();

		}else{
			$("#xieyi").next().next().next(".tips").text("请勾选协议");
			$("#xieyi").next().next().next(".tips").css("color",'red');
			e.preventDefault();
			return;
		}
	})

//  建立构造函数，构造学生信息模板
	function Student(name,password,tel,id){
         this.name = name;
         this.password = password;
         this.tel = tel;
         this.id = id;
     }
//	获取之前所有已经注册的用户集合
	function getStuList(){
	    var list = localStorage.getItem('stuList');
	    if(list != null){
	        return JSON.parse(list);
	    }else{
	        return new Array();
	    }
	}

});
