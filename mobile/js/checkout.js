var Checkout = {
	onlinePay : false,
	goodspay : false,
	goodsmintotal : 0,
	goodsdecrtotal : 0,
	onlinemintotal : 0,
	onlinedecrtotal : 0,
	ptotal : 0,
	paytype : 0,
	shiptypelength : 0,
	areaCostType : 1,
	freight : 0,
	payshipMintotal : 0,
	shipTimeType : 0,
	sendNow : 0,
	sendMinTime : '',
	canReserveDay : 0,
	count : 0,
	shipTimelength : 0,
	maxHeight : 0,
	complexShipTimeUrl:'',
	initView : function() {
		// 支付方式初始化
		Checkout.paytype = parseInt($("input[name='paytypecode']").val());
		Checkout.onlinePay = $("input[name='onlinePay']").val() == 1 ? true
				: false;
		Checkout.goodspay = $("input[name='goodspay']").val() == 1 ? true
				: false;
		Checkout.goodsmintotal = parseFloat($("input[name='goodsmintotal'")
				.val());
		Checkout.goodsdecrtotal = parseFloat($("input[name='goodsdecrtotal'")
				.val());
		Checkout.onlinemintotal = parseFloat($("input[name='onlinemintotal'")
				.val());
		Checkout.onlinedecrtotal = parseFloat($("input[name='onlinedecrtotal")
				.val());
		Checkout.ptotal = parseFloat($("input[name='ptotal']").val());
		Checkout.shiptypelength = parseFloat($("input[name='shiptypelength']")
				.val());
		Checkout.shipTimeType = parseInt($("input[name='shipTimeType']").val());
		Checkout.sendNow = parseInt($("input[name='sendNow']").val());
		Checkout.sendMinTime = $("input[name='sendMinTime']").val();
		Checkout.canReserveDay = parseInt($("input[name='canReserveDay']")
				.val());
		Checkout.count = parseInt($("input[name='count']").val());
		Checkout.shipTimelength = parseInt($("input[name='shipTimelength']")
				.val());
		Checkout.maxHeight=parseInt($("input[name='maxHeight']").val());
		Checkout.complexShipTimeUrl=$("input[name='complexShipTimeUrl']").val();
		$("li.order-paytype .order-paytype-content").html(
				Checkout.paytype == 0 ? "在线支付" : "货到付款");
		if (Checkout.onlinePay == false || Checkout.goodspay == false) {
			Checkout.removeMoreIcon($(".order-paytype"));
		}
		Checkout.setPromotionPrice();
		$(".order-paytype").click(Checkout.payTypeClick);
		// 配送方式初始化
		var $li = $(".order-shiptype ul li:eq(0)");
		$(".order-shiptype .order-shiptype-content").html($li.html());
		var array = $li.data("value").split(",");
		$("input[name='shipTypeid']").val(parseInt(array[0]));
		Checkout.areaCostType = parseInt(array[1]);
		Checkout.freight = parseFloat(array[2]);
		Checkout.payshipMintotal = (array[3] == '') ? 0 : parseFloat(array[3]);
		Checkout.setSendPrice();
		if (Checkout.shiptypelength <= 1) {
			Checkout.removeMoreIcon($(".order-shiptype"));
		}
		$(".order-shiptype").click(Checkout.shipTypeClick);
		// 配送时间初始化
		if (Checkout.shipTimeType == 1) {
			$li = $(".order-shiptime ul li:eq(0)");
			$("input[name='shipTimeid']").val($li.data("id"));
			$(".order-shiptime .order-shiptime-content").html($li.html());
			$("input[name='shipTime']").val($li.html());
			if (Checkout.shipTimelength <= 1) {
				Checkout.removeMoreIcon($(".order-shiptime"));
			}
		} else if (Checkout.shipTimeType == 2) {
			if (Checkout.sendNow == 1) {
				$(".order-shiptime .order-shiptime-content").html("立即送出");
				$("input[name='shipTime']").val("立即送出");
			} else if (Checkout.sendMinTime != '') {
				$(".order-shiptime .order-shiptime-content").html(
						Checkout.sendMinTime);
				$("input[name='shipTime']").val(Checkout.sendMinTime);
			} else {
				$(".order-shiptime .order-shiptime-content").html("未选择")
						.addClass("fc-999");
			}
			// 配送时间段为0,或者为1(不可预约),去掉more图标
			if (Checkout.count == 0 || Checkout.count == 1
					&& Checkout.canReserveDay != 1) {
				Checkout.removeMoreIcon($(".order-shiptime"));
			}
		}
		$(".order-shiptime").click(Checkout.shipTimeClick);
		$(".order-beizhu").click(Checkout.remarkClick);
		Checkout.calculateTotalPrice();
	},
	payTypeClick : function() {
		if (Checkout.onlinePay && Checkout.goodspay) {
			layer.open({
				content : '支付方式',
				btn : [ '货到付款', '在线支付' ],
				skin : 'footer',
				yes : function(index) {
					layer.close(index);
					// 货到付款
					$(".order-paytype div").html("货到付款");
					$("input[name='paytypecode']").val(1);
					Checkout.paytype = 1;
					Checkout.setPromotionPrice(Checkout.paytype);
				},
				no : function(index) {
					layer.close(index);
					// 在线支付
					$(".order-paytype div").html("在线支付");
					$("input[name='paytypecode']").val(0);
					Checkout.paytype = 0;
					Checkout.setPromotionPrice();
				}
			});
		}
	},
	shipTypeClick : function() {
		layer.open({
			type : 1,
			content : $(".order-shiptype .order-paytype-dialog").html(),
			anim : 'up',
			style : 'position:fixed; bottom:0; left:0; width: 100%; height:'
					+ Checkout.shiptypelength * 0.68
					+ 'rem; padding:10px 0; border:none;'
		});
	},
	shipTimeClick : function() {
		if (Checkout.shipTimeType == 1) {
			layer.open({
						type : 1,
						content : $(".order-shiptime .order-shiptime-dialog").html(),
						anim : 'up',
						style : 'position:fixed; bottom:0; left:0; width: 100%; height:'
								+ Checkout.shipTimelength
								* 0.68
								+ 'rem; padding:10px 0; border:none;'
					});
		} else if (Checkout.shipTimeType == 2
				&& (Checkout.count > 1 || Checkout.count == 1
						&& Checkout.canReserveDay == 1)) {
			$.ajax({
				url : Checkout.complexShipTimeUrl,
				type : "POST",
				dataType : "html",
				async : true,
				success : function(content) {
					$('body').dialog(content, Checkout.maxHeight * 0.9);
				}
			});
			$("body").on("click",".category li",function() {
				if (!$(this).hasClass("on")) {
					$(this).addClass("on").siblings().removeClass("on");
					var index = $(".category li").index(this);
					$("ul.sendTime").eq(index).show().siblings().not("#category").hide();
				}
	        });
		}
	},
	remarkClick :function(){
		var remark=$("input[name='remark']").val();
		$("textarea[name='beizhu']").text(remark);
		layer.open({
			type : 1,
			content : $(".order-beizhu .beizhu").html(),
			anim : 'up',
			style : 'position:fixed; bottom:0; left:0; width: 100%; height:1.0rem;border:none;background:#fff;'
		});
	},
	chooseShipType : function(obj) {
		$(".order-shiptype div.order-shiptype-content").html($(obj).html());
		var array = $(obj).data("value").split(",");
		$("input[name='shipTypeid']").val(parseInt(array[0]));
		Checkout.areaCostType = parseInt(array[1]);
		Checkout.freight = parseFloat(array[2]);
		Checkout.payshipMintotal = (array[3] == '') ? 0 : parseFloat(array[3]);
		Checkout.setSendPrice();
		layer.closeAll();
	},
	chooseShipTime : function(obj) {
		$(".order-shiptime div.order-shiptime-content").html($(obj).html());
		$("input[name='shipTimeid']").val($(obj).data("id"));
		$("input[name='shipTime']").val($(obj).html());
		layer.closeAll();
	},
	updateOrderRemark : function(obj){
		var remark=$.trim($(obj).prev().val());
		$("input[name='remark']").val(remark);
		layer.closeAll();
		$("textarea[name='beizhu']").val(remark);
	},
	setPromotionPrice : function() {
		if (Checkout.paytype == 0) {
			if (Checkout.ptotal >= Checkout.onlinemintotal) {
				$(".order-promotion-price #proprice i").html(
						Checkout.onlinedecrtotal);
			} else {
				$(".order-promotion-price #proprice i").html(0);
			}
		} else if (Checkout.paytype == 1) {
			if (Checkout.ptotal > Checkout.goodsmintotal) {
				$(".order-promotion-price #proprice i").html(
						Checkout.goodsdecrtotal);
			} else {
				$(".order-promotion-price #proprice i").html(0);
			}
		}
		Checkout.calculateTotalPrice();
	},
	setSendPrice : function() {
		if (Checkout.areaCostType == 2
				&& Checkout.ptotal >= Checkout.payshipMintotal) {
			$("#sendprice i").html(0);
		} else {
			$("#sendprice i").html(Checkout.freight);
		}
		Checkout.calculateTotalPrice();
	},
	removeMoreIcon : function($obj) {
		$obj.append('<div class="img-div"></div>').children("img.more-icon")
				.remove();
	},
	calculateTotalPrice : function() {
		var sendprice = parseFloat($.trim($("#sendprice i").html()));
		var proprice = parseFloat($.trim($("#proprice i").html()));
		var total = Number(Checkout.ptotal + sendprice - proprice).toFixed(2);
		$(".total-price strong i").html(total > 0 ? total : 0);
		$("input[name='total']").val(total);
	},
	submitOrder : function(){
		$(".go-balance").unbind();
		if($.trim($(".order-shiptime .order-shiptime-content").html())=='' || $.trim($("input[name='shipTime']").val())==''){
			 layer.open({
				    content: '请选择配送时间'
				    ,skin: 'msg'
				    ,time: 2 
			 }); 
			 $(".go-balance").bind("click",Checkout.submitOrder());
			 return;
		}
		document.getElementById("orderForm").submit();    
	}
}