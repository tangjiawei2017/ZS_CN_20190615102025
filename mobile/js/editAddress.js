$(function(){	
  var id=getUrlParam("id");
  var returnUrl='';
  var url=document.location.toString();
  if(url.indexOf("returnUrl")!=-1){
	returnUrl=url.substring(url.indexOf("returnUrl")+10);
   }
  if(id!=null && id!=''){
        $.ajax({
			url:"/address/preEditCustomerAddress.action?id="+id,
			type:"post",
		    async:false,
			dataType:"json",
			success:function(result){
				$(".container .header span").html("编辑收货地址");
				if(result.code==200 && result.data!=null){
					var address = result.data;
					$("input[name='id']").val(id);
					$("input[name='returnUrl']").val(returnUrl);
					$("input[name='province']").val(address.province);
					$("input[name='city']").val(address.city);
					$("input[name='county']").val(address.county);
					$("input[name='isDefault']").val(address.isDefault);
					$("input[name='receiver']").val(address.receiver);
					$("input[name='phone']").val(address.phone);
					$(".appaddress .province").html(address.province);
					$(".appaddress .city").html(address.city);
					$(".appaddress .county").html(address.county);
					$("input[name='area']").val(address.area);
					if(address.isDefault==1){
						$(".addr-default-img img").attr("src","/images/switch_select.png");
					}else if(address.isDefault==0){
						$(".addr-default-img img").attr("src","/images/switch.png");
					}
					$(".addr-default-img img").data("index",address.isDefault);
				}
			}
		});
  }
  $(".df_addr_img img").click(function(){
        var src=$(this).attr("src");
		var array=["/images/switch.png","/images/switch_select.png"];
		if(src==array[0]){
		   $(this).attr("src",array[1]);
		   $(this).data("index",1);
		}else{
		 $(this).attr("src",array[0]);
		 $(this).data("index",0);
		}
	    $("input[name='isDefault']").val($(".df_addr_img img").data("index"));
  });
  $(".appaddress").on("click",function(){
	$(".appaddress").selectAddress({
		"ajaxURL":"/address/getRegionsAjax.action",
		storageBox:$(".appaddress span"),
		callback:function(string){
			//回调,表单赋值
			var array=string.split(",");
			$("input[name='province']").val(array[0]);
			$("input[name='city']").val(array[1]);
			$("input[name='county']").val(array[2]);
		}
	});
  });
  $(".addr-save-btn").click(function(){
	  var isOK=true;
	  var errorMsg='';
	  //手机号码校验
	  if($.trim($("input[name='receiver']").val())==''){
		  errorMsg="收货人不能为空!"  
	      isOK=false;
	  }
	  var $phone=$.trim($("input[name='phone']").val());
      if(isOK && $phone==''){
    	  errorMsg="手机号不能为空!";
    	  isOK=false;
      }else if(isOK && $phone!='' ){
    	  isOK=checkPhone($phone);
    	  if(!isOK){
    		  errorMsg="手机格式不正确!";
    	  }
      }
      //当选择地区较快时,会让 input 隐藏域的地区赋值不上,需要单独处理
      var arr=['province','city','county'];
      $(".appaddress span span").each(function(index){
    	  if($(this).html()!=''){
    	     $("input[name='"+arr[index]+"']").val($(this).html());
    	  }
      });
      //地区选择校验
      if(isOK && $.trim($("input[name='province']").val())==''){
    	  isOK=false;
    	  errorMsg="请选择收货地址!";
      }
      if(isOK && $.trim($("input[name='area']").val())==''){
    	   isOK=false;
    	   errorMsg="详细地址不能为空!";
      }
      if(isOK){
			if(returnUrl!=null && returnUrl!=''){
				  $("input[name='isDefault']").val(1);
				  $.ajax({
					url:"/address/updateCustomerAddress.action",
					type:"post",
					data:$("#addressForm").serialize(),
					dataType:"json",
					success:function(data){
						if(data.code==1){
							window.location.href=returnUrl;
						}
				   }
			
			});
			}else{
				//表单提交,需要判断是跟新还是新增
				$.ajax({
						url:"/address/updateCustomerAddress.action",
						type:"post",
						data:$("#addressForm").serialize(),
						dataType:"json",
						success:function(data){
							if(data.code==1){
								window.location.href="/address_list.html";
							}
						}
				
				});
		    }
		}else{
    	    layer.open({
				content : errorMsg,
				skin : 'msg',
				time : 2
			//2秒后自动关闭
			}); 
      }
  });
     //表单提交
     function submitForm(action){
    	var form=document.forms["addressForm"];
    	form.action=action;
    	form.method="post";
    	form.submit();
     }
	//校验手机号码
	function checkPhone(phone) {
		if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
			return false;
		}
		return true;
	}
	   //获取当前url参数
	function  getUrlParam(paraName) {
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
  //app仿京东弹窗地址选择js
  (function($,window,document,undefined){
	$.fn.selectAddress=function(options){
		self.flag=false;//boolean,通过控制true or false, 防止恶意切换
		self.text=null;//回调时,用来储存选择到的地址数据
		this.default={
			"ajaxURL":"#",//ajax请求数据的地址
			"speed":300,//切换的速度
			storageBox:"",//在选择地址用，用来储存地址数据的盒子
			callback:function(){}
		}
		this.option=$.extend({},this.default,options);
		var arrText="";//储存选择到的数据，添加到storageBox中
		var op=this.option;
		// 初始化入口
		this.init=function(){
			var self=this;
			this.createEle();
			this.createProvince();
			// 点击关闭按钮的时候按钮的时候
			self.closeBtn.on("click",function(){
				self.maskHidie();
			})
           	self.aInfo.on("click",function(){
		    	var index=$(this).index();
		    	self.clickInfo($(this),index);
			});
		 	self.mask.on("click",function(event){
				if($(event.target).attr("id")=="toogle-mask"){
					self.maskHidie();
				}
			})
		}
		// 创建toogle-mask模块
		this.createEle=function(){
			var self=this;
			self.mask=$('<div class="toogle-address-mask" id="toogle-mask"></div>');
			self.maskChild=$('<div class="toogle-address" id="toggleCont"><div class="toogle-address-title border-b fs28">请选择地址<img  src="/images/close.png" class="icon icon-close" id="closeBtn"/></div><div id="address" class="address"><div class="address-header"><span class="address-info address-now fs26" id="provience">请选择</span><span class="address-info fs26" id="city">请选择</span><span class="address-info fs26" id="county">请选择</span></div><div class="address-content"><div class="address-cont"><ul class="provienc-part fs26" data-create="createCity" data-index="1"></ul><ul class="city-part fs26" data-create="createCounty" data-index="2"></ul><ul class="county-part fs26" data-index="3"></ul></div></div></div></div>');
			$("body").append(self.mask);
			self.mask.append(self.maskChild);
			self.closeBtn=$("#closeBtn",self.mask);//关闭按钮
			self.toogleMask=$("#toggleCont",self.mask);//选择地址的内容区
			self.aInfo=$(".address-info",self.mask);//选择省市区选项
			self.AddressCont=$(".address-cont",self.mask);//三个地址列表包裹的层
			self.mask.animate({
				opacity:1
			},100,function(){
				self.maskChild.css({"bottom":'-100%'}).animate({
					"left":"0",
					"bottom":"0"
				},op.speed);
			})
		}
		// 创建省模块
		this.createProvince=function(){
			var self=this;
			 self.addressAjax(self.AddressCont.find('.provienc-part'),null,1);
		}
		// 创建市模块
		this.createCity=function(dataValue){
			var self=this;
			 self.mask.find("#city").show();
			 self.AddressCont.find('.city-part').empty();
			self.addressAjax(self.AddressCont.find('.city-part'),dataValue,2);
		}
		// 创建区域模块
		this.createCounty=function(dataValue){
			var self=this;
			 self.mask.find("#county").show();
			 self.AddressCont.find('.county-part').empty();
			self.addressAjax(self.AddressCont.find('.county-part'),dataValue,3);
		}
		// 点击选择地址
		this.clickfn=function (district){
			var self=this;
			district.on('click',function(event){
				var _this=$(this);
				var parent=_this.parent();
				var dataValue=_this.data("value");
				var parentCreate=parent.data("create");
				var dataIndex=parent.data("index");
          		_this.parent().find('li').removeClass("liNow");
          		_this.addClass("liNow");
				self.aInfo.eq(dataIndex-1).html(_this.text());
				if(parentCreate=='createCity'){
					self.createCity(dataValue);
				}else if(parentCreate=="createCounty"){
					self.createCounty(dataValue);
				}
				if(dataIndex==3){
					// 如果dataIndex=3,说明选择的是区域，执行移除toogle-address模块
					self.maskHidie();
				}else{
					// 如果dataIndex小于3，执行clickInfo
					self.clickInfo(self.aInfo.eq(dataIndex),dataIndex);
				}
			})
		}
		// 移除toogle-address模块
		this.maskHidie=function(){
			var self=this;
			self.toogleMask.animate({
				bottom:"-100%"
			},op.speed,function(){
				self.mask.animate({
					'opacity':0
				},200,function(){
					self.addressInput();
					if(op.callback&& typeof op.callback=="function"){
						// 执行回调函数
						op.callback(self.text);
					}
				})
			})
		}
		// 将数据存放到input表单中
		this.addressInput=function(){
			var self=this;
			var boxHtml="";
			var text="";
			for(var i=0;i<op.storageBox.find("span").length;i++){
				boxHtml+=op.storageBox.find("span").eq(i).text()+" ";
			}
			for(var i=0;i<$(".liNow").length;i++){
				arrText+="<span>"+$(".liNow").eq(i).text()+"</span>";
				text+=$(".liNow").eq(i).text()+",";
			};
			// 如果arrText不为空
			if(arrText!=""){
				op.storageBox.html(arrText);
				self.text=text;
			}else{
				self.text=boxHtml;
			}
			self.mask.remove();
		}
		this.clickInfo=function(ele,index){
			var self=this;
			self.flag=true;
			if(self.flag){
				self.flag=false;
				ele.addClass("address-now").siblings().removeClass("address-now");
				self.AddressCont.animate({
					"margin-left":"-"+index*100+"%"
				},op.speed);
				self.flag=true;
			}
		}
		// 通过ajax请求数据
		this.addressAjax = function(district, cValue, ov,type) {
			var self=this;
            var oType = null;
			district.empty();
            $.ajax({
			   url: this.option.ajaxURL,
			   type:"post",
               dataType: 'JSON',
               success: function(data) {
               	district.empty();
                   if (ov == 3) {
                       oType = data.county; //请求区的数据
                   } else if (ov == 2) {
                       oType = data.city; //请求市的数据
                   } else if (ov == 1) {
                       oType = data.provience; //请求省的数据
                   }
                   this.countyItem='';
                   $.each(oType, function(key, value) {
                       if (cValue == null) {
                             this.countyItem =  $("<li data-value='" + value.id + "'>" + value.name + "</li>");
                       } else if (cValue == value.cid) {
                             this.countyItem = $("<li data-value='" + value.id + "'>" + value.name + "</li>");
                       }
                       district.append(this.countyItem);
                   });
              	self.clickfn(district.find("li"));
               },
               error: function() {
                   console.log('ajax error')
               }
           })
       }
		return this.init();
	}
})(jQuery,window,document);
});