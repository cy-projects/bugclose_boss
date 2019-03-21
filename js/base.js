/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */

define(['xml','timeUtils'], function(xml,timeUtils){
	//主页下拉(js自写，没有采用Bootstrap，详情页的下拉采用了Bootstrap)
	$(document).on('click','.mainNav >li',function(event){
		event.stopPropagation();
		$(this).siblings("ul").css({width:$(this).width()});
		if ( $(this).siblings("ul").is(":hidden") ) {
			$(this).siblings("ul").show().parent().siblings("ul").children("ul").hide();
		} else if ( $(this).siblings("ul").is(":visible") ) {
			$(this).siblings("ul").hide();
		}
	})
	$(document).click(function(){ $(".mainNav").children("ul").hide(); })

	var fn = {
		//bugContent动画
		bugContentAni: function(){
			$(".bugContent").css({ 'left': '250px', 'right': '-30px', opacity: 0 });
			$(".bugContent").animate({ 'left': '220px', 'right': '0px', opacity: 1 },700);
		},
		sidebar: {
			//sidebar 子栏上下收缩
			sectionHeight: function(item, num){	
				var sidebarItemLength = item.children("li:visible").length;
				var sidebarItemHeight = num + sidebarItemLength*30;
				item.css({ height: sidebarItemHeight });
				item.children("h5").click(function(){
					if ( item.height() == sidebarItemHeight ){
						item.stop(false,true).animate({ height: num });
						item.children("h5").children("span").eq(1).children("i").addClass("fa-caret-down").removeClass("fa-caret-up");
					} else {
						item.stop(false,true).animate({ height: sidebarItemHeight });
						item.children("h5").children("span").eq(1).children("i").addClass("fa-caret-up").removeClass("fa-caret-down");
					}
				})
				if ( sidebarItemLength == 0 || item.height() == num ) { item.hide(); } else { item.show(); }			
			},
			//sidebar 子项目点击切换动画效果
			itemAnimate: function(ele){
				//解决IE，火狐虚线框
				ele.children("li").css({"outline":"medium","border":"none"});
				ele.children("li").children("a").css({"outline":"medium","border":"none"});
				//背景色
				ele.css({"background-color":"rgb(238,238,238)"}).siblings("li").css({"background-color":""});
				ele.parent("ul").siblings("ul").children("li").css({"background-color":""});
				//文字颜色和大小
				ele.find("a").css({color: "#00aeef"}).parents("li").siblings("li").find("a").css({color: ""});
				ele.parent("ul").siblings("ul").children("li").find("a").css({color: ""});
				//左边小红竖线
				ele.children("div").css({"height":"30px",top:"0px"}).parents("li").siblings("li").children("div").css({"height":"",top:""});
				ele.parent("ul").siblings("ul").children("li").children("div").css({"height":"",top:""});			
			},
			show_wrapperMinW: function(ele){
				var result = 0;
				ele.each(function(){
					var aaa = parseInt(getStyle( this, 'min-width' ));
					result += aaa;		
				})
				$(".wrapperChange").animate({'min-width': (result + 280) + 'px' });
			},
			hide_wrapperMinW: function(ele){
				var result = 0;
				ele.each(function(){
					var aaa = parseInt(getStyle( this, 'min-width' ));

					result += aaa;		
				})
				$(".wrapperChange").animate({'min-width': (result + 60) + 'px' });
			}
		},
		//滚动条
		slim: {
			slimDisable: function(th){
				if ( $(th).hasClass("slimScrollDiv") ){
				} else {
					$(th).slimScroll({
						height : '100%',
						allowPageScroll : false,
						railOpacity: 0.6
					})
				}
			},
			sidebar: function(th){
				if ( $(th).hasClass("slimScrollDiv") ){
				} else {
					$(th).slimScroll({
						height: "100%",
						allowPageScroll: false,
						position: "left",		//滚动条位置
						disableFadeOut :false,	//鼠标在内容处一定时间不动是否隐藏滚动条
					})
				}
			},
			content: function(){
				var _this = this;
				$(".bugContent >div").each(function(){ _this.slimDisable(this); })
			},
			homePick: function(){
				var _this = this;
				$(".main_drop_menu 	>div").each(function(){ _this.slimDisable(this); })
			},
			detail: function(){
				var _this = this;
				$('.main_detail_content >div').each(function(){ _this.slimDisable(this); })
			},
			popup: function(){
				var _this = this;
				$(".dropdown-menu-right >div").each(function(){ _this.slimDisable(this); })
			}
		},
		//详情页移除样式，清空内容
		mDHideAni: function(){
			$(".main_detail 			").removeClass("main_detail_active").html('').attr('data-value','');
			$(".main_table >tbody >tr 	").removeClass("main_table_tbody_tr_active");
		},

		//详情页 操作后，保持list页 当前id状态
		mdOptTableTrKeepBg: function(th){
			if ( $(th).attr("data-value") == $(".main_detail").attr("data-value") ) {
				$(th).addClass("main_table_tbody_tr_active").siblings("tr").removeClass("main_table_tbody_tr_active");
			}
		},

		//表格排序
		sortTable: function(th){
			if ( $(th).find("i").hasClass("fa-sort") ) {
				$(th).find("i").addClass("fa-sort-asc").removeClass("fa-sort-desc").removeClass("fa-sort");
				$(th).siblings("th").find("i").addClass("fa-sort").removeClass("fa-sort-asc").removeClass("fa-sort-desc");
				$(th).find("i").css({color:"rgba(50,50,50,1)"}).parent().siblings("th").find("i").css({color:"rgba(50,50,50,0.5)"});
				var sortAsc = $(th).find("i").attr("data-value") + ' asc';
				$(th).parent().attr("data-value",sortAsc);
				// console.log("sort变asc");

			} else if ( $(th).find("i").hasClass("fa-sort-asc") ) {
				$(th).find("i").addClass("fa-sort-desc").removeClass("fa-sort-asc").removeClass("fa-sort");
				$(th).siblings("th").find("i").addClass("fa-sort").removeClass("fa-sort-asc").removeClass("fa-sort-desc");
				$(th).find("i").css({color:"rgba(50,50,50,1)"}).parent().siblings("th").find("i").css({color:"rgba(50,50,50,0.5)"});
				var sortDesc = $(th).find("i").attr("data-value") + ' desc';
				$(th).parent().attr("data-value",sortDesc);
				// console.log("asc变desc");

			} else if ( $(th).find("i").hasClass("fa-sort-desc") ) {
				$(th).find("i").addClass("fa-sort-asc").removeClass("fa-sort-desc").removeClass("fa-sort");
				$(th).siblings("th").find("i").addClass("fa-sort").removeClass("fa-sort-asc").removeClass("fa-sort-desc");
				$(th).find("i").css({color:"rgba(50,50,50,1)"}).parent().siblings("th").find("i").css({color:"rgba(50,50,50,0.5)"});
				var sortAsc = $(th).find("i").attr("data-value") + ' asc';
				$(th).parent().attr("data-value",sortAsc);
				// console.log("desc变asc");
			}	
		},

		// 表格排序函数
		mainTableSort: function(ele, fnn){
			var _this = this;
			ele.off('click');
			ele.on('click',function(){
				_this.sortTable(this);
				if ( $(this).hasClass("sort") ) { fnn(); }				
			})
		},

		//json数据排序
		sortAgainJson: function(json, parm, sortBy){
			//降序
			var desc = function(x, y){
				return x[parm] > y[parm] ? -1 : 1;
				// return (eval("x." + parm) > eval("y." + parm)) ? -1 : 1
			}
			//升序
			var asc = function(x, y){
				return x[parm] < y[parm] ? -1 : 1;
				// return (eval("x." + parm) > eval("y." + parm)) ? -1 : 1
			};
			if (sortBy == 'desc'){
				return json.sort(desc);
			} else if(sortBy == 'asc'){
				return json.sort(asc);
			}
		},

		//list筛选 赋值data-value， data-name
		pickValue: function(th){
			$(th).parent().parent().parent().siblings("li").find("strong").html( $(th).find("a").html() );
			$(th).parent().parent().parent().siblings("li").find("strong").attr( 'data-value' , $(th).find("a").attr('data-value') );
			$(th).parent().parent().parent().hide();		
		},

		pickName: function(th){
			$(th).parent().parent().parent().siblings("li").find("strong").attr( 'data-name' , $(th).find("a").attr('data-name') );
		},
		//list筛选 下拉加载数据
		pickCheck: function(ele,fnn){
			var _this = this;
			ele.off('click');
			ele.on('click', function(ev){
				_this.pickValue(this);
				_this.pickName(this);
				_this.mDHideAni();
				if(fnn){fnn(ev.target);}
			})
		},

		//list筛选 点击按钮加载数据
		pickBtnDown: function(ele, fnn){
			var _this = this;
			ele.off("mouseover mousedown mouseup mouseout");
			ele.on('mouseover', function(){
				$(this).css({
					'background-color': 'rgba(3,148,203,0.5)',
					'box-shadow': 'none'
				});
			})
			ele.on('mousedown', function(){
				$(this).css({ 
					'background-color': 'rgba(3,148,203,1)',
					'box-shadow': 'inset 0 1px 8px rgba(0,0,0,0.5)'
				});
			})
			ele.on('mouseup', function(){
				$(this).css({ 
					'background-color': 'rgba(3,148,203,0.5)',
					'box-shadow': 'none'
				});
				_this.mDHideAni();
				if(fnn){fnn();}

			})	
			ele.on('mouseout', function(){
				$(this).css({
					'background-color': '#00aeef',
					'box-shadow': 'none'
				});
			})
		},

		//list筛选 敲击enter键加载数据
		pickIptFocus: function(ele,fnn){
			var _this = this;
			ele.off("keyup");
			ele.on("keyup",function(ev){
				if(ev.keyCode == 13){
					_this.mDHideAni();
					if(fnn){fnn();}
				}
			})
		},

		//popup下拉 赋值data-value
		popup_pickValue: function(th){
			$(th).parents(".input-group-btn").siblings("input").val ( $(th).find("a").html() );
			$(th).parents(".input-group-btn").siblings("input").attr( 'data-value' , $(th).find("a").attr('data-value') );	
			$(th).parents(".dropdown-menu-right").hide();
			$(th).parents(".input-group-btn").children("button").attr("data-value",1);
		},

		//弹出框下拉 加载数据
		pickCheckPopup: function(ele, fn){
			var _this = this;
			ele.off('click');
			ele.on('click', function(ev){
				ev.stopPropagation();
				_this.popup_pickValue(this);
				if (fn){fn()};
			})
		},

		//弹出框 首次出现时，选项中一样的加上样式
		layerPDrop: function(){
			$(".dropdown-menu-right li").each(function(){
				if ( $(this).children("a").attr("data-value") == $(this).parents(".input-group-btn").siblings("input").attr("data-value") ) {
					$(this).children("a").css({
						"background-color": "#ccc",
						color: '#000'
					}).parent().siblings("li").children("a").css({
						"background-color": "",
						color: ''
					});
				}
			})
		},

		//弹出框  点击下拉按钮
		layerPDropBtn: function(ele){
			var _this = this;
			ele.off('click');
			ele.on('click', function(ev){
				ev.stopPropagation();
				$(this).siblings('ul').css({
					width: $(this).parents('.input-group').width()
				})

				_this.layerPDrop();

				if ($(this).attr("data-value") == 1) {
					$(this).parent().siblings("input").focus();
					$(this).attr("data-value",2);			
					$(this).siblings("ul").show();

					$(this).parents(".layer_p").siblings(".layer_p").find('.input-group input').blur();
					$(this).parents(".layer_p").siblings(".layer_p").find('.input-group .input-group-btn button').attr("data-value",1);
					$(this).parents(".layer_p").siblings(".layer_p").find('.input-group .input-group-btn ul').hide();

				} else if ($(this).attr("data-value") == 2){
					$(this).parent().siblings("input").blur();
					$(this).attr("data-value",1);
					$(this).siblings("ul").hide();
				}

			})
		},

		// 弹出框  点击下拉输入框
		layerPDropIpt: function(ele){
			var _this = this;
			ele.off('click');
			ele.on('click', function(ev){
				ev.stopPropagation();
				var that = this;
				var btn = $(that).siblings('.input-group-btn').children('button');
				btn.siblings('ul').css({
					width: $(that).parents('.input-group').width()
				})
				_this.layerPDrop();

				if (btn.attr("data-value") == 1) {
					$(that).focus();
					btn.attr("data-value",2);
					btn.siblings("ul").show();

					$(that).parents(".layer_p").siblings(".layer_p").find('.input-group input').blur();
					$(that).parents(".layer_p").siblings(".layer_p").find('.input-group .input-group-btn button').attr("data-value",1);
					$(that).parents(".layer_p").siblings(".layer_p").find('.input-group .input-group-btn ul').hide();
				} else if (btn.attr("data-value") == 2){
					$(that).blur();
					btn.attr("data-value",1);
					btn.siblings("ul").hide();
				}
			})
		},

		// 弹出框 点击空白处 下拉列表消失
		layerPDropHide: function(ele){
			ele.off('click');
			ele.on('click', function(){
				ele.find('.input-group input').blur();
				ele.find('.input-group-btn .dropdown-menu-right').hide();
				ele.find('.input-group-btn button').attr('data-value', 1);
			});
			$(".layui-layer-shade").off();
			$(".layui-layer-shade").on('click', function(){
				ele.find('.input-group input').blur();
				ele.find('.input-group-btn .dropdown-menu-right').hide();
				ele.find('.input-group-btn button').attr('data-value', 1);
			})
		},

		//订单详情编辑框初始赋值
		popup_Initfuzhi: function(ele, text){
			if ( text === [] || text === undefined || text === ""  ) { 
				ele.find("input").prop("checked",false);
			} else {
				ele.find("input").prop("checked",false);
				if ($.type(text) == "array"){
					ele.attr("data-value",text.join(","));
					ele.find("input").each(function(){
						if 		( text.indexOf($(this).val()) >-1  ) 	{ $(this).prop("checked",true); }
						else if ( text.indexOf($(this).val()) == -1 ) { $(this).prop("checked",false);}
					})
				} else{
					text = text.toString();
					ele.attr("data-value",text);
					ele.find("input").each(function(){
						$(this).val() == text ? $(this).prop("checked",true) : $(this).prop("checked",false);		
					})
				}
			};
		},

		//订单详情编辑框点选赋值data-value
		popup_changeFuzhi: function(ele){
			ele.find("input").change(function(){
				var result = [];
				for ( var i=0; i<ele.find("li").size(); i++ ){
					if ( ele.find("li").eq(i).find("input").is(":checked") ){
						result.push( ele.find("li").eq(i).find("input").val() );	
					}	
				}
				var re = result.join(",");
				ele.attr("data-value",re);
			})
		},

		// 图片，附件打开
		showImgFujian: function(){
			$(".addImgFujian").click(function(){
					if ($(this).attr("data-show") == 1){
						$(this).parents(".popupForm").find('.imgFujian').show();
						$(this).find('i').addClass('fa-caret-up').removeClass('fa-caret-down');
						$(this).attr("data-show", 2);
					} else {
						$(this).parents(".popupForm").find('.imgFujian').hide();
						$(this).find('i').addClass('fa-caret-down').removeClass('fa-caret-up');
						$(this).attr("data-show", 1);
					}
			});
		}
	};
	
	//返回字段 英文、Boolean值等转换为中文
	var tf = {
		isPro: function(id, da){//是否专业版、企业版  是否过期
			if(da === undefined ){
				id.html('否').css({ color: '#a2a2a2' });
			} else{
				id.html( timeUtils.msToDate(da) + '到期' );
				if ( da <= (+new Date(now)) ) {
					id.css({ color: '#d9534f' });							
				} else {							
					if ( da <= (+new Date(now) + 7*24*3600*1000) ) {
						id.css({ color: '#f0ad4e' });
					} else {
						id.css({ color: '#5cb853' });
					}
				}
			}
		},
		isWx: function(id, da){//是否绑定微信
			if ( da === '' || da === undefined ){
				id.html('否').css({ 'color': '#a2a2a2' });
			} else {
				id.html('是').css({ 'color': '#5cb853' });
			}
		},
		torf: function(id, da){//boolean 是否
			if (da === undefined){
				id.html('');
			} else {
				switch ( da.toString() ) {
					case 'true'	: id.html('是').css({ 'color': '#5cb853' });break;
					case 'false': id.html('否').css({ 'color': '#a2a2a2' });break;
					default 	: id.html('');
				}
			}
		},
		torf2: function(id, da){//boolean 禁止，正常
			if (da === undefined){
				id.html('');
			} else {
				switch ( da.toString() ) {
					case 'true'	: id.html('禁止').css({ 'color': '#d9534f' });break;
					case 'false': id.html('正常').css({ 'color': '#5cb853' });break;
					default 	: id.html('');
				}			
			}
		},
		isResolved: function(id, da){//boolean 已解决，未解决
			if (da === undefined){
				id.html('');
			} else {
				switch ( da.toString() ) {
					case 'true'	: id.html('已关闭').css({ 'color': '#5cb853' });	break;
					case 'false': id.html('未解决').css({ 'color': '#f0ad4e' });	break; 
					default 	: id.html('');
				}
			}
		},
		companyState: function(id, da){//公司 是否验证
			if(da === undefined){
				id.html('');
			}else{
				switch(da.toString()){
					case 'Ready': id.html('');break;
					case 'Approved': id.html('已认证');break;
					case 'Rejected': id.html('已拒绝');break;
					case 'Closed': id.html('已关闭');break;
					default: id.html('');
				}
			}
		},
		orderInvoice: function(id, da){//订单发票状态
			if (da === undefined){
				id.html('');
			} else {
				switch ( da.toString() ) {
					case 'true'	: id.html('已开').css({ 'color': '#5cb853' });	break;
					case 'false': id.html('未开').css({ 'color': '#f0ad4e' });	break; 
					default 	: id.html('');
				}
			}
		},
		orderState: function(id, da){//订单状态中英转换
			if (da === undefined){
				id.html('');
			} else {
				switch(da.toString()){
					case 'Ready'		: id.html('未开始').css({color: '#a2a2a2'});break;
					case 'Pending'	: id.html('进行中').css({color: '#00aeef'});break;
					case 'Success'	: id.html('支付成功').css({color: '#5cb853'});break;
					case 'Failed'		: id.html('支付失败').css({color: '#d9534f'});break;
					case 'Refunded'	: id.html('已退款').css({color: '#d9534f'});break;
					default 		: id.html('').css({color: '#a2a2a2'});
				}
			}
		},
		orderPayType: function(id, da){//订单付款方式中英转换
			if (da === undefined){
				return '';
			} else {
				switch(da.toString()){
					case 'Weixin'	: id.html('微信');break;
					case 'Alipay'	: id.html('支付宝');break;
					case 'Offline'	: id.html('线下');break;
					default 		: id.html('其它');
				}
			}
		},
		customerType: function(id, da){//客户列表  客户类型
			if (da === undefined){
				id.html('');
			} else {
				switch(da.toString()){
					case 'ProProject'	: id.html('专业版');break;
					case "ProUser"	: id.html('企业账号');break;
					default 		: id.html('其它');
				}
			}
		},
		customerOrderType: function(id, da){//客户列表  订单类型
			if (da === undefined){
				id.html('');
			} else {
				switch(da.toString()){
					case 'ProjectPro1Month'	: id.html('专业版包1个月');break;
					case 'ProjectPro3Month'	: id.html('专业版包3个月');break;
					case 'ProjectPro6Month'	: id.html('专业版包6个月');break;
					case 'ProjectPro12Month'	: id.html('专业版包12个月');break;

					case 'UserPro1Month'	: id.html('企业版包1个月');break;
					case 'UserPro3Month'	: id.html('企业版包3个月');break;
					case 'UserPro6Month'	: id.html('企业版包6个月');break;
					case 'UserPro12Month'	: id.html('企业版包12个月');break;
					default 		: id.html('其它');
				}
			}
		},
		customerExpireDate: function(id, da){//客户列表 是否过期
			if(da === undefined ){
				id.html('').css({ color: '#a2a2a2' });
			} else{
				id.html( timeUtils.msToDate(da) + '到期' );
				if ( da <= (+new Date(now)) ) {
					id.css({ color: '#d9534f' });							
				} else {							
					if ( da <= (+new Date(now) + 15*24*3600*1000) ) {
						id.css({ color: '#f0ad4e' });
					} else {
						id.css({ color: '#5cb853' });
					}
				}
			}
		},
		adminExpireTime: function(id, da){//管理员有效期时间转换
			if (da === undefined){
				id.html('');
			} else {
				id.html( timeUtils.msToDate(da) );
				if ( da <= (+new Date(now)) ) {
					id.css({ color: '#d9534f' });
				} else {
					id.css({ color: '#5cb853' });
				}		
			}
		},
		adminRoles: function(dataRoles){//管理员home-角色中英替换
			if ( dataRoles === [] || dataRoles === undefined || dataRoles === "" ) {
				return '';
			} else {
				if ( dataRoles.indexOf("Admin") 		> -1 ) { dataRoles.splice( dataRoles.indexOf("Admin"),			1,"系统管理" ); }
				if ( dataRoles.indexOf("UserManage") 	> -1 ) { dataRoles.splice( dataRoles.indexOf("UserManage"),		1,"用户管理" ); }		
				if ( dataRoles.indexOf("ProjectManage") > -1 ) { dataRoles.splice( dataRoles.indexOf("ProjectManage"),	1,"项目管理" ); }
				if ( dataRoles.indexOf("OrderManage") 	> -1 ) { dataRoles.splice( dataRoles.indexOf("OrderManage"),	1,"订单管理" ); }
				if ( dataRoles.indexOf("Config") 		> -1 ) { dataRoles.splice( dataRoles.indexOf("Config"),			1,"头像管理" ); }
				return dataRoles.join("，");
			}			
		},
		adminRole: function(dataRole){
			switch( dataRole.toString() ){
				case 'Admin': 			return '系统管理';break;
				case 'UserManage': 		return '用户管理';break;
				case 'ProjectManage': 	return '项目管理';break;
				case 'OrderManage': 	return '订单管理';break;
				case 'Config': 			return '头像管理';break;
				default: return '';
			}
		},
	}




	return{
		fn: fn,
		tf: tf,	//true or false
	}
})

	


	


