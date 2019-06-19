var returnUrl='';
getVerifyCode();
$(function() {
	var  $input = $("input[name='returnUrl']"), href = window.location.href;
	//初始化数据
	appAjax("/api/v1/customer/loginInit",'',function(result){
			if(result.code==0){
				if(result.data.isWeChat){
					$(".cooperation").show();
				}
			}
	});
	if ($input.val() == '') {
		if (href.indexOf("returnUrl") == -1) {
			returnUrl = "members_index.html";
		} else {
			returnUrl = window.location.href.substring(window.location.href
							.indexOf("returnUrl") + 10,
							window.location.href.length);
		}
		$input.val(returnUrl);
	}
	$(".login-save-btn").click(function() {
		var data={};
		data.account = $.trim($("input[name='account']").val());
		data.password = $.trim($("input[name='password']").val());
		data.captcha='';
		data.captchaToken = $.trim($("input[name='captchaToken']").val());
		if (data.account == "" || data.password == "") {
			// 提示
			layer.open({
				content : '用户名和密码不能为空!',
				skin : 'msg',
				time : 2
			// 2秒后自动关闭
			});
		} else {
			if ($("input[name='verifycode']:visible").length >= 1) {
				data.captcha = $("input[name='verifycode']:visible").val();
				if (data.captcha == "") {
					// 提示
					layer.open({
						content : '验证码不能为空!',
						skin : 'msg',
						time : 2
					});
					return;
				} 
			}
			appAjax("/api/v1/customer/checkLogin",data,function(result){
          if(result.code==0){
						if(result.data.success){
							    var href=returnUrl==''?'members_index.html':returnUrl;
								window.location.href=href; 
								window.localStorage.token = result.data.token;
						}else{
							if(result.data.loginError=="verifyCodeError"){
										dialog('验证码不正确!');
									}else if(result.data.loginError=="accountError"){
									dialog('用户名不存在!');
									}else if(result.data.loginError=="passwordError"){
									dialog('密码不正确,请重新输入!');
									}else if(result.data.loginError=="accountStop"){
									dialog('该账号已被停用,请联系管理员!');
									}else if(result.data.loginError=="systemError"){
									dialog('系统错误,请联系管理员!');
									}
									getVerifyCode();
							}
						}
				});
		}
	});
	$(".login-save-bind-btn").click(function() {
		var data={};
		data.account = $.trim($("input[name='account']").val());
		data.password = $.trim($("input[name='password']").val());
		data.verifycode='';
		if (data.account == "" || data.password == "") {
			// 提示
			layer.open({
				content : '用户名和密码不能为空!',
				skin : 'msg',
				time : 2
			// 2秒后自动关闭
			});
		} else {
			if ($("input[name='verifycode']:visible").length >= 1) {
				data.verifycode = $("input[name='verifycode']:visible").val();
				if (data.verifycode == "") {
					// 提示
					layer.open({
						content : '验证码不能为空!',
						skin : 'msg',
						time : 2
					});
					return;
				} 
			}
			$.ajax({
			   url:"/weixin/checkBindLogin.action",
			   type:"post",
			   data:data,
			   dataType:"json",
			   success:function(result){
						if(result.success){
							    var href=returnUrl==''?'members_index.html':returnUrl;
								window.location.href=href; 
						}else{
             if(result.loginError=="verifyCodeError"){
									dialog('验证码不正确!');
						  }else if(result.loginError=="accountError"){
							    dialog('用户名不存在!');
						  }else if(result.loginError=="passwordError"){
							    dialog('密码不正确,请重新输入!');
						  }else if(result.loginError=="accountStop"){
							    dialog('该账号已被停用,请联系管理员!');
						  }else if(result.loginError=="isNotWx"){
							    dialog('请用微信浏览器打开!');
							    setTimeout("forward()", 1500);
						  }else if(result.loginError=="authorizationFail"){
							    dialog('微信授权失败!');
							}
							
						}
				}
			});
		}
	});
	// 微信合作登录
	$("#cooperationWX").click(function() {
		window.location.href = "/weixin/weChatLogin.action?returnUrl="+returnUrl;
	});
	$(".login-save-btn2").click(function() {
	  	$.ajax({
					url:"/weixin/wxLoginToCustomer.action",
					type:"post",
					dataType:"json",
					success:function(result){
								if(result.success){
									var href=returnUrl==''?'members_index.html':returnUrl;
									window.location.href=href; 
						   	}else{
										if(result.loginError=="isNotWx"){
													dialog('请用微信浏览器打开!');
													setTimeout("forward()", 1500);
										}else if(result.loginError=="authorizationFail"){
												dialog('微信授权失败!');
										}
				       	}
	       	}
	  	});
	});
});
function forward(){
	window.location.href='members_login.htm';
}
function dialog(errorMsg) {
	layer.open({
		content : errorMsg,
		skin : 'msg',
		time : 2
	// 2秒后自动关闭
	});
}
function back() {
	if(returnUrl!=''){
		window.location.href = returnUrl;
	}else{
		window.location.href = "members_login.htm";
	}
	
}
//判断是否是微信浏览器的函数
function isWeiXin(){
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      	return true;
	}else{
	    return false;
	}
}
function getVerifyCode(){
	//加载验证码
	appAjax("/api/common/captcha",'',function(result){
		if(result.code==0){
				$("#verifycode").attr("src",result.data.captcha);
				$("input[name='captchaToken']").val(result.data.captcha_token);
		}
	});
}