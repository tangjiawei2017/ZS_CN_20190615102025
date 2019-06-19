	$(function() {
	  appAjaxWithToken("/api/v1/cart/myCart",
			'',function(result) {
				if(result.code==0 && result.data!=null){
					var checkAll=true;
					var total=0;
					var cartVo= result.data.cartVo;
					for(var i=0;i<cartVo.length;i++){
						 var $li='<li class="li border-b bg-color-white flex-box"><input type="checkbox" name="ck" class="checkbox"';
						  if(cartVo[i].checked){
							  $li = $li +" checked";
						  }else{
							checkAll=false;  
						  }
						  total = total + Number(cartVo[i].price*cartVo[i].quantity);
						  $li =$li +' ><img src="'+cartVo[i].imgPath+'">'
							  +'<div class="flex-box-grow1 flex-box-direction-column cart-product-msg"><div class="fs24 flex-box-grow1">'
							  +cartVo[i].name+'</div>';
						  if(cartVo[i].spec0!=null || cartVo[i].spec1!=null || cartVo[i].spec2!=null ){
							   $li = $li +'<div class="fs22 fc-9 flex-box-grow1">规格:';
							   if(cartVo[i].spec0!=null){
								   $li =$li +cartVo[i].spec0+'&nbsp;&nbsp;&nbsp;';
							   }
							   if(cartVo[i].spec1!=null){
								   $li =$li +cartVo[i].spec1+'&nbsp;&nbsp;&nbsp;';
							    }
							   if(cartVo[i].spec2!=null){
								    $li =$li +cartVo[i].spec2;
								}
								$li = $li +'</div>';   
						  }
						  $li = $li +'<div class="flex-box flex-box-grow1 pmsg"><strong class="fs24 fc-red">￥<i>'+cartVo[i].price.toFixed(2)
							  +'</i></strong><div class="product-buy-count flex-box flex-box-grow1 flex-box-justify-content-end">'
							  +'<a class="minus border-ccc" href="javascript:void(0)"> <em class="prev"></em> </a> <input name="count" class="icount" '
							  +'value="'+cartVo[i].quantity+'" type="text"> <input type="hidden" name="proItemId" value="'
							  + cartVo[i].proItemId+'" /> <a class="plus border-ccc" href="javascript:void(0)"> <em class="next"></em></a></div></div></div></li>';
							 
							  $(".cart_empty").hide();
							  $(".cart_product_ul").append($li);
							  if(checkAll){
								  $("input[name='allselect']").attr("checked",true);
							  }
							  $(".total-price strong i").html(total.toFixed(2));
							  $(".go-balance span").html(result.data.quantity);
						      $(".cart-calculate").show();
					 }
					 
				}
			});

		//请求购物数据
		appAjaxWithToken("/api/v1/cart/readCartAmount",'',function(result) {
				if (result.code == 0) {
					$("#amount").parent().show().next("img").hide();
				} else {
					$("#amount").parent().hide().next("img").show();
				}
				$("#amount").html(result.data);
		});

		$(".minus,.plus").click(function() {
			var count = parseInt($(this).siblings(".icount").val());
			if ($(this).is(".minus")) {
				if (count == 1) {
			      appAjaxWithToken("/api/v1/cart/updateCart",
					   {operType:"delProItem",proItemId:$.trim($(this).siblings(
						"input[name='proItemId']").val())},function(data){
							document.location.reload();//当前页面 
						});
          return;
				}else{
					count--;
				} 
			    $(this).siblings(".icount").val(count);
			} else if ($(this).is(".plus")) {
				count++;
				$(this).siblings(".icount").val(count);
			}
			$(this).parents(".cart-product-msg").siblings(
					"input[name='ck']").prop("checked", true);
			if (updateCart({
				operType : "updateCount",
				proItemId : $.trim($(this).siblings(
						"input[name='proItemId']").val()),
				count : $(this).siblings("input[name='count']").val()
			}) == "success") {
				refreshSelectProductTotal();
				setCheckAllStatus();
				refreshCartAmount();
			}
		});
		//数量失去焦点判断
		$("input[name='count']").blur(
				function() {
					if (!isPositiveInteger($(this).val())) {
						$(this).val(1);
					}
					$(this).parents(".cart-product-msg").siblings(
							"input[name='ck']").prop("checked", true);
					if (updateCart({
						operType : "updateCount",
						proItemId : $(this).siblings("input[name='proItemId']")
								.val(),
						count : $(this).val()
					}) == "success") {
						refreshSelectProductTotal();
						setCheckAllStatus();
						refreshCartAmount();
					}
				});
		//单选货品
		$("input[name='ck']").click(
				function() {
					if (updateCart({
						operType : "checkSingle",
						checkType : this.checked ? "yes" : "no",
						proItemId : $.trim($(this)
								.siblings(".cart-product-msg").find(
										"input[name='proItemId']").val())
					}) == "success") {
						refreshSelectProductTotal();
						setCheckAllStatus();
					}
				});
		//全选单击
		$("input[name='allselect']").click(function() {
			if (this.checked) {
				$("input[name='ck']").prop("checked", true);
				if (updateCart({
					operType : "checkAll",
					checkType : "yes"
				}) == "success") {
					refreshSelectProductTotal();
				}
			} else {
				if (updateCart({
					operType : "checkAll",
					checkType : "no"
				}) == "success") {
					$("input[name='ck']").prop("checked", false);
					$(".total-price i").html("0.00");
					$(".go-balance span").html("(0)");
				}
			}
		});
		//去结算
		$(".go-balance").click(function(){
		    appAjaxWithToken("/api/v1/cart/goBalance",
			   '',function(result){
				    if(result.code==0){
						var data = result.data;
						if(data.result=="noLogin"){
							window.location.href="members_login.html?returnUrl=/order/checkout.action";
						}else if(data.result=="hasLogin"){
							if(data.canBalance==0){
								//提示
								layer.open({
									content: '您还没有选择商品哦!'
									,skin: 'msg'
									,time: 2 //2秒后自动关闭
								});
							}else if(data.canBalance==1){
								window.location.href="/order/checkout.action";
							}
					    }
					}
         });
		});
	});
	//是否全选判断
	function setCheckAllStatus() {
		if ($("input[name='ck']:checked").length < $("input[name='ck']").length) {
			$("input[name='allselect']").prop("checked", false);
		} else if ($("input[name='ck']:checked").length == $("input[name='ck']").length) {
			$("input[name='allselect']").prop("checked", true);
		}
	}

	//是否为正整数
	function isPositiveInteger(s) {
		var re = /^[1-9][0-9]*$/;
		return re.test(s)
	}

	//更新购物车
	function updateCart(data) {
		var result = '';
		appAjaxWithToken("/api/v1/cart/updateCart",data,function(msg) {
				result = msg;
		});
		return result;
	}
	//刷新购物车已选择商品金额，数量
	function refreshSelectProductTotal() {
		var account = Number(0);
		var total = Number(0.00);
		$(".pmsg").each(
				function() {
					if ($(this).parent().siblings("input[name=ck]").is(
							":checked")) {
						var count = Number($(this).find(".icount").val());
						var price = Number(
								$.trim($(this).find("strong i").html()))
								.toFixed(2);
						account = account + count;
						total = total + price * count;
					}
				});
		$(".total-price i").html(total.toFixed(2));
		$(".go-balance span").html("(" + account + ")");
	}
	//计算购物车数量,改变单个货品数量时重新计算
	function refreshCartAmount() {
		var account = Number(0);
		$(".pmsg").each(function() {
			var count = Number($(this).find(".icount").val());
			account = account + count;
		});
		$("#amount").html(account);
	}