$(function() {
		$(".register-save-btn").click(function() {
		var accountPattern=/^([A-Za-z0-9_\u4e00-\u9fa5]*[A-Za-z_\u4e00-\u9fa5]+[A-Za-z0-9_\u4e00-\u9fa5]*)$/;
		var data={};
		data.account = $.trim($("input[name='account']").val());
		data.cellphone = $.trim($("input[name='cellphone']").val());
		data.password = $("input[name='password']").val();
		var password2 = $("input[name='pwd2']").val();
		data.verifycode = $("input[name='verifycode']").val();
		if (data.account == '' || data.cellphone == '' || data.password == ''
				|| password2 == '' || data.verifycode=='') {
			layer.open({
				content : '用户名、手机号、密码、验证码不能为空!',
				skin : 'msg',
				time : 2
			//2秒后自动关闭
			});
		} else {
		    if(!accountPattern.exec(data.account)){
		     layer.open({
					content : '用户名,只能包括汉字、字母、数字、下划线，不能全为数字!',
					skin : 'msg',
					time : 2
				});  
		    }else if (data.password != password2) {
				layer.open({
					content : '两次输入的密码不一致!',
					skin : 'msg',
					time : 2
				});
				$("input[name='pwd2']").val('');
			} else if (data.password.length < 6) {
				layer.open({
					content : '密码最少为6位!',
					skin : 'msg',
					time : 2
				});
			} else if (checkPhone(data.cellphone)) {
				$.ajax({
					 url:"/customer/checkRegister.action",
					 method:"post",
					 data:data,
					 dataType:"json",
					 success:function(result){
						if(result.code=200){
							if(result.data.success){
									window.location.href='members_index.html'; 
							}else{
							  if(result.data.registerError=="verifyCodeError"){
									dialog('验证码不正确!');
									var src = $("#verifycode").attr("src");
									var random = Math.random();
									if (src != null && src.indexOf("?") > 0) {
										src = src.substring(0, src.indexOf("?") + 1) + random;
									} else {
										src = src + "?" + random;
									}
									$("#verifycode").attr("src", src);
							  }else if(result.data.registerError=="accountExistsError"){
								 dialog('该用户名已注册!');
							  }else if(result.data.registerError=="passwordError"){
								dialog('注册密码不能为空!');
							  }else if(result.data.registerError=="accountError"){
								dialog('用户名不合法!');
							  }else if(result.data.registerError=="phoneError"){
								dialog('该手机号已注册!');
							  } else if(result.data.registerError=="systemError"){
								dialog('系统错误,请联系管理员!');
							  }
							}
						}
					 }
				});
			}
		}
});
$("#verifycode").on({mouseover : function() {
	  $(this).css("cursor", "pointer");
},
click : function() {
		var src = $(this).attr("src");
		var random = Math.random();
		if (src != null && src.indexOf("?") > 0) {
			src = src.substring(0, src.indexOf("?") + 1) + random;
		} else {
			src = src + "?" + random;
		}
		$(this).attr("src", src);
			}
		});
});
//校验手机号码
function checkPhone(phone) {
	if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
	     layer.open({
		    content : '手机格式有误!',
		    skin : 'msg',
				time : 2
			});
			return false;
		}
	return true;
}
//ajax校验
function ajax(url, data, errorMsg) {
	$.ajax({
		url : url,
		data : data,
		async : true,
		success : function(msg) {
			var result = JSON.parse(msg);
			if (result.result = "fail") {
		layer.open({
			content : errorMsg,
			skin : 'msg',
			time : 2
		});
		return false;
	} else if (result.result = "success") {
				return true;
			}
		}
	});
	return false;
}
function dialog(errorMsg) {
	layer.open({
		content : errorMsg,
		skin : 'msg',
        time : 2
	});
}