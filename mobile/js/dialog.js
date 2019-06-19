//底部弹窗封装
$.fn.dialog = function(content, height) {
	this.init = function() {
		var self = this;
		self.createEle();
		// 单击弹窗以外,隐藏弹窗
		self.mask.on("click", function(event) {
			if ($(event.target).attr("id") == "shiptime-mask") {
				self.maskHide();
			}
		});
	};
	this.createEle = function() {
		var self = this;
		self.mask = $('<div class="shiptime-mask" id="shiptime-mask"></div>');
		self.dialog = $('<div class="shiptime-dailog"></div>');
		$("body").append(self.mask);
		self.mask.append(self.dialog);
		self.dialog.css("height",height+"rem");
		self.dialog.append(content);
		self.mask.animate({
			opacity : 1
		}, 100, function() {
			self.dialog.css({
				"bottom" : '-100%'
			}).animate({
				"left" : "0",
				"bottom" : "0"
			}, 120);
		})
	};
	// 移除dialog模块
	this.maskHide = function() {
		var self = this;
		self.dialog.animate({
			bottom : "-100%"
		}, 200, function() {
			self.mask.animate({
				'opacity' : 0
			}, 200, function() {
				self.mask.remove();
			});
		})
	}
	return this.init();
};
