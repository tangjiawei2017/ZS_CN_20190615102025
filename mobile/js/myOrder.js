$(function() {
	// 初始化数据
	requestOrderAjax($(".order_card_box div:visible"));
	$(".order_card li span").click(function() {
		if (!$(this).is(".currentCard")) {
			$(".order_card li span").removeClass("currentCard");
			$(this).addClass("currentCard");
			requestOrderAjax($("." + $(this).data("class")));
		}
	});
	// 事件动态绑定
	$("body").on("click", ".order-box", function() {
		var orderId = $(this).find("input[name='orderId']").val();
		window.location.href = "/order_detail/&orderId=" + orderId + ".html";
	});
	$("body").on("click",".order-oper-botton button",function(event) {
		// 阻止事件冒泡
		event.stopPropagation();
		var button = $(this).data("button");
		var orderId = $(this).parents(".order-box").children(
				"input[name='orderId']").val();
		if (button == 'paybtn') {
			window.location.href = "/order/pay.action?orderId=" + orderId;
		} else if (button == 'cancelbtn') {
			layer.open({
				content : '真的要取消订单么？',
				btn : [ '确定', '取消' ],
				yes : function(index) {
					$.ajax({
						url : "/order/orderCancel.action",
						type : "post",
						data : {
							orderId : orderId
						},
						dataType : "json",
						success : function(data) {
							if (data.result == "success") {
								requestOrderAjax($(".order_waitpay"));
								layer.open({
									content : '订单取消成功',
									skin : 'msg',
									time : 2
								});
								layer.close(index);
							}
						}
					});
				}
			});
		}else if(button=="logisticsbtn"){
			window.location.href = "/order/logistics.action?orderId=" + orderId;
		}else if(button=="evaluatebtn"){
			window.location.href="/review/list.action?orderId=" + orderId;
		}else if(button=="confirmbtn"){
			window.location.href="/order/confirmOrder.action?orderId=" + orderId;
			layer.open({
				content : '确认收货成功!',
				skin : 'msg',
				time : 2
			});
		}else if(button == "payagainbtn"){
			window.location.href="/order/buyAgain.action?orderId=" + orderId;
		}
	});
});
function requestOrderAjax($obj) {
	var cls = $obj.attr("class");
	var status = cls.substring(cls.indexOf("_") + 1, cls.length);
	$.ajax({
		url : "/order/requestMyOrderAjax.action",
		type : "post",
		data : {
			status : status
		},
		success : function(result) {
			$obj.html(result);
			$obj.show().siblings("div").hide();
		}
	});
}