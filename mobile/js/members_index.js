$(function() {
		//请求购物数据
		appAjaxWithToken("/api/v1/cart/readCartAmount",'',function(result) {
				if (result.data == 0) {
					$("#amount").parent().hide().next("img").show();
				} else {
					$("#amount").parent().show().next("img").hide();
				}
				$("#amount").html(result.data);
			});
        appAjaxWithToken("/api/v1/customer/checkCustomerIsLogin",'',function(result) {
				if(result.code==0){
					var customer= result.data;
					if(customer.imagePath!=null && customer.imagePath!=''){
						$(".customer-hasLogin .top img").attr("src",customer.imagePath);
					}
					$(".customer-hasLogin .account").html(customer.account);
					$(".customer-nologin").hide();
					$(".customer-hasLogin").show(); 
                }
			});
		});
	function tologin() {
		window.location.href = "members_login.html";
	}
