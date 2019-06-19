$(function() {
	$(".advise-save-btn").click(function() {
		var content = $.trim($(".advise-content textarea[name='content']").val());
		var phone = $.trim($("input[name='phone']").val());
		if (content == "") {
			layer.open({
				content : "反馈内容不能为空!",
				skin : 'msg',
				time : 2
			//2秒后自动关闭
			});
			return false;
		} else {
			if (phone == '' || !checkPhone(phone)) {
				layer.open({
					content : "手机号格式不正确!",
					skin : 'msg',
					time : 2
				//2秒后自动关闭
				});
				return false;
			}
			$.ajax({
				url : "/advise/addAdviese.action",
				type : "post",
				data : {
					content : content,
					phone : phone
				},
				dataType : "json",
				success : function(data) {
					if (data.result == "success") {
						layer.open({
							content : "提交成功",
							skin : 'msg',
							time : 2
						//2秒后自动关闭
						});
						$(".advise-content textarea[name='content']")
								.val("");
					} else {
						layer.open({
							content : "提交失败",
							skin : 'msg',
							time : 2
						//2秒后自动关闭
						});
					}
				}
			});
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