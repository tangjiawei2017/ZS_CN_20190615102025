$(function() {
	$(".order-error-btn").click(function() {
		window.location.href = "/index.html";
	});
	$(".paytype-ul li").click(
			function() {
				if ($(this).find(".ok-img:visible").length == 0) {
					$(this).find(".img-div").hide().siblings(".ok-img").show();
					$(this).siblings().find(".img-div").show().siblings(
							".ok-img").hide();
				}
			});
	$(".submit").click(function() {
		var form = document.getElementById("payform");
		var ctx = $.trim($("input[name='ctx']").val());
		if ($("ul.paytype-ul li.wechatpay .ok-img:visible").length > 0) {
			form.action = ctx + "/pay/wechatPay.action";
			form.submit();
		} else if ($("ul.paytype-ul li.alipay .ok-img:visible").length > 0) {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') != -1) {
			var gotoUrl=ctx + "/pay/alipay.action?orderId="+$("input[name='orderId']").val();
			_AP.pay(gotoUrl);
		  }else{
			  form.action = ctx + "/pay/alipay.action";
			  form.submit();  
		  }
		}
	});
	$(".shop-again-btn").click(function() {
		window.location.href = "/index.html";
	});
});

function orderdetail(obj) {
	window.location.href = "/order/detail.action?orderId=" + $(obj).data("id");
}