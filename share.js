
var browsers = {
	versions : function(){
		var UA = navigator.appVersion, app = navigator.appVersion;
		return {
			isQQBrowser : UA.split("MQQBrowser/").length==2,
			isUcBrowser : UA.indexOf("UCBrowser/")>-1,
			isWX : UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
			isQQ : !this.isQQBrowser&&UA.split("QQ").length>2|| !this.isQQBrowser&&UA.split("QQ").length==3,
			isWb : /Weibo/i.test(UA),
		}
	}(),
	nowBrowserVer : "",
	os : function(){
		var UA = navigator.appVersion, app = navigator.appVersion;
		return {
			isMobile : !!UA.match(/AppleWebKit.*Mobile.*/)||!!UA.match(/AppleWebKit/),//是否移动端
			ios : /(iPhone|iPad|iPod|iOS)/i.test(UA),
			android : /android/i.test(UA),
		}
	}()

}
function browserShare(config){
	config = config || {};
	this.url = config.url || window.location.href || '';// 分享的网页链接
	this.title = config.title || document.title || '';// 标题
	this.desc = config.desc || document.title || '';// 描述
	this.img_url = config.img_url || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || '';// 图片
	this.img_title = config.img_title  || document.title || '';// 图片标题
	this.from = config.from  || window.location.host || '';// 来源
	this.ucAppList = {
		sinaWeibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
		weixin: ['kWeixin', 'WechatFriends', 1, '微信好友'],
		weixinFriend: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
		QQ: ['kQQ', 'QQ', '4', 'QQ好友'],
		QZone: ['kQZone', 'QZone', '3', 'QQ空间']
	};
}
browserShare.prototype= {
	init : function(et,domArry,func){
		if(!browsers.versions.isQQ&&!browsers.versions.isWX&&browsers.versions.isQQBrowser){
			var b = "http://jsapi.qq.com/get?api=app.share";
			var d = document.createElement("script");
			var a = document.getElementsByTagName("body")[0];
			d.setAttribute("src", b);
			a.appendChild(d)
		}
		var that = this;
		for(var i = 0,n=domArry.length;i<n;i++){
			domArry[i].addEventListener(et,function(){
					var dataapp = this.getAttribute("data-app");
					that.share(dataapp, function () {
						func()
					})
				})
		}
	},
	share : function(to_app,func){
		if(browsers.versions.isUcBrowser){
			to_app = to_app == '' ? '' : (browsers.os.ios ? this.ucAppList[to_app][0] : this.ucAppList[to_app][1]);
			if (to_app == 'QZone') {
				var B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url="+this.img_url+"&title="+this.title+"&description="+this.desc+"&url="+this.url+"&app_name="+this.from;
				var k = document.createElement("div"); k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function () {
					k && k.parentNode && k.parentNode.removeChild(k)
				}, 5E3);
			}
			if(typeof(ucweb) != "undefined") {
				ucweb.startRequest("shell.page_share", [this.title, this.desc, this.url, to_app, "", "@" + this.from, ""])
			} else if(typeof(ucbrowser) != "undefined"){
				ucbrowser.web_share(this.title, this.desc, this.url, to_app, "", "@" + this.from, '')
			}
		}else if(!browsers.versions.isQQ&&!browsers.versions.isWX&&browsers.versions.isQQBrowser){
			to_app = to_app == '' ? '' : this.ucAppList[to_app][2];
			var ah = {
				url: this.url,
				title: this.title,
				description: this.desc,
				img_url: this.img_url,
				img_title: this.img_title,
				to_app: to_app,//微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
				cus_txt: "请输入此时此刻想要分享的内容"
			};
			ah = to_app == '' ? '' : ah;
			if (typeof(browser) != "undefined") {
				if (typeof(browser.app) != "undefined") {
					browser.app.share(ah)
				}
			}


			//低版本，http://3gimg.qq.com/html5/js/qb.js
			/*else {
				if (typeof(window.qb) != "undefined") {
					window.qb.share(ah)
				}
			}*/
		}else {
			func()
		}
		console.log(this)
	}
}
