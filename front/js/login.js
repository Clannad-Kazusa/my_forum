/**
 * Created by python on 18-10-9.
 */

var host = "http://127.0.0.1:8000/";
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
        alert("用户名或密码错误")
    })
};

$(function () {
    var user_id = sessionStorage.user_id || localStorage.user_id;
    var username = sessionStorage.username || localStorage.username;
    $(".login_form").submit(function (e){
        e.preventDefault();
        alert(12);
        user_login();
    })
});


