var ProductDetail={
    pid:'',
    //初始化分类数据
    initView:function(){
        ProductDetail.pid = ProductDetail.getUrlParam("id");
        appAjax("/api/v1/product/detail?id="+ ProductDetail.pid,'',
            function(result){
                if(result.code==0){
                    var product= result.data;
                    //加载商品图片
                    if(product.images!=null && product.images!=''){
                        var imageArray = product.images.split(",");
                        for(var i=0;i<imageArray.length;i++){
                              $(".swiper-wrapper").append('<div class="swiper-slide"><img src="'+imageArray[i]+'" alt="" />');
                        }
                        ProductDetail.initSwiper();
                    }
                    var promotionList = result.data.promotionList;
                    //加载促销信息
                    if(promotionList!=null && promotionList.length>0){
                        for(var i=0;i<promotionList.length;i++){
                            $(".product-promo").append('<div class="fs26"><i class="sitem-tip fs22">优惠</i>'+promotionList[i]+'</div>');
                        }
                       $(".product-promo-div").show();
                    }
                    //加载商品信息
                    $(".product-name-div span.name").html(product.name);
                    $(".product-name-div #price i").html(Number(product.price).toFixed(2));
                    $(".product-stock i").html(product.stock+"&nbsp;"+product.unit);
                    $(".product_desc").html(product.description);
                    //加载商品评价
                    var review = result.data.review;
                    $(".pro_card_box .product_desc").html(product.description);
                    if(review!=null && typeof review.reviewList!="undefined" && review.reviewList!=null && review.reviewList.length>0){
						$(".pro_card_box .review-count .count i").html(review.pcount);
						$(".pro_card_box .review-count .good-reiview i").html(review.applauseRate);
                         var reviewArray = review.reviewList;
                         for(var i=0;i<reviewArray.length;i++){
                             var customerPhoto = reviewArray[i].customerPhoto==""?"images/nlogin-reivew-header.png":reviewArray[i].customerPhoto;
                             var account = reviewArray[i].account;
                             if(account.length<2){
                                 account= account.substring(0,1)+"***";
                             }else{
                                 account= account.substring(0,1)+"***"+account.substring(account.length-1);
                             }
                            var reivewStar='';
                            for (var j = 0; j < Number(reviewArray[i].gradeLevel); j++) {
                                reivewStar=reivewStar+'<img src="images/star_cur.png"/>';
                            }
                            for(var j=0;j<5- Number(reviewArray[i].gradeLevel);j++){
                                reivewStar=reivewStar+'<img src="images/star.png"/>';
                            }
                            $li='<li class="review-li border-b"><div class="first flex-box"> <img class="members-logo" src="'
                               + customerPhoto +'"/><div class="flex-box-grow2">'+account+'</div><div class="review-star-img">'
                               + reivewStar +'</div></div><div class="second">'+reviewArray[i].content;
						    if(reviewArray[i].answer!=null){
                                $li = $li + '<BR><span class="fc-999 fs22">商家回复:'+ reviewArray[i].answer+'</span>';
                            }
                            $li = $li +'</div><div class="third flex-box"><span class="flex-box-grow2 fc-999">'
                                  + reviewArray[i].spec0;
                            if(reviewArray[i].spec0!=null && reviewArray[i].spec0!=''){
                                $li = $li +',';
                            }
                            $li = $li + reviewArray[i].spec1;
                            if(reviewArray[i].spec1!=null && reviewArray[i].spec1!=''){
                                $li = $li +',';
                            }
                            $li = $li + reviewArray[i].spec2+'</span> <span class="fc-999">'+reviewArray[i].createTime+'</span></div>';
                            $(".reviewList").append($li);
                        }
                    }
                       //加载规格项
                       if(typeof product.specList!="undefined" && product.specList!=null && product.specList.length>0){
                            for(var i=0;i<product.specList.length;i++){
                                var spec= product.specList[i];
                                var specValueArray= JSON.parse(product.specList[i].specValue);
                                var $li = '<li class="flex-box spec spec'+i+'"><span class="product-label fs26 fc-999">'+spec.name+'</span>';
                                for(var j=0;j<specValueArray.length;j++){
                                    $li = $li +'<a href="javascript:void(0)" class="choose fs18"><span data-default="'+specValueArray[j]+'">'+specValueArray[j]+'</span><i></i></a>';
                                }
                                $(".product-spec-choose-li").before($li);
                            }
                            var productSpec= JSON.parse(product.productSpec);
                            $(".product-spec-ul .spec.spec0 a.choose").each(function(){
                                for(var j=0;j<productSpec.spec0.defaultValue.length;j++){
                                    if(productSpec.spec0.defaultValue[j] == $.trim($(this).find("span").html())){
                                        $(this).find("span").html(productSpec.spec0.value[j]);
                                    }
                                }
                            });
                        }
                }
        });
        //请求购物数据
		appAjaxWithToken("/api/v1/cart/readCartAmount",'',
			function(result){
				if(result.code==0){
					$("#amount").html(result.data);
				}
			}
        );
        $(".product-spec-ul .choose").click(function() {
			if (!$(this).is(".choose-act")) {
				var haschoose = "";
				$(this).siblings().removeClass("choose-act");
				$(this).addClass("choose-act");
				$(".product-spec-ul li.spec .choose-act").each(
						function() {
							haschoose = haschoose
									+ '"'
									+ $(this).children("span")
											.html() + '"，';
						});
				haschoose = haschoose.substring(0,
						haschoose.length - 1);
				$(".product-spec-choose").html(haschoose);
				$(".product-spec-choose-li").show();
				var specSize=$(".product-spec-ul .spec").length;
				var specActSize=$(".product-spec-ul .spec .choose-act").length;
				
				//当所有规格选择完,ajax请求货品
				if(specSize==specActSize){
					var data={};
					$spec0=$(".product-spec-ul .spec.spec0 .choose-act span").data("default");
					$spec1=$(".product-spec-ul .spec.spec1 .choose-act span").data("default");
					$spec2=$(".product-spec-ul .spec.spec2 .choose-act span").data("default");
					data.spec0=typeof $spec0=="undefined"?"":$spec0;
					data.spec1=typeof $spec1=="undefined"?"":$spec1;
					data.spec2=typeof $spec2=="undefined"?"":$spec2;
					data.id=ProductDetail.pid;
					 appAjax("/product/checkProductItemExist",data,function(result){
						  if(result.code==0){
							  $(".canbuyBtn").show().siblings(".nbuyBtn").hide();
						  }else{
							  $(".canbuyBtn").hide().siblings(".nbuyBtn").show();
						  }
						  if(result.data!=null &&  typeof result.data.price!='undefined' && typeof result.data.proItemId!='undefined'){
							$("#price i").html(Number(result.data.price).toFixed(2));
							$("input[name='proItemId']").val(result.data.proItemId);
						  }
						}); 
				}
			}
		});
		$(".product-buy-count a").click(function() {
			var count = $(".product-buy-count .icount").val().trim();
			if ($(this).is(".minus")) {
				if (count == '1') {
					$(this).removeClass("border-f8").addClass(
							"border-ccc").children("em")
							.removeClass("prev");
				} else {
					count--;
					$(".product-buy-count .icount").val(count);
				}
			} else if ($(this).is(".plus")) {
				if (count == "1"&& $(".product-buy-count .minus").hasClass("border-ccc")) {
					$(".product-buy-count .minus").removeClass(
							"border-ccc").addClass("border-f8")
							.children("em").addClass("prev");
				}
				count++;
				$(".product-buy-count .icount").val(count);
			}
		});
		$(".pro_card_option li").click(function() {
			$span = $(this).children("span");
			if (!$span.hasClass("currentCard")) {
				$span.addClass("currentCard").parent()
						.siblings().children("span")
						.removeClass("currentCard");
				$("." + $span.data("class")).show().siblings().hide();
			}
		});
		//数量失去焦点判断
		$("input[name='count']").blur(function(){
			if(!ProductDetail.isPositiveInteger($(this).val())){
				$(this).val(1);
			}
		});
		//加入收藏按钮
		$(".addCollect-btn").click(function(){
			  $.ajax({
				 url:apiServer+"/api/v1/customer/addCollectProduct",
				 type:"post",
				 data:{"pid":ProductDetail.pid},
				 success:function(result){
					 var data= JSON.parse(result);
					 if(data.result=="noLogin"){
						 window.location.href="/members_login.html?returnUrl=/product_detail.html?id="+ProductDetail.pid;
					 }else if(data.result=="success"){
						  layer.open({
								content : "加入收藏成功!",
								skin : 'msg',
								time : 2
							//2秒后自动关闭
							}); 
					 }else if(data.result=="hasRepeat"){
						 layer.open({
								content : "该商品已加入过收藏!",
								skin : 'msg',
								time : 2
							//2秒后自动关闭
						});
					 }
				 }
			  });
		});
		
		//加入购物车
		$(".addCart-btn").click(function(){
			 var count=0,proItemId;
	         if($(".product-spec-ul .spec").length==0){
	        	 //没有商品规格
	        	 $.ajax({
	        		  url:apiServer+"/api/v1/product/findProductItemIdByPIdAjax?pid="+ProductDetail.pid, 
	        		  type:"post",
					  async:false,
					  dataType:"json",
	        		  success:function(result){
	        			if(result.code==0){
	        				$("input[name='proItemId']").val(result.data.proItemId);
	        				proItemId=result.data.proItemId;
	        				count=$.trim($("input[name='count']").val());
	        				if(!ProductDetail.isPositiveInteger(count)){
	        					count=1;
	        				}
	        		    }
	        		  }
	        	 });
	         }else{
		        	var specSize=$(".product-spec-ul .spec").length;
					var specActSize=$(".product-spec-ul .spec .choose-act").length;
					//当所有规格选择完,ajax请求货品
					if(specSize==specActSize && $("#proItemId").val()!=''){
						count=$.trim($("input[name='count']").val());
        				if(!ProductDetail.isPositiveInteger(count)){
        					count=1;
        				}  
        				proItemId=$("input[name='proItemId']").val();
					}else{
						for(var i=0;i<3;i++){
							if($(".product-spec-ul .spec.spec"+i+" .choose-act").length==0){
								var specName=$(".product-spec-ul .spec.spec"+i).children(".product-label").html();
							    layer.open({
									content : "请选择"+specName,
									skin : 'msg',
									time : 1.2
							     });
							     return;
							}
						}
					}
                }
	          //添加到购物车
	          appAjaxWithToken("/api/v1/cart/addCarts",
	        	 {proItemId:proItemId,quantity:count},
				  function(result){
						if(result.code==0){
							$("#amount").html(result.data);
							layer.open({
									content : "加入购物车成功" ,
									skin : 'msg',
									time : 2
							});
						}else if(result.code==1002){
							var href= window.location.href;
							window.location.href="members_login.html?returnUrl="+href;
						}
	        	  });
		});
     },
    initSwiper:function(){
        var mySwiper = new Swiper('.swiper-container', {
            speed : 300,
            autoplayDisableOnInteraction : false,
            grabCursor : true,
            pagination : '.swiper-pagination',
        });
    },
    //是否为正整数
    isPositiveInteger:function(s){
        var re = /^[1-9][0-9]*$/ ;
        return re.test(s);
    } ,

    back:function(){
            window.location.href="product_list.html";
    },

    //获取当前url参数
    getUrlParam:function(paraName) {
    　　　　var url = document.location.toString();
    　　　　var arrObj = url.split("?");
    　　　　if (arrObj.length > 1) {
    　　　　　　var arrPara = arrObj[1].split("&");
    　　　　　　var arr;
    　　　　　　for (var i = 0; i < arrPara.length; i++) {
    　　　　　　　　arr = arrPara[i].split("=");

    　　　　　　　　if (arr != null && arr[0] == paraName) {
    　　　　　　　　　　return arr[1];
    　　　　　　　　}
    　　　　　　}
    　　　　　　return "";
    　　　  }
    　　　　else {
    　　　　　　return "";
    　　　  }
    }
 }