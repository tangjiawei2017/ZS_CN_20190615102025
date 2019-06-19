var Address={
    returnUrl:'',
    addrId:'',
    initView : function(){
       var url=document.location.toString();
       if(url.indexOf("returnUrl")!=-1){
        this.returnUrl=url.substring(url.indexOf("returnUrl")+10);
       }
       this.addrId = this.getUrlParam("addrId");
       $.ajax({
            url:"/address/list.action",
            type:"post",
            async:false,
            dataType:"json",
            success:function(result){
               if(result.code==200 && result.data!=null){
                    var addressList=result.data;
                    for(var i=0;i<addressList.length;i++){
                        var address = addressList[i];
                        var $li= '<li class="li border-b bg-color-white"><div class="first flex-box">'
                               + '<span class="fs26">'+address.receiver+'</span><strong class="fs26">'
                               + address.phone+'</strong>';
                        if(address.isDefault==1){
                            $li=$li +'<i class="sitem-tip-default fs24">默认</i>';
                        }
                        $li = $li+'</div><div class="second fs24 fc-666 border-b">'
                            + address.province+address.city+address.county+'&nbsp&nbsp&nbsp'+address.area
                            + '</div><div class="three fs24"><div><span><a href="/address_edit.html?id='+address.id
                            + '"class="flex-box fc-666"><img src="/images/edit.png" /><i>编辑</a></i></span><span><a'
                            + ' href="javascript:void(0)" class="flex-box fc-666" onclick="Address.delAddress('+address.id+')">'
                            + '<img src="/images/del.png"><i>删除</i></a></span></div></div></li>';
                        $(".address-list .content ul").append($li);
                        if(address.id==Address.addrId){ 
                            var $order_li = '<li class="li border-b bg-color-white flex-box"><div class="addrid">'
                            + address.id+'</div><div class="order-select-addr"><img src="/images/ok.png" /></div>'
                            + '<div class="flex-box-grow2"><div class="first flex-box">'
                            + '<span class="fs26">'+address.receiver+'</span><strong class="fs26">'
                            + address.phone+'</strong>';

                            if(address.isDefault==1){
                                $order_li= $order_li + '<i class="sitem-tip-default fs24">默认</i>';
                            }
                            $order_li = $order_li +'</div><div class="second fs24 fc-666 border-b">'
                                      + address.province+address.city+address.county+'&nbsp;&nbsp;&nbsp;'+address.area
                                      + '</div></div></li>';
                            $(".order-address-list .content ul").append($order_li);
                        }else{
                            var $order_li = '<li class="li border-b bg-color-white"><div class="addrid">'
	                                      + address.id+'</div><div class="first flex-box">'
				                          + '<span class="fs26">'+address.receiver+'</span><strong class="fs26">'
				                          + address.phone+'</strong>';
                            if(address.isDefault==1){
                                 $order_li= $order_li + '<i class="sitem-tip-default fs24">默认</i>';
                            }
	                        $order_li = $order_li +'</div><div class="second fs24 fc-666 border-b">'
	                                  + address.province+address.city+address.county+'&nbsp;&nbsp;&nbsp;'+address.area
                                      +'</div></li>';
                            $(".order-address-list .content ul").append($order_li);
                        }
                    }
                    if(Address.returnUrl!=null && Address.returnUrl!=''){
                        $(".address-list").hide();
                        $(".order-address-list").show();
                        $(".order-address-list .newaddr").click(function() {
                          window.location.href = "/address_edit.html?returnUrl=/order/checkout.action";
                        });
                        $(".order-address-list li.li").click(function(){
                             var addrId=$(this).children(".addrid").html();
                             window.location.href="/order/checkout.action?addrId="+addrId;  
                        });
                     }else{
                         $(".address-list .newaddr").click(function() {
                             window.location.href = "/address_edit.html";
                         });
                    }
                }
            }
       })
    },
    delAddress:function(id){
        //询问框
        layer.open({
            content : '确认删除么？',
            btn : [ '确认', '取消' ],
            yes : function(index) {
                $.ajax({
                    url : "/address/delCustomerAddress.action",
                    type : 'post',
                    data : {
                        id : id
                    },
                    success : function(data) {
                        //重新加载
                        location.reload();
                        layer.close(index);
                    }
                });
            }
        });
    },
    back:function() {
        window.location.href = "/members_index.html";
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
};