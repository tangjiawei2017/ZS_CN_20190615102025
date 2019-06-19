$(function() {
	$(".service li.secend img").click(function() {
		$(this).attr("src", "/images/star_cur.png");
		$(this).prevAll("img").attr("src", "/images/star_cur.png");
		$(this).nextAll("img").attr("src", "/images/star.png");
	});
	$(".review-star img").click(function() {
		$(this).attr("src", "/images/star_cur.png");
		$(this).prevAll("img").attr("src", "/images/star_cur.png");
		$(this).nextAll("img").attr("src", "/images/star.png");
	});
	$(".servicebtn").click(function() {
		var count = 0;
		$(".service li.secend img").each(function(index) {
			if ($(this).attr("src") == "/images/star_cur.png") {
				count++;
			}
		});
		$.ajax({
					url : "/review/submitServiceReview.action",
					data : {
						orderId : $("input[name='orderId']")
								.val(),
						gradeLevel : count,
						reviewContent : $(
								"textarea[name='reviewContent']")
								.val()
					},
					type : "post",
					dataType : "json",
					success : function(data) {
						if (data.result == "success") {
							if (data.hasReviewComplted == "yes") {
								window.location.href = "/order/myOrder.action?status=hascomplete";
							} else if (data.hasReviewComplted == "no") {
								window.location.reload();
							}
						}
					}
		});
	});
});
function goProductReview(reviewId,orderId) {
	var orderId=$("input[name='orderId']").val();
	var byOrder="yes";
	if(typeof orderId=="undefined"){
		byOrder="no";
	}
	window.location.href = "/review/detail.action?reviewId=" + reviewId
		+ "&byOrder="+byOrder;
}
function submitReview(id) {
	var count = 0;
	$(".review-star img").each(function(index) {
		if ($(this).attr("src") == "/images/star_cur.png") {
			count++;
		}
	});
	$.ajax({
		url : "/review/submitReview.action",
		data : {
			id : id,
			gradeLevel : count,
			content : $("textarea[name='content']").val(),
			byOrder : $("input[name='byOrder']").val()
		},
		type : "post",
		dataType : "json",
		success : function(data) {
			if (data.result == "success") {
				window.location.href = data.returnUrl;
			}
		}
	});
}