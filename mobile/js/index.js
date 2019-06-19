$(document).ready(function() {
	var mySwiper = new Swiper('.swiper-container', {
		speed : 300,
		autoplay : 2000,
		autoplayDisableOnInteraction : false,
		grabCursor : true,
		pagination : '.swiper-pagination',
	});
	// 请求网站标题
	appAjax("/api/v1/site/get",'',function(result){
		if (result.code ==0) {
			$(document).attr("title", result.data.siteName);
		}
	});
	//请求购物数据
	appAjaxWithToken("/api/v1/cart/readCartAmount",'',function(result){
		if (result.code == 0) {
			$("#amount").parent().show().next("img").hide();
		} else {
			$("#amount").parent().hide().next("img").show();
		}
		$("#amount").html(result.data);
	});
});