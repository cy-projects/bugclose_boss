/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
define(['xml','timeUtils','base','allow', 'popup','upload'],function(xml,timeUtils,base,allow, popup, upload){

	//详情页出现(样式)
	var detailShow = function(ev, th, fn){
		ev.stopPropagation();
		if ( $(th).hasClass("main_table_tbody_tr_active") ){
			base.fn.mDHideAni();
		} else{
			$(".main_detail").addClass("main_detail_active");
			$(th).addClass("main_table_tbody_tr_active").siblings("tr").removeClass("main_table_tbody_tr_active");
			if (fn) {fn();}
		}
	}
	//详情页消失(样式)
	var detailHide = function(){
		$(document).click(function(event){
			var target = $(event.target);
			// console.log(target)
			//closest() 方法获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。
			// console.log(target.parents('.input-group').length)
			if(target.closest('.mainNav, .main_detail, .layui-layer, .layui-layer-shade, .datetimepicker, .layui-layer-close, .layui-layer-btn, .del, .edit, .ui-opts ').length != 0){
			}else{
				base.fn.mDHideAni();
			}
		});
		$(document).on("click",".main_detail_hidden",function(ev){
			ev.stopPropagation();
			base.fn.mDHideAni();
		})
	}
	detailHide();
	//home页 数据
	var list = {
		userCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'user/count',
				dataJson: {
					id: 			$("#userList_id").val(),
					projectId: 		$("#userList_projectId").val(),
					email: 			$("#userList_email").val(),
					phone: 			$("#userList_phone").val(),
					ip:				$("#userList_registerIP").val(),
					isPro: 			$('.userList_isProDropdown strong').attr('data-value'),
					isProExpired: 	$('.userList_isProDropdown strong').attr('data-name'),
					disabled: 		$('.userList_stateDropdown strong').attr('data-value'),
					emailVerified: 	$('.userList_emailVerifiedDropdown strong').attr('data-value'),
					phoneVerified: 	$('.userList_phoneVerifiedDropdown strong').attr('data-value'),
					wx: 			$('.userList_wxVerifiedDropdown strong').attr('data-value')
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						userTotal = (data.root) + 50000;
					} else{
						userTotal = data.root;
					}
					$(".userList_table >thead strong.allCount").html('共'+ userTotal +'条记录');
					if ( data.root <= 20 ) {
						$(".userListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.userHome(0);
					} else {
						$(".userListPagination").pagination(data.root,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: userListPaginationCallback,		//回调函数
						}) 
						function userListPaginationCallback(index) {
							self.userHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){ base.fn.mDHideAni(); })
						}
					}
				} else { errorType(data); }
			})
		},
		userHome: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'user/query',
				dataJson: {
					id: 			$("#userList_id").val(),
					projectId: 		$("#userList_projectId").val(),
					email: 			$("#userList_email").val(),
					phone: 			$("#userList_phone").val(),
					ip:				$("#userList_registerIP").val(),
					isPro: 			$('.userList_isProDropdown strong').attr('data-value'),
					isProExpired: 	$('.userList_isProDropdown strong').attr('data-name'),
					disabled: 		$('.userList_stateDropdown strong').attr('data-value'),
					emailVerified: 	$('.userList_emailVerifiedDropdown strong').attr('data-value'),
					phoneVerified: 	$('.userList_phoneVerifiedDropdown strong').attr('data-value'),
					wx: 			$('.userList_wxVerifiedDropdown strong').attr('data-value'),
					sorting: 		$(".userList_table >thead >tr").attr("data-value"),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".userList_table").children("tbody").html('');
					for (var i=0 ;i<data.root.length; i++ ) {
						var userList = data.root[i];
						if (GLOBAL.demoFlag == true){
							newId = (userList.id) + 50000;
						} else {
							newId = userList.id;
						}
					//主页赋值
						$(".userList_table").children("tbody").append( 
							'<tr data-value="'+ userList.id +'"><td><span>'	+ newId +
							'</span></td><td><span>'+ filterS( userList.email ) +
							'</span></td><td><span>'+ filterS( userList.phone ) +
							'</span></td><td><span>'+ filterS( userList.jobTitle ) +
							'</span></td><td><span class="isWx">' +
							'</span></td><td><span class="isPro">' +
							'</span></td><td><span class="isDisabled">' + 
							'</span></td><td><span class="isEmailVerified">' +
							'</span></td><td><span>'+ filterS( userList.registerIP ) +
							'</span></td><td class="hideTime"><span>'+ timeUtils.msToDateTime( userList.registerTime ) +
							'</span></td></tr>' 
						);
						base.tf.isWx($(".userList_table tbody >tr").eq(i).find('span.isWx'), userList.wxOpenid);
						base.tf.isPro($(".userList_table tbody >tr").eq(i).find('span.isPro'), userList.proExpireDate);
						base.tf.torf2($(".userList_table tbody >tr").eq(i).find('span.isDisabled'), userList.disabled);
						base.tf.torf($(".userList_table tbody >tr").eq(i).find('span.isEmailVerified'), userList.emailVerified);					
					}
					base.fn.mainTableSort($(".userList_table >thead >tr >th"), function(){self.userCount();});
					base.fn.pickCheck($(".mainFilterUserList .main_drop_menu li"), function(){self.userCount();});
					base.fn.pickBtnDown($(".mainFilterUserList .main_dropdown button"), function(){self.userCount();});
					base.fn.pickIptFocus($(".mainFilterUserList .main_dropdown input"), function(){self.userCount();});

					detailModal.user();
					$(".userList_table >tbody >tr").each(function(){base.fn.mdOptTableTrKeepBg(this);})
				} else { errorType(data); }
			})
		},
		userQCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'help/count',
				dataJson: {
					userId: 	$("#userQList_userId").val(),
					keyword: 	$("#userQList_keyword").val(),
					resolved: 	$('.userQList_isProDropdown strong').attr('data-value')
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					$(".userQList_table >thead strong.allCount").html('共'+ data.root +'条记录');
					if ( data.root <= 20 ) {
						$(".userQListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.userQHome(0);
					} else {
						$(".userQListPagination").pagination(data.root,{
							num_edge_entries: 1,
							num_display_entries: 4,
							items_per_page:20,
							current_page: 0,
							prev_text: '上一页',
							next_text: '下一页',
							callback: userQListPaginationCallback,
						}) 
						function userQListPaginationCallback(index) {
							self.userQHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){ base.fn.mDHideAni(); })
						}
					}
				} else { errorType(data); }
			})
		},
		userQHome: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'help/query',
				dataJson: {
					userId: 	$("#userQList_userId").val(),
					keyword: 	$("#userQList_keyword").val(),
					resolved: 	$('.userQList_isProDropdown strong').attr('data-value'),
					sorting: 	$(".userQList_table >thead >tr").attr("data-value"),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".userQList_table").children("tbody").html('');
					for (var i=0 ;i<data.root.length; i++ ) {
						var userQList = data.root[i];
						if (GLOBAL.demoFlag == true){
							userNewId = userQList.userId + 50000;
						} else {
							userNewId = userQList.userId;
						}
					//主页赋值
						$(".userQList_table").children("tbody").append( 
							'<tr data-value="'+ userQList.id +'"><td><span>'	+ userQList.id +
							'</span></td><td><span>'+ userNewId +
							'</span></td><td><span>'+ filterS( userQList.fullName ) +
							'</span></td><td><span>'+ filterSS( userQList.phone ) +
							'</span></td><td><span>'+ filterS( userQList.company ) +
							'</span></td><td><span class="isResolvedTdColor">' + 
							'</span></td><td><span>'+ timeUtils.msToDateTime( userQList.createdTime ) +
							'</span></td><td><span>'+ timeUtils.msToDateTime( userQList.modifiedTime ) +
							'</span></td></tr>' 
						);
						base.tf.isResolved($(".userQList_table tbody >tr").eq(i).find('span.isResolvedTdColor'), userQList.resolved);
					}
					base.fn.mainTableSort($(".userQList_table >thead >tr >th"), function(){self.userQCount();});
					base.fn.pickCheck($(".mainFilterUserQList .main_drop_menu li"), function(){self.userQCount();});
					base.fn.pickBtnDown($(".mainFilterUserQList .main_dropdown button"), function(){self.userQCount();});
					base.fn.pickIptFocus($(".mainFilterUserQList .main_dropdown input"), function(){self.userQCount();});

					detailModal.userQ();
					$(".userQList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		},
		invitedCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'invited/count',
				dataJson: {
					fromUserId: $("#invitedList_fromUserId").val()
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					$(".invitedList_table >thead strong.allCount").html('共'+ data.root +'条记录');
					if ( data.root <= 20 ) {
						$(".invitedListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.invitedHome(0);
					} else {
						$(".invitedListPagination").pagination(data.root,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: invitedListPaginationCallback,		//回调函数
						}) 
						function invitedListPaginationCallback(index) {
							self.invitedHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){ base.fn.mDHideAni(); })
						}
					}
				} else { errorType(data); }
			})
		},
		invitedHome: function(number){
			var self = this;
				bugAjax({
				type : 'get',
				url : 'invited/query',
				dataJson: {
					fromUserId: $("#invitedList_fromUserId").val(),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".invitedList_table").children("tbody").html('');
					for (var i=0 ;i<data.root.length; i++ ) {
						var invitedList = data.root[i];
						if (GLOBAL.demoFlag == true){
							fromUserNewId = filterSS(invitedList.fromUserId) + 50000;
							toUserNewId = filterSS(invitedList.toUserId) + 50000;
						} else {
							fromUserNewId = filterSS(invitedList.fromUserId);
							toUserNewId = filterSS(invitedList.toUserId);
						}
					//主页赋值
						$(".invitedList_table").children("tbody").append( 
							'<tr data-value="'+ invitedList.id +'"><td><span>'	+ invitedList.id +
							'</span></td><td><span data-value="'+ filterSS( invitedList.fromUserId ) +'">'+ fromUserNewId +
							'</span></td><td><span data-value="'+ filterSS( invitedList.toUserId ) 	+'">'+ toUserNewId +
							'</span></td><td><span>'+ timeUtils.msToDateTime( invitedList.invitedTime ) +
							'</span></td></tr>' 
						);
					}

					base.fn.pickBtnDown($(".mainFilterinvitedList .main_dropdown button"), function(){self.invitedCount();});
					base.fn.pickIptFocus($(".mainFilterinvitedList .main_dropdown input"), function(){self.invitedCount();});

					detailModal.invited();
					$(".invitedList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		},
		companyCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'company/count',
				dataJson: {
					state: $('.companyList_stateDropdown strong').attr('data-value'),
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					$(".companyList_table >thead strong.allCount").html('共'+ data.root +'条记录');
					if ( data.root <= 20 ) {
						$(".companyListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.companyHome(0);
					} else {
						$(".companyListPagination").pagination(data.root,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: companyListPaginationCallback,		//回调函数
						}) 
						function companyListPaginationCallback(index) {
							self.companyHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){base.fn.mDHideAni();})
						}
					}
				} else { errorType(data); }
			})
		},
		companyHome: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'company/query',
				dataJson: {
					state: 			$('.companyList_stateDropdown strong').attr('data-value'),
					sorting: 		$(".companyList_table >thead >tr").attr("data-value"),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".companyList_table").children("tbody").html('');
					for (var i=0 ;i<data.root.length; i++ ) {
						var companyList = data.root[i];
					//主页赋值
						$(".companyList_table").children("tbody").append(
							'<tr data-value="'+ companyList.id +'"><td><span>'	+ companyList.id +
							'</span></td><td><span>'+ filterS( companyList.name ) +
							'</span></td><td><span>'+ filterS( companyList.phone ) +
							'</span></td><td><span class="state">'+
							'</span></td><td><span>'+ filterS( companyList.title ) +
							'</span></td></tr>' 
						);
						base.tf.companyState($(".companyList_table tbody >tr").eq(i).find('span.state'), companyList.state);

					}

					base.fn.mainTableSort($(".companyList_table >thead >tr >th"), function(){self.companyCount();});
					base.fn.pickCheck($(".mainFilterCompanyList .main_drop_menu li"), function(){self.companyCount();});


					detailModal.company();
					$(".companyList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		},
		projectCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'project/count',
				dataJson: {
					id: 			$("#projectList_id").val(),
					ownerId: 		$("#projectList_ownerId").val(),
					memberId: 		$("#projectList_memberId").val(),
					ip:				$("#projectList_createdIP").val(),
					isPro: 			$('.projectList_isProDropdown strong').attr('data-value'),
					isProExpired: 	$('.projectList_isProDropdown strong').attr('data-name'),
					disabled: 		$('.projectList_stateDropdown strong').attr('data-value'),
					deleted: 		$('.projectList_stateDropdown strong').attr('data-name')
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						projectTotal = (data.root) + 30000;
					} else {
						projectTotal = data.root;
					}
					$(".projectList_table >thead strong.allCount").html('共'+ projectTotal +'条记录');
					if ( data.root <= 20 ) {
						$(".projectListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.projectHome(0);
					} else {
						$(".projectListPagination").pagination(data.root,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: projectListPaginationCallback,		//回调函数
						}) 
						function projectListPaginationCallback(index) {
							self.projectHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){base.fn.mDHideAni();})
						}
					}
				} else { errorType(data); }
			})
		},
		projectHome: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'project/query',
				dataJson: {
					id: 			$("#projectList_id").val(),
					ownerId: 		$("#projectList_ownerId").val(),
					memberId: 		$("#projectList_memberId").val(),
					ip:				$("#projectList_createdIP").val(),
					isPro: 			$('.projectList_isProDropdown strong').attr('data-value'),
					isProExpired: 	$('.projectList_isProDropdown strong').attr('data-name'),
					disabled: 		$('.projectList_stateDropdown strong').attr('data-value'),
					deleted: 		$('.projectList_stateDropdown strong').attr('data-name'),
					sorting: 		$(".projectList_table >thead >tr").attr("data-value"),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".projectList_table").children("tbody").html('');
					for (var i=0 ;i<data.root.length; i++ ) {
						var projectList = data.root[i];
						if (GLOBAL.demoFlag == true){
							newId = (projectList.id) + 30000;
							ownerNewId = (projectList.ownerId) + 50000;
						} else {
							newId = projectList.id;
							ownerNewId = projectList.ownerId;
						}
					//主页赋值
						$(".projectList_table").children("tbody").append(
							'<tr data-value="'+ projectList.id +'"><td><span>'	+ newId +
							'</span></td><td><span>'+ filterS( projectList.name ) +
							'</span></td><td><span>'+ projectList.userNumber +
							'</span></td><td><span>'+ ownerNewId +
							'</span></td><td><span>'+ filterS( projectList.owner.phone ) +
							'</span></td><td><span class="isProTdColor">'+ '' + 
							'</span></td><td><span class="isDisabledTdColor">' +
							'</span></td><td><span>'+ filterS( projectList.createdIP ) +
							'</span></td><td class="hideTime"><span>'+ timeUtils.msToDateTime( projectList.createdTime ) +
							'</span></td></tr>' 
						);
						base.tf.isPro($(".projectList_table tbody >tr").eq(i).find('span.isProTdColor'), projectList.proExpireDate);
						var isDisabledTdColor = $(".projectList_table tbody >tr").eq(i).find('span.isDisabledTdColor');
						if ( projectList.deleted == false ){
							if ( projectList.disabled == false ){
								isDisabledTdColor.html('正常').css({ 'color': '#5cb853' });
							} else if ( projectList.disabled == true ){
								isDisabledTdColor.html('禁止').css({ 'color': '#d9534f' });
							}
						} else if ( projectList.deleted == true ){
							isDisabledTdColor.html('已删除').css({ 'color': '#d9534f' });
						}

					}
					base.fn.mainTableSort($(".projectList_table >thead >tr >th"), function(){self.projectCount();});
					base.fn.pickCheck($(".mainFilterProjectList .main_drop_menu li"), function(){self.projectCount();});
					base.fn.pickBtnDown($(".mainFilterProjectList .main_dropdown button"), function(){self.projectCount();});
					base.fn.pickIptFocus($(".mainFilterProjectList .main_dropdown input"), function(){self.projectCount();});

					detailModal.project();
					$(".projectList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		},
		orderCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'order/count',
				dataJson: {				
					orderType: 	$('.orderList_isProDropdown strong').attr('data-value'),
					state: 		$('.orderList_stateDropdown strong').attr('data-value'),
					invoiced: 	$('.orderList_invoiceDropdown strong').attr('data-value'),
					projectId: 	$("#orderList_projectId").val(),
					userId:		$("#orderList_userId").val(),
					orderNo:	$("#orderList_orderNo").val()
				}
			},function(data){
				console.log(data.root,data);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						orderTotal = (data.root)*3;
					} else {
						orderTotal = data.root;
					}
					$(".orderList_table >thead strong.allCount").html('共'+ orderTotal +'条记录');
					if ( data.root <= 20 ) {
						$(".orderListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.orderHome(0);
					} else {
						$(".orderListPagination").pagination(data.root,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: orderListPaginationCallback,		//回调函数
						}) 
						function orderListPaginationCallback(index) {
							self.orderHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){ base.fn.mDHideAni(); })
						}
					}
				} else { errorType(data); }
			})
		},
		orderHome: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'order/query',
				dataJson: {
					orderType: 	$('.orderList_isProDropdown strong').attr('data-value'),
					state: 		$('.orderList_stateDropdown strong').attr('data-value'),
					invoiced: 	$('.orderList_invoiceDropdown strong').attr('data-value'),
					projectId: 	$("#orderList_projectId").val(),
					userId:		$("#orderList_userId").val(),
					orderNo:	$("#orderList_orderNo").val(),
					sorting: 	$(".orderList_table >thead >tr").attr("data-value"),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".orderList_table").children("tbody").html('');
					for (var i=0 ;i<data.root.length; i++ ) {
						var orderList = data.root[i];
						if (GLOBAL.demoFlag == true){
							newId = (orderList.id)*3;
							projectNewId = (orderList.projectId) + 30000;
							userNewId = (orderList.userId) + 50000;
						} else {
							newId = orderList.id;
							projectNewId = orderList.projectId;
							userNewId = orderList.userId;
						}
					//主页赋值
						$(".orderList_table").children("tbody").append(
							'<tr data-value="'+ orderList.id +'"><td><span>'	+ newId +
							'</span></td><td><span>'+ orderList.orderNo +
							'</span></td><td><span>'+ projectNewId +
							'</span></td><td><span>'+ userNewId +
							'</span></td><td><span>'+ filterS( orderList.subject ) +
							'</span></td><td><span>'+ (parseFloat((orderList.fee)/100)).toFixed(2) +
							'</span></td><td><span class="state">' +
							'</span></td><td><span class="invoice">' +
							'</span></td><td><span class="payType">'+ orderList.payType +
							'</span></td><td class="hideTime"><span>'+ timeUtils.msToDateTime( orderList.orderTime ) +
							'</span></td></tr>' 
						);
						base.tf.orderState($(".orderList_table tbody >tr").eq(i).find('span.state'), orderList.state);
						base.tf.orderPayType($(".orderList_table tbody >tr").eq(i).find('span.payType'), orderList.payType);
						if (orderList.state == 'Success'){
							base.tf.orderInvoice($(".orderList_table tbody >tr").eq(i).find('span.invoice'), orderList.invoiced);
						} else{
							$(".orderList_table tbody >tr").eq(i).find('span.invoice').html('');
						}

					}
					base.fn.mainTableSort($(".orderList_table >thead >tr >th"), function(){self.orderCount();});
					base.fn.pickCheck($(".mainFilterOrderList .main_drop_menu li"), function(){self.orderCount();});
					base.fn.pickBtnDown($(".mainFilterOrderList .main_dropdown button"), function(){self.orderCount();});
					base.fn.pickIptFocus($(".mainFilterOrderList .main_dropdown input"), function(){self.orderCount();});

					detailModal.order();
					$(".orderList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		},
		customerList: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'customer/list'
			},function(data){
				// console.log(data.root);
				if (data.success) {
					var res = data.root;

					for (var i=0; i < res.length; i++){
						var item = res[i];
						if (item.buyer.phone){
							item['phone'] = item.buyer.phone;
						} else{
							item['phone'] = '';
						}
					}

					self.customerFilter(res, number);
				} else { errorType(data); }
			})
		},
		customerFilter: function(res, number){
			var self = this;

			// 筛选客户类型
			var resCustomerType = [];
			var regCustomerType = new RegExp( $.trim($(".customerList_customerType").find('strong').attr("data-value")), "i");	//注意g 的bug

			for (var i=0; i<res.length; i++){
				var item = res[i];
				if ( regCustomerType.test(item.customerType) ){
					resCustomerType.push(item);
				}
			}

			// 筛选是否过期
			var resIsExpire = [];
			var regIsExpire = $.trim($(".customerList_isExpire").find('strong').attr("data-value"));
			if (regIsExpire == 'true'){
				for (var i=0; i<resCustomerType.length; i++){
					var item = resCustomerType[i];
					if (item.expireDate < (+new Date(now))){
						resIsExpire.push(item);
					}
				}
			} else if(regIsExpire == 'false'){
				for (var i=0; i<resCustomerType.length; i++){
					var item = resCustomerType[i];
					if ( item.expireDate >= (+new Date(now) + 15*24*3600*1000) ){
						resIsExpire.push(item);
					}
				}
			} else if(regIsExpire == 'willExpire'){
				for (var i=0; i<resCustomerType.length; i++){
					var item = resCustomerType[i];
					if (item.expireDate < (+new Date(now) + 15*24*3600*1000)  && item.expireDate > (+new Date(now)) ){
						resIsExpire.push(item);
					}
				}
			} else{
				for (var i=0; i<resCustomerType.length; i++){
					var item = resCustomerType[i];
					resIsExpire.push(item);
				}
			}

			// 筛选订单类型
			var resOrderType = [];
			var regOrderType = new RegExp( $.trim($(".customerList_orderType").find('strong').attr("data-value")), "i");	//注意g 的bug

			for (var i=0; i<resIsExpire.length; i++){
				var item = resIsExpire[i];
				if ( regOrderType.test(item.orderType) ){
					resOrderType.push(item);
				}
			}

			// 查询付款人ID
			var resBuyId = [];				
			for (var i=0; i<resOrderType.length; i++){
				var item = resOrderType[i];
				if ($.trim($("#customerList_buyId").val()) == ''){
					resBuyId.push(item);
				} else if ($.trim($("#customerList_buyId").val()) == item.buyer.id){
					resBuyId.push(item);
				} 
			}

			// 查询邮箱
			var resBuyEmail = [];
			var regBuyEmail = new RegExp( $.trim($("#customerList_buyEmail").val()), "i");
			for (var i=0; i<resBuyId.length; i++){
				var item = resBuyId[i];
				if ( regBuyEmail.test(item.buyer.email) ){
					resBuyEmail.push(item);
				}
			}

			// 查询手机
			var resBuyPhone = [];
			var regBuyPhone = new RegExp( $.trim($("#customerList_buyPhone").val()), "i");

			for (var i=0; i<resBuyEmail.length; i++){
				var item = resBuyEmail[i];
				if ( regBuyPhone.test(item.buyer.phone) ){
					resBuyPhone.push(item);
				}
			}

			//排序
			var sortTr = $(".customerList_table").children("thead").children("tr").attr("data-value") || '';

			if (sortTr != ''){

				var sortArr = sortTr.split(' ');

				var sortStr = sortArr[0];
				var sortTurn = sortArr[sortArr.length-1];
				
				console.log(sortStr, sortTurn)

				base.fn.sortAgainJson(resBuyPhone, sortStr, sortTurn);
			}
			//续费率
			var reNewNumber = 0;
			for (var i=0; i<resBuyPhone.length; i++){
				if (resBuyPhone[i].renew > 0){
					reNewNumber ++;
				}			
			}
			var renewPercent = parseFloat((reNewNumber / resBuyPhone.length) * 100 ).toFixed(2) + '%';
			if (resBuyPhone.length > 0){
				$(".customerRenewPercent").find('span').html('续费率：' + renewPercent);
			} else {
				$(".customerRenewPercent").find('span').html('');
			}
			
			$(".customerList_table >thead strong.allCount").html('共'+ resBuyPhone.length +'条记录');
			self.customerHome(resBuyPhone, res, number);
		},
		customerHome: function(res, resTotal, number){
			var self = this;
			// console.log('我是处理后的数据', res);

			function customerTableGetData(resFirst, resNum, res){
				for (var i = resFirst; i < resNum; i++){
					var resItem = res[i];

					var customerName;
					if (resItem.customerType == "ProProject"){
						customerName = filterS(resItem.name);
					} else{
						customerName = filterS(resItem.buyer.userName);
					};

					$(".customerList_table").children("tbody").append( 
						'<tr data-value="'+ resItem.id +'"><td><span>'	+ resItem.id +
						'</span></td><td><span>'+ customerName +
						'</span></td><td><span class="customerType">'+ 
						'</span></td><td><span class="expireDate">'+ 
						'</span></td><td><span>' + filterSS(resItem.renew) +
						'</span></td><td><span class="orderType">' +
						'</span></td><td><span>' + resItem.userNumber +
						'</span></td><td><span>' + resItem.buyer.id +
						'</span></td><td><span>' + filterS(resItem.buyer.email) +
						'</span></td><td><span>' + filterS(resItem.buyer.phone) +
						'</span></td></tr>' 
					);

					base.tf.customerExpireDate($(".customerList_table tbody >tr").eq(i-resFirst).find('span.expireDate'), resItem.expireDate);
					base.tf.customerType($(".customerList_table tbody >tr").eq(i-resFirst).find('span.customerType'), resItem.customerType);
					base.tf.customerOrderType($(".customerList_table tbody >tr").eq(i-resFirst).find('span.orderType'), resItem.orderType);
				}

				detailModal.customer(resTotal);
			}

			if ( res.length <= 20 ) {
				$(".customerList_table").children("tbody").html('');
				$(".customerListPagination").html('');
				$(".main_pagination").attr("data-value",0);

				customerTableGetData(0, res.length, res);

			} else {
				$(".customerListPagination").pagination(res.length,{
					num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
					num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
					items_per_page:20, 						//每页显示的条目数
					current_page: number || 0,						//当前选中的页面
					prev_text: '上一页',
					next_text: '下一页',
					callback: customerListPaginationCallback,		//回调函数
				})				

				function customerListPaginationCallback(index) {
					$(".customerList_table").children("tbody").html(''); 
					$(".main_pagination").attr("data-value",index);

					var theLastPage = (res.length)%20;		//最后一页的个数
					var theLastPageIndex = parseInt((res.length)/20);	//最后一页的index

					if ( index == theLastPageIndex ) {
						customerTableGetData(index*20, (index*20 + theLastPage), res);
					} else {
						customerTableGetData(index*20, (index*20+20), res);
					}

					$(".pagination a").click(function(){ base.fn.mDHideAni(); })
				}
			}

			base.fn.mainTableSort($(".customerList_table >thead >tr >th"), function(){self.customerFilter(resTotal);});
			base.fn.pickCheck($(".mainFilterCustomerList .main_drop_menu li"), function(th){
				var clickParentsType = $(th).parents(".mainNav").attr("data-type");
				var clickType = $(th).attr("data-value");

				if (clickParentsType == 'customerType'){
					if (clickType == 'ProProject'){
						$(".customerList_orderType").find('strong').attr("data-value", "");
						$(".customerList_orderType").find('strong').html('订单类型：全部');

						$('.customerDropMenu_orderType').html(
							'<li><a href="javascript:void(0);" data-value="">订单类型：全部</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro1Month">专业版包1个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro3Month">专业版包3个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro6Month">专业版包6个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro12Month">专业版包12个月</a></li>'
						);
					} else if (clickType == 'ProUser'){
						$(".customerList_orderType").find('strong').attr("data-value", "");
						$(".customerList_orderType").find('strong').html('订单类型：全部');

						$('.customerDropMenu_orderType').html(
							'<li><a href="javascript:void(0);" data-value="">订单类型：全部</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro1Month">企业版包1个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro3Month">企业版包3个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro6Month">企业版包6个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro12Month">企业版包12个月</a></li>'
						);
					} else{
						$(".customerList_orderType").find('strong').attr("data-value", "");
						$(".customerList_orderType").find('strong').html('订单类型：全部');

						$('.customerDropMenu_orderType').html(
							'<li><a href="javascript:void(0);" data-value="">订单类型：全部</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro1Month">专业版包1个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro3Month">专业版包3个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro6Month">专业版包6个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="ProjectPro12Month">专业版包12个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro1Month">企业版包1个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro3Month">企业版包3个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro6Month">企业版包6个月</a></li>'+
							'<li><a href="javascript:void(0);" data-value="UserPro12Month">企业版包12个月</a></li>'
						);
					}
				} else if(clickParentsType == 'orderType'){
					if (clickType.indexOf('ProjectPro') > -1){
						$(".customerList_customerType").find('strong').attr("data-value", "ProProject");
						$(".customerList_customerType").find('strong').html('专业版');
					} else if(clickType.indexOf('UserPro') > -1){
						$(".customerList_customerType").find('strong').attr("data-value", "ProUser");
						$(".customerList_customerType").find('strong').html('企业用户');
					} else{}

				}
				
				self.customerFilter(resTotal);
			});

			base.fn.pickBtnDown($(".mainFilterCustomerList .main_dropdown button"), function(){self.customerFilter(resTotal);});
			base.fn.pickIptFocus($(".mainFilterCustomerList .main_dropdown input"), function(){self.customerFilter(resTotal);});

			$(".customerList_table >tbody >tr").each(function(){base.fn.mdOptTableTrKeepBg(this);})

			if (number !== undefined) detail.customer(resTotal);
		},
		adminHome: function(){
			bugAjax({
				type : 'get',
				url : 'manager/list'
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".adminList_table").children("tbody").html('');
					// $(".adminList_table >thead strong.allCount").html('共'+ data.root.length +'条记录');
					for (var i=0 ;i<data.root.length; i++ ) {
						var adminList = data.root[i];
					//主页赋值
						$(".adminList_table").children("tbody").append(
							'<tr data-value="'+ adminList.id +'"><td><span>'	+ adminList.id +
							'</span></td><td><span>'+ adminList.username +
							'</span></td><td><span>'+ adminList.fullName +
							'</span></td><td><span class="isDisabledTdColor">' +
							'</span></td><td><span>'+ base.tf.adminRoles(adminList.roles) +
							'</span></td><td><span class="isExpireTdColor">'+ 
							'</span></td></tr>'
						);
						base.tf.adminExpireTime($(".adminList_table tbody >tr").eq(i).find('span.isExpireTdColor'), adminList.expireTime);
						base.tf.torf2($(".adminList_table tbody >tr").eq(i).find('span.isDisabledTdColor'), adminList.disabled );

					}
					detailModal.admin();
					$(".adminList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		},
		blackHome: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'blacklist/list'
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					//查询
					var blackResult = [];
					for (var i=0; i<data.root.length; i++){
						if ( data.root[i].indexOf($("#blackList_IP").val().trim()) > -1 ){
							blackResult.push(data.root[i]);
						}
					}
					$(".blackList_table >thead strong.allCount").html('共'+ blackResult.length +'条记录');

					if ( blackResult.length <= 20 ) {
						$(".blackList_table").children("tbody").html('');
						$(".blackListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						for (var i=0; i<blackResult.length; i++){
							var blackList = blackResult[i];
							$(".blackList_table").children("tbody").append(
								'<tr data-value="'+ blackResult[i] +'"><td><span>'	+ blackResult[i] +
								'</span></td><td><span class="blackListDelTd">删除</span></td></tr>'
							);
						}
						detailOpt.black.del();
					} else {
						$(".blackListPagination").pagination(blackResult.length,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: blackListPaginationCallback,		//回调函数
						}) 
						function blackListPaginationCallback(index) {
							$(".main_pagination").attr("data-value",index);
							$(".blackList_table").children("tbody").html('');
							var theLastPage = (blackResult.length)%20;		//最后一页的个数
							var theLastPageIndex = parseInt((blackResult.length)/20);	//最后一页的index
							if ( index == theLastPageIndex ) {
								for (var i=index*20; i<(index*20+theLastPage); i++){
									var blackList = blackResult[i];
									$(".blackList_table").children("tbody").append(
										'<tr data-value="'+ blackResult[i] +'"><td><span>'	+ blackResult[i] +
										'</span></td><td><span class="blackListDelTd">删除</span></td></tr>'
									);
								}
							} else {
								for (var i=index*20; i<(index*20+20); i++){
									var blackList = blackResult[i];
									$(".blackList_table").children("tbody").append(
										'<tr data-value="'+ blackResult[i] +'"><td><span>'	+ blackResult[i] +
										'</span></td><td><span class="blackListDelTd">删除</span></td></tr>'
									);
								}
							}
							detailOpt.black.del();
						}
					}
					base.fn.pickBtnDown($(".mainFilterBlackList .main_dropdown button"), function(){self.blackHome();});
					base.fn.pickIptFocus($(".mainFilterBlackList .main_dropdown input"), function(){self.blackHome();});
				} else { errorType(data); }
			})
		},
		appCount: function(){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'appVersion/count',
				dataJson: {
					appType: $(".appList_typeDropdown strong").attr("data-value"),
					name: 	 $("#appList_name").val(),
					build: 	 $("#appList_bulid").val()
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					$(".appList_table >thead strong.allCount").html('共'+ data.root +'条记录');
					if ( data.root <= 20 ) {
						$(".appListPagination").html('');
						$(".main_pagination").attr("data-value",0);
						self.appHome(0);
					} else {
						$(".appListPagination").pagination(data.root,{
							num_edge_entries: 1, 					//两侧显示的首尾分页的条目数
							num_display_entries: 4, 				//连续分页主体部分显示的分页条目数
							items_per_page:20, 						//每页显示的条目数
							current_page: 0,						//当前选中的页面
							prev_text: '上一页',
							next_text: '下一页',
							callback: appListPaginationCallback,		//回调函数
						}) 
						function appListPaginationCallback(index) {
							self.appHome(index);
							$(".main_pagination").attr("data-value",index);
							$(".pagination a").click(function(){ base.fn.mDHideAni(); })
						}
					}
					
				} else { errorType(data); }
			})
		},
		appHome: function(number){
			var self = this;
			bugAjax({
				type : 'get',
				url : 'appVersion/query',
				dataJson: {
					appType: 	$(".appList_typeDropdown strong").attr("data-value"),
					name: 	 	$("#appList_name").val(),
					build: 	 	$("#appList_bulid").val(),
					sorting: 	$(".appList_table >thead >tr").attr("data-value"),
					firstResult: 	number*20,
					maxResults: 	20
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//重置
					$(".appList_table").children("tbody").html('');
				//赋值
					for (var i=0 ;i<data.root.length; i++) {
						var appListInfo = data.root[i];
						$(".appList_table").children("tbody").append(
							'<tr data-value="'+ appListInfo.id +'"><td><span>'+appListInfo.id+
								'</span></td><td><span>' + filterS( appListInfo.appType ) +
								'</span></td><td><span>' + filterS( appListInfo.name ) +
								'</span></td><td><span>' + filterSS( appListInfo.build ) +
								'</span></td><td><span>' + timeUtils.msToDateTime( appListInfo.publishedTime ) +
								'</span></td></tr>'
						);
					}
					base.fn.mainTableSort($(".appList_table >thead >tr >th"), function(){self.appCount();});
					base.fn.pickCheck($(".mainFilterAppList .main_drop_menu li"), function(){self.appCount();});
					base.fn.pickBtnDown($(".mainFilterAppList .main_dropdown button"), function(){self.appCount();});
					base.fn.pickIptFocus($(".mainFilterAppList .main_dropdown input"), function(){self.appCount();});
					detailModal.app();
					$(".appList_table >tbody >tr").each(function(){ base.fn.mdOptTableTrKeepBg(this); })
				} else { errorType(data); }
			})
		}
	}
	//detail详情页 加载模板
	var detailModal = {
		user: function(){
			$(".userList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.userD',
						success: function(){
							base.fn.slim.detail();
							detail.user();
						}
					});
				});
			})		
		},
		userQ: function(){
			$(".userQList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.userQD',
						success: function(){
							base.fn.slim.detail();
							detail.userQ();
						}
					});
				});
			})
		},
		invited: function(){
			$(".invitedList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.invitedD',
						success: function(){
							base.fn.slim.detail();
							detail.invited();
						}
					});
				});
			})
		},
		company: function(){
			$(".companyList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.companyD',
						success: function(){
							base.fn.slim.detail();
							detail.company();
						}
					});
				});
			})
		},
		project: function(){
			$(".projectList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.projectD',
						success: function(){
							base.fn.slim.detail();
							detail.project();
						}
					});
				});
			})
		},
		order: function(){
			$(".orderList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.orderD',
						success: function(){
							base.fn.slim.detail();
							detail.order();
						}
					});
				});
			})
		},
		customer: function(res){
			$(".customerList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.customerD',
						success: function(){
							base.fn.slim.detail();
							detail.customer(res);
						}
					});
				});
			})
		},
		admin: function(){
			$(".adminList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.adminD',
						success: function(){
							base.fn.slim.detail();
							detail.admin();
						}
					});
				});
			})
		},
		app: function(){
			$(".appList_table >tbody >tr").click(function(event){
				detailShow(event, this, function(){
					$(".main_detail").loadPage({
						url: 'mainDetail.html',
						id: '.appD',
						success: function(){
							base.fn.slim.detail();
							detail.app();
						}
					});
				});
			})
		}
	}
	//detail数据
	var detail = {
		user: function(){
			bugAjax({
				type : 'get',
				url : 'user/get',
				dataJson : { 
					id : function(){
						if ( $(".main_table").hasClass("userList_table") ){
							var _index=$(".userList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".userList_table >tbody >tr").eq(_index).attr("data-value");
						} else {
							return $(".main_detail").attr("data-value");
						}
					}
				}
			},function(data){
				// console.log(data.root);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						newId = data.root.id + 50000;
					} else {
						newId = data.root.id;
					}
					//detail权限
					allow.fn.userDAllow(data);
					if ($(".userD").find('.main_detail_btn').height() > 60) $(".userD").find('.main_detail_content').css({top: '100px'});
					$(".main_detail_btn button").off('click');

					//detail赋值
					$(".main_detail"			).attr('data-value',data.root.id);
					$(".userD_setUnVerifiedBtn"	).attr('data-value',filterS(data.root.email));
					$(".userD_setVerifiedBtn"	).attr('data-value',filterS(data.root.email));
					$(".userD_id"			).html( newId );
					$(".userD_userName"		).html( filterS(data.root.userName) );				
					$(".userD_phone"		).html( filterS(data.root.phone));		
					$(".userD_jobTitle"		).html( filterS(data.root.jobTitle));		
					$(".userD_registerIP"	).html( filterS(data.root.registerIP) );
					$(".userD_registerTime"	).html( timeUtils.msToDateTime(data.root.registerTime) );
					$(".userD_lastLoginIP"	).html( filterS(data.root.lastLoginIP) );
					$(".userD_lastLoginTime").html( timeUtils.msToDateTime(data.root.lastLoginTime) );

					base.tf.torf( $(".userD_emailVerified"), data.root.emailVerified );
					base.tf.isWx($(".userD_wxVerified"), data.root.wxOpenid);
					base.tf.isPro($(".userD_pro"), data.root.proExpireDate);
					base.tf.torf2( $(".userD_disabled"), data.root.disabled);

					if (data.root.email){
						if (data.root.email.indexOf("@") > -1 ){
							$(".userD_email").html(data.root.email.split("@")[0]+"@<span class=''>"+ data.root.email.split("@")[1] +"</span>");
						} else {
							$(".userD_email").html('');
						}
					} else {
						$(".userD_email").html('');
					}

					//detail 评论
					bugAjax({
						type: 'get',
						url: 'user/getComments',
						dataJson: {
							id: newId
						}
					}, function(data){
						if (data.success){
							if (data.root.length > 0){
								$(".userD_content").html('\
									<hr/>\
									<h3>评论</h3>\
									<div class="userD_contentBox clearfix"></div>\
								');
								for (var i=0; i<data.root.length; i++){
									var item = data.root[i];
									$(".userD_contentBox").append('\
										<div>\
											<div>'+ filterS(item.content) +'</div>\
											<span>'+ timeUtils.msToDateTime(item.createdTime) +'</span>\
										</div>\
									')
								}
							} else{
								$(".userD_content").html('');
							}						
						}
					})

				//detail操作
					detailOpt.user.setUnVerified();	//取消邮箱认证
					detailOpt.user.setVerified();	//邮箱验证
					detailOpt.user.cancelPro();		//取消企业账户
					detailOpt.user.addProMonth();	//企业账户包月
					detailOpt.user.addProDay();		//企业账户包天
					detailOpt.user.disabled();		//禁止
					detailOpt.user.enable();		//恢复
					detailOpt.user.resetPhone(newId);	//重置手机号
					detailOpt.user.resetPwd();		//用户重置密码
					detailOpt.user.createOrder();		//创建订单
					detailOpt.user.comment(newId);	//评论
					detailOpt.user.openEmailWeb();	//跳转邮箱后缀网页
					detailOpt.user.jumpProject_withOwnerId();	//跳转项目home(搜索 拥有人ID)
					detailOpt.user.jumpProject_withMemberId();	//跳转项目home(搜索 参与人ID)
					detailOpt.user.jumpProject_withEmail();		//跳转项目home(搜索 参与人ID)
					detailOpt.user.jumpOrder_withUserId();		//跳转订单home(搜索 用户ID)
					detailOpt.user.jumpUser_withRegisterIP();	//跳转用户home(搜索 用户注册IP)
					detailOpt.user.jumpProject_withRegisterIP();//跳转项目home(搜索 用户注册IP)
					detailOpt.user.jumpInvited_withUserId();	//跳转邀请home(搜索 用户ID)


				} else { errorType(data); }
			})
		},
		userQ: function(){
			bugAjax({
				type : 'get',
				url : 'help/get',
				dataJson : {
					id : function(){
						if ( $(".main_table").hasClass("userQList_table") ){
							var _index=$(".userQList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".userQList_table >tbody >tr").eq(_index).attr("data-value");
						} else {
							return $(".main_detail").attr("data-value");
						}
					}
				}
			},function(data){
				console.log(data.root,data);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						userNewId = parseInt(htmlEncode(data.root.userId)) + 50000;
					} else {
						userNewId = parseInt(htmlEncode(data.root.userId));
					}
					var userQD_obj = {
						id: data.root.id,
						userId: htmlEncode(data.root.userId)
					}
					bugStorage.setItem('userQD_obj',JSON.stringify(userQD_obj));
					var userQPopupInit = data.root;
					userQPopupInit.userNewId = userNewId;
				//detail权限
					allow.fn.userQDAllow(data);
					$(".main_detail_btn button").off('click');
				//detail赋值
					$(".main_detail").attr('data-value',data.root.id);
					$(".userQD_id").html(data.root.id);
					$(".userQD_userId").html(userNewId);
					$(".userQD_fullName"	).html(filterS(data.root.fullName));
					$(".userQD_company"		).html(filterS(data.root.company));
					$(".userQD_phone"		).html(filterSS(data.root.phone));
					base.tf.isResolved($(".userQD_resolved"), data.root.resolved);
					$(".userQD_question"	).html(filterS(data.root.question));
					$(".userQD_notes"		).html(filterS(data.root.notes));

					$(".userQD_answer").html('<div>\
												<label>用户</label>\
												<div>'+filterS(data.root.question)+'</div>\
												<span>'+timeUtils.msToDateTime(data.root.createdTime)+'</span>\
											</div>');
					for (var i=0; i<data.root.answers.length; i++){
						var answerInfo = data.root.answers[i];
						//附件dom
						if (answerInfo.attachments){
							var fujianHtml = document.createElement('div');
							for (var j=0; j<answerInfo.attachments.length; j++){
								var attachItem = answerInfo.attachments[j]
								$(fujianHtml).append('<div><a href="'+attachItem.url+'" target="_blank"><i class="fa fa-paperclip"></i>'+attachItem.originalFileName+'</a></div>')
							}								
						} else{
							var fujianHtml = document.createElement('div');
						}

						if ( (answerInfo.fromUser).toString() == 'false' ){
							$(".userQD_answer").append('<div>\
																						<label>客服</label>\
																						<div>'+filterS(answerInfo.notes)+'</div>\
																						<span>'+timeUtils.msToDateTime(answerInfo.createdTime)+'</span>\
																						<div class="fujian">'+$(fujianHtml).html()+'</div>\
																					</div>');
						} else if( (answerInfo.fromUser).toString() == 'true' ){
							$(".userQD_answer").append('<div>\
																						<label>用户</label>\
																						<div>'+filterS(answerInfo.notes)+'</div>\
																						<span>'+timeUtils.msToDateTime(answerInfo.createdTime)+'</span>\
																						<div class="fujian">'+$(fujianHtml).html()+'</div>\
																					</div>');
						}
					}
					
				//detail操作
					detailOpt.userQ.del();
					detailOpt.userQ.edit(userQPopupInit);
					detailOpt.userQ.answer();
					detailOpt.userQ.jumpUserD_withUserId();

				} else { errorType(data); }
			})
		},
		invited: function(){
			var _index=$(".invitedList_table >tbody >tr.main_table_tbody_tr_active").index();
			var _tr = $(".invitedList_table >tbody >tr").eq(_index);

			$(".main_detail").attr('data-value', _tr.attr("data-value") );
			$(".invitedD_id" 			).html( _tr.children("td").eq(0).children("span").html() );
			$(".invitedD_fromUserId" 	).html( _tr.children("td").eq(1).children("span").html() );	
			$(".invitedD_fromUserId" 	).attr("data-value", _tr.children("td").eq(1).children("span").attr("data-value") );
			$(".invitedD_invitedTime" 	).html( _tr.children("td").eq(3).children("span").html() );
			$(".invitedD_toUserId" 		).html( _tr.children("td").eq(2).children("span").html() );
			$(".invitedD_toUserId" 		).attr("data-value", _tr.children("td").eq(2).children("span").attr("data-value") );

			var invitedD_obj = {
				id: $(".invitedD_id").html(),
				fromUserId: $(".invitedD_fromUserId").attr("data-value"),
				toUserId: $(".invitedD_toUserId").attr("data-value")
			}
			bugStorage.setItem('invitedD_obj',JSON.stringify(invitedD_obj));

			detailOpt.invited.jumpUserD_withFromUserId();
			detailOpt.invited.jumpUserD_withToUserId();
		},
		company: function(){
			bugAjax({
				type : 'get',
				url : 'company/get',
				dataJson : {
					id : function(){
						if ( $(".main_table").hasClass("companyList_table") ){
							var _index=$(".companyList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".companyList_table >tbody >tr").eq(_index).attr("data-value");
						} else {
							return $(".main_detail").attr("data-value");
						}
					}
				}
			},function(data){
				// console.log(data.root);
				if (data.success) {
					var companyD_obj = {
						id: data.root.id,
						userId: htmlEncode(data.root.userId)
					}
					bugStorage.setItem('companyD_obj',JSON.stringify(companyD_obj));
					var companyPopupInit = data.root;
				//detail权限
					allow.fn.companyDAllow(data);
					$(".main_detail_btn button").off('click');
				//detail赋值
					$(".main_detail").attr('data-value',data.root.id);
					$(".companyD_id").html(data.root.id);
					$(".companyD_userId").html(data.root.userId);
					$(".companyD_name").html(filterS(data.root.name));
					$(".companyD_homePage").html(filterS(data.root.homePage));
					$(".companyD_address").html(filterS(data.root.address));
					$(".companyD_title").html(filterS(data.root.title));
					$(".companyD_email").html(filterS(data.root.email));
					$(".companyD_phone").html(filterS(data.root.phone));
					$(".companyD_cities").html(filterS(data.root.cities.join(",")));
					base.tf.companyState($(".companyD_state"), data.root.state);

					$(".companyD_description").html(filterS(data.root.description));
					if (data.root.logoImage){
						$(".companyD_logo").html('\
							<h5>公司LOGO</h5>\
							<div class="companyD_logo_layer"><img src="'+filterS(data.root.logoImage.thumbUrl)+'" alt="'+filterS(data.root.logoImage.originalFileName)+'" layer-src="'+filterS(data.root.logoImage.url)+'"/></div>\
						')
						layer.photos({photos: '.companyD_logo_layer'});
					}else{
						$(".companyD_logo").html('');
					}

					if (data.root.licenseImage){
						$(".companyD_license").html('\
							<h5>公司证明 (营业执照)</h5>\
							<div class="companyD_license_layer"><img src="'+filterS(data.root.licenseImage.thumbUrl)+'" alt="'+filterS(data.root.licenseImage.originalFileName)+'" layer-src="'+filterS(data.root.licenseImage.url)+'"/></div>\
						')
						layer.photos({photos: '.companyD_license_layer'});
					}else{
						$(".companyD_license").html('');
					}

					if (data.root.images){
						$(".companyD_intro").html('\
							<h5>宣传图片</h5>\
							<div class="companyD_intro_layer"></div>\
						')
						for (i=0;i<data.root.images.length;i++){
							var introImage = data.root.images[i];
							$(".companyD_intro_layer").append('\
								<img src="'+filterS(introImage.thumbUrl)+'" alt="'+filterS(introImage.originalFileName)+'" layer-src="'+filterS(introImage.url)+'"/>\
							')
						}
						layer.photos({photos: '.companyD_intro_layer'});
					}else{
						$(".companyD_itro").html('');
					}

				//detail操作
					detailOpt.company.jumpUserD_withUserId();
					detailOpt.company.approve();
					detailOpt.company.reject();

				} else { errorType(data); }
			})
		},
		project: function(){
			bugAjax({
				type : 'get',
				url : 'project/get',
				dataJson : { 
					id : function(){
						if ( $(".main_table").hasClass("projectList_table") ){
							var _index=$(".projectList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".projectList_table >tbody >tr").eq(_index).attr("data-value") 
						} else {
							return $(".main_detail").attr("data-value");
						}					
					}
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						newId = data.root.id + 30000;
						ownerNewId = data.root.ownerId + 50000;
					} else {
						newId = data.root.id;
						ownerNewId = data.root.ownerId;
					}

					var projectD_obj = {
						id: data.root.id,
						ownerId: data.root.ownerId
					}
					bugStorage.setItem('projectD_obj',JSON.stringify(projectD_obj));

					var projectPopupInit = data.root;
					projectPopupInit.newId = newId;
					projectPopupInit.ownerNewId = ownerNewId;

					//detail权限
					allow.fn.projectDAllow(data);
					if ($(".projectD").find('.main_detail_btn').height() > 60) $(".projectD").find('.main_detail_content').css({top: '100px'});
					$(".main_detail_btn button").off('click');

					//detail赋值
					$(".main_detail").attr('data-value',data.root.id);
					$(".projectD_id").html(newId);
					$(".projectD_name").html(filterS(data.root.name));
					$(".projectD_dbName").html(filterS(data.root.dbName));
					$(".projectD_ownerId").html( ownerNewId );

					$(".projectD_createdIP").html( filterS(data.root.createdIP) );
					$(".projectD_createdTime").html( timeUtils.msToDateTime(data.root.createdTime) );
					base.tf.isPro($(".projectD_pro"), data.root.proExpireDate);
					if ( data.root.deleted == false ){
						if ( data.root.disabled == false ){
							$(".projectD_disabled").html("正常").css({ color: '#5cb853' });
						} else if( data.root.disabled == true ){
							$(".projectD_disabled").html("禁止").css({ color: '#d9534f' });
						}
					} else if ( data.root.deleted == true ) {
						$(".projectD_disabled").html("已删除").css({ color: '#d9534f' });
					}
					//detail 评论
					bugAjax({
						type: 'get',
						url: 'user/getComments',
						dataJson: {
							id: ownerNewId
						}
					}, function(data){
						if (data.success){
							if (data.root.length > 0){
								$(".projectD_content").html('\
									<hr/>\
									<h3>评论</h3>\
									<div class="projectD_contentBox clearfix"></div>\
								');
								for (var i=0; i<data.root.length; i++){
									var item = data.root[i];
									$(".projectD_contentBox").append('\
										<div>\
											<div>'+ filterS(item.content) +'</div>\
											<span>'+ timeUtils.msToDateTime(item.createdTime) +'</span>\
										</div>\
									')
								}
							} else{
								$(".projectD_content").html('');
							}						
						}
					})

				//detail操作
					detailOpt.project.cancelPro();
					detailOpt.project.addProMonth();
					detailOpt.project.addProDay();
					detailOpt.project.disabled();
					detailOpt.project.enable();
					detailOpt.project.editOwner();
					detailOpt.project.comment(ownerNewId);

					detailOpt.project.jumpUserD_withProjectOwnerId();
					detailOpt.project.jumpUser_withProjectId();
					detailOpt.project.jumpUser_withProjectRegisterIP();
					detailOpt.project.jumpProject_withProjectRegisterIP();
					detailOpt.project.jumpOrder_withProjectId();
				} else {
					errorType(data);
				}
			})
		},
		order: function(){
			bugAjax({
				type : 'get',
				url : 'order/get',
				dataJson : { 
					id : function(){
						if ( $(".main_table").hasClass("orderList_table") ){
							var _index=$(".orderList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".orderList_table >tbody >tr").eq(_index).attr("data-value");
						} else {
							return $(".main_detail").attr("data-value");
						}					
					}
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
					if (GLOBAL.demoFlag == true){
						projectNewId = (data.root.projectId) + 30000;
						userNewId = (data.root.userId) + 50000;
					} else {
						projectNewId = data.root.projectId;
						userNewId = data.root.userId;
					}
					var orderD_obj = {
						id: data.root.id,
						userId: data.root.userId,
						projectId: data.root.projectId
					}
					bugStorage.setItem('orderD_obj',JSON.stringify(orderD_obj));
					var orderPopupInit = data.root;
					orderPopupInit.projectNewId = projectNewId;
					orderPopupInit.userNewId = userNewId;

				//detail权限
					allow.fn.orderDAllow(data);
					$(".main_detail_btn button").off('click');
				//detail赋值
					$(".main_detail").attr('data-value',data.root.id);
					$(".orderD_subject").html(filterS(data.root.subject));
					$(".orderD_orderNo").html(data.root.orderNo);
					$(".orderD_userId").html( userNewId );
					$(".orderD_projectId").html( projectNewId );
					$(".orderD_fee").html( (parseFloat((data.root.fee)/100)).toFixed(2) );
					base.tf.orderState($(".orderD_state"), data.root.state);
					base.tf.orderPayType($(".orderD_payType"), data.root.payType);
					if (data.root.state == "Success") base.tf.orderInvoice($(".orderD_invoice"), data.root.invoiced);
					$(".orderD_orderTime").html( timeUtils.msToDateTime( data.root.orderTime ) );
					$(".orderD_tradeNo").html( filterS( data.root.tradeNo ) );
					$(".orderD_payTime").html( timeUtils.msToDateTime( data.root.payTime ) );
				//detail操作
					detailOpt.order.invoiceTrue();
					detailOpt.order.invoiceFalse();
					detailOpt.order.offlineNotify(orderPopupInit);
					detailOpt.order.reqInvoice(orderPopupInit);
					detailOpt.order.refund();
					detailOpt.order.jumpUserD_withUserId();
					detailOpt.order.jumpProjectD_withOrderProjectId();
				} else { errorType(data); }
			})
		},
		customer: function(res){
			var thisId;
			if ($(".main_table").hasClass("customerList_table")){
				var thisIndex = $(".customerList_table >tbody >tr.main_table_tbody_tr_active").index();
				thisId = $(".customerList_table >tbody >tr").eq(thisIndex).attr("data-value");
			} else{
				thisId = $(".main_detail").attr("data-value");
			}
			
			var resNew = [];	
			for (var i=0; i<res.length; i++){
				var item = res[i];
				if (thisId == item.id ){
					resNew.push(item);
				}
			}
			var thisData = resNew[0];
			

			// 权限
			allow.fn.customerDAllow(thisData);
			$(".main_detail_btn button").off('click');

			//detail赋值
			var customerName;
			if (thisData.customerType == "ProProject"){
				customerName = filterS(thisData.name);
			} else{
				customerName = filterS(thisData.buyer.userName);
			};

			$(".main_detail").attr('data-value',thisData.id);

			$(".customerD_id").html( thisData.id );
			$(".customerD_name").html( filterS(customerName) );
			base.tf.customerType($(".customerD_customerType"), thisData.customerType);
			base.tf.customerExpireDate($(".customerD_expireDate"), thisData.expireDate);
			$(".customerD_renew").html( filterSS(thisData.renew) );
			base.tf.customerOrderType($(".customerD_orderType"), thisData.orderType);

			$(".customerD_userNumber").html( thisData.userNumber );
			$(".customerD_buyerId").html( thisData.buyer.id );
			// $(".customerD_buyerEmail").html( filterS(thisData.buyer.email) );
			$(".customerD_buyerPhone").html( filterS(thisData.buyer.phone) );

			if (thisData.buyer.email){
				if (thisData.buyer.email.indexOf("@") > -1 ){
					$(".customerD_buyerEmail").html(thisData.buyer.email.split("@")[0]+"@<span class=''>"+ thisData.buyer.email.split("@")[1] +"</span>");
				} else {
					$(".customerD_buyerEmail").html('');
				}
			} else {
				$(".customerD_buyerEmail").html('');
			}

			//detail 评论
			bugAjax({
				type: 'get',
				url: 'user/getComments',
				dataJson: {
					id: thisData.buyer.id
				}
			}, function(data){
				if (data.success){
					if (data.root.length > 0){
						$(".customerD_content").html('\
							<hr/>\
							<h3>评论</h3>\
							<div class="customerD_contentBox clearfix"></div>\
						');
						for (var i=0; i<data.root.length; i++){
							var item = data.root[i];
							$(".customerD_contentBox").append('\
								<div>\
									<div>'+ filterS(item.content) +'</div>\
									<span>'+ timeUtils.msToDateTime(item.createdTime) +'</span>\
								</div>\
							')
						}
					} else{
						$(".projectD_content").html('');
					}						
				}
			})

			var type = thisData.customerType || '';

			if (type == "ProProject"){
				$(".customerD_id").attr("title", "点击可跳转项目详情");

			} else if(type == "ProUser"){
				$(".customerD_id").attr("title", "点击可跳转用户详情");
			}

			//detail弹窗
			detailOpt.customer.comment(thisData.buyer.id, res);
			detailOpt.customer.openEmailWeb();	//跳转邮箱后缀网页
			detailOpt.customer.jumpId(thisData.id, type, res);	//跳转用户、项目详情
		},
		admin: function(){
			bugAjax({
				type : 'get',
				url : 'manager/get',
				dataJson : { 
					id : function(){
						if ( $(".main_table").hasClass("adminList_table") ){
							var _index=$(".adminList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".adminList_table >tbody >tr").eq(_index).attr("data-value");
						} else {
							return $(".main_detail").attr("data-value");
						}					
					}
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//右上角fullName赋值
					var userObjs = JSON.parse(bugStorage.getItem('userObj'));
					if ( userObjs.id == data.root.id ){ $(".setting .username_txt").html(data.root.fullName); }
				//按钮操作权限
					allow.fn.adminDAllow(data);
					$(".main_detail_btn button").off('click');
					var adminPopupInit = data.root;
				//detail赋值
					$(".main_detail").attr('data-value',data.root.id);
					$(".adminD_username").html( filterS(data.root.username) );
					$(".adminD_fullName").html(data.root.fullName);
					if (data.root.roles){
						$(".adminD_roles").html('');
						for(var i=0; i<data.root.roles.length; i++){
							if (i == data.root.roles.length-1){
								$(".adminD_roles").append('<span>'+ base.tf.adminRole(data.root.roles[i]) +'</span>');
							} else {
								$(".adminD_roles").append('<span>'+ base.tf.adminRole(data.root.roles[i]) +'</span>，');
							}						
						}
					}
					base.tf.torf2( $(".adminD_disabled"), data.root.disabled);
					base.tf.adminExpireTime($(".adminD_expireTime"), data.root.expireTime);
				//detail操作
					detailOpt.admin.edit(adminPopupInit);
					detailOpt.admin.disabled();
					detailOpt.admin.enable();

				} else { errorType(data); }
			})
		},
		app: function(){
			bugAjax({
				type : 'get',
				url : 'appVersion/get',
				dataJson : { 
					id : function(){
						if ( $(".main_table").hasClass("appList_table") ){
							var _index=$(".appList_table >tbody >tr.main_table_tbody_tr_active").index();
							return $(".appList_table >tbody >tr").eq(_index).attr("data-value");
						} else {
							return $(".main_detail").attr("data-value");
						}
					}
				}
			},function(data){
				// console.log(data.root,data);
				if (data.success) {
				//detail权限
					allow.fn.appDAllow(data)
					$(".main_detail_btn button").off('click');
					var appPopupInit = data.root;
				//Detail赋值
					$(".main_detail").attr('data-value',data.root.id);
					$(".appD_id 		 ").html( data.root.id );
					$(".appD_type 		 ").html( filterS( data.root.appType ) );
					$(".appD_name 		 ").html( filterS( data.root.name ) );
					$(".appD_build 		 ").html( filterSS( data.root.build ) );
					$(".appD_url 		 ").html( '<a href="'+filterS( data.root.url )+'" target="_blank">'+filterS( data.root.url )+'</a>' );
					$(".appD_changeLog 	 ").html( filterS( data.root.changeLog) );
					$(".appD_publishTime ").html( timeUtils.msToDateTime( data.root.publishedTime ) );
				//detail操作
					detailOpt.app.edit(appPopupInit);
					detailOpt.app.del();
				} else { errorType(data); }
			})
		}
	}
	//detail 操作成功后相似
	var detailOptSuc = { 
		user: function(){
			if ( $(".main_table").hasClass("userList_table") ){
				list.userHome($(".main_pagination").attr("data-value"));					
			}
			detail.user();
			layer.closeAll();
		},
		userQ: function(){
			if ( $(".main_table").hasClass("userQList_table") ){
				list.userQHome($(".main_pagination").attr("data-value"));					
			}
			detail.userQ();
			layer.closeAll();
		},
		company: function(){
			if ( $(".main_table").hasClass("companyList_table") ){
				list.companyHome($(".main_pagination").attr("data-value"));					
			}
			detail.company();
			layer.closeAll();
		},
		project: function(){
			if ( $(".main_table").hasClass("projectList_table") ){
				list.projectHome($(".main_pagination").attr("data-value"));				
			}
			detail.project();
			layer.closeAll();
		},
		order: function(){
			if ( $(".main_table").hasClass("orderList_table") ){
				list.orderHome($(".main_pagination").attr("data-value"));				
			}
			detail.order();
			layer.closeAll();
		},
		customer: function(){
			if ( $(".main_table").hasClass("customerList_table") ){
				list.customerList($(".main_pagination").attr("data-value"));
			}
			layer.closeAll();
		},
		app: function(){
			if ( $(".main_table").hasClass("appList_table") ){
				list.appHome($(".main_pagination").attr("data-value"));				
			}
			detail.app();
			layer.closeAll();
		}
	}
	//详情页 操作
	var detailOpt = {
		user: {
			new: function(){	//添加新用户
				$(".userListAdd").off("click");
				$(".userListAdd").on("click", function(){
					loadPage2("popup.html", "#userListAdd_submit", function(element){
						popup.popupAdd("增加用户", element.outerHTML, function(){
							$('#userListAdd_submit').on("submit", function(event){
								preDef(event);
								if ( $.trim($("#userListAddEmail").val()) == '' ) {
									layer.msg("邮箱不能为空");
									$("#userListAddEmail").focus();
								} else if( !emailReg.test($.trim($("#userListAddEmail").val())) ){
									layer.msg("邮箱格式不正确");
									$("#userListAddEmail").focus();
								} else if ( $.trim($("#userListAddUserName").val()) == '' ){
									layer.msg("用户名不能为空");
									$("#userListAddUserName").focus();
								} else {
							 		$('#userListAddBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'user/add',
										dataJson: { 
											email: $.trim($("#userListAddEmail").val()),
											userName: $.trim($("#userListAddUserName").val()),
											jobTitle: $.trim($("#userListAddJobTitle").val())
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) {
											list.userCount();
											layer.closeAll();
										} else {
											errorType(data);
										}
										$("#userListAddBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						});
					})
				})
			},
			setUnVerified: function(){	//取消邮箱验证
				$(".userD_setUnVerifiedBtn").on('click', function(){
					layer.confirm('确定取消邮箱认证吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'user/setVerified',
							dataJson : { 
								email: 	$(".userD_setUnVerifiedBtn").attr('data-value'),
								verified: false
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){					
			 					detailOptSuc.user();
							} else {
								errorType(data);
							}
						})
					})
				})
			},
			setVerified: function(){	//验证邮箱
				$('.userD_setVerifiedBtn').on("click",function(){
					layer.confirm('确定取消邮箱认证吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'user/setVerified',
							dataJson : { 
								email: 	$(".userD_setVerifiedBtn").attr('data-value'),
								verified: true
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					detailOptSuc.user();
							} else {
								errorType(data);
							}
						})
					})
				})
			},
			cancelPro: function(){	//取消企业账号
				$('.userD_cancelProBtn').on("click", function(){
					layer.confirm('确定取消企业账户吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'user/cancelPro',
							dataJson : { 
								id : $(".main_detail").attr('data-value')
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					detailOptSuc.user();
							} else {
								errorType(data);
							}
						})
					})
				})
			},
			addProMonth: function(){	//企业账户包月添加
				$(".userD_addProMonthBtn").on("click", function(){
					loadPage2("popup.html", "#userAddProMonth_submit", function(element){
						popup.popupAdd("企业账号包月", element.outerHTML, function(){
							$("#userAddProMonth_submit").on('submit',function(event){
								preDef(event);
								if ( $("#userAddProMonthNumber").val() == '' ) {
									layer.msg("包月数不能为空!");
								} else if ( !validateNInteger($("#userAddProMonthNumber").val()) ){
									layer.msg("包月数只能为正整数!");
								} else if ( parseInt($("#userAddProMonthNumber").val()) > 120 ){
									layer.msg("包月数不能大于120!");
								} else {
							 		$('#userAddProMonthBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'user/addProMonth',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											number: $("#userAddProMonthNumber").val()
										}
									},function(data){
										// console.log(data.root);
										if (data.success) {
											detailOptSuc.user();
										} else {
											errorType(data);
										}
										$("#userAddProMonthBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})
			},
			addProDay: function(){	//企业账户增加天数
				$(".userD_addProDayBtn").on("click",function(){
					loadPage2("popup.html", "#userAddProDay_submit", function(element){
						popup.popupAdd("企业账号试用", element.outerHTML, function(){
							$('#userAddProDay_submit').on('submit',function(event){
								preDef(event);
								if ( $("#userAddProDayNumber").val() == '' ) {
									layer.msg("试用天数不能为空!");
								} else if ( !validateNInteger($("#userAddProDayNumber").val()) ){
									layer.msg("试用天数只能为正整数!");
								} else if ( parseInt($("#userAddProDayNumber").val()) > 120 ){
									layer.msg("试用天数不能大于120!");
								} else {
							 		$('#userAddProDayBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'user/addProDays',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											number: $("#userAddProDayNumber").val()
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) {
											detailOptSuc.user();
										} else {
											errorType(data);
										}
										$("#userAddProDayBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						});
					})
				})
			},
			disabled: function(){	//禁止
				$(".userD_disabledBtn").on("click", function(){
					layer.confirm('确定禁止吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'user/modify',
							dataJson : {
								id: 	$(".main_detail").attr('data-value'),
								disabled: true
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					detailOptSuc.user();
							} else {
								errorType(data);
							}
						})
					})
				})
			},
			enable: function(){	//恢复
				$(".userD_enableBtn").on("click", function(){
					layer.confirm('确定恢复吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'user/modify',
							dataJson : { 
								id : $(".main_detail").attr('data-value'),
								disabled : false,
								deleted : false
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					detailOptSuc.user();
							} else {
								errorType(data);
							}
						})
					})
				})
			},
			resetPhone: function(){	//用户重置手机号
				$(".userD_resetPhoneBtn").on("click", function(){
					loadPage2("popup.html", "#userResetPhone_submit", function(element){
						popup.popupEdit("修改手机号", element.outerHTML, function(layero){

							$("#userResetPhone_submit").on('submit',function(event){
								preDef(event);

								if ( $.trim($("#userResetPhone").val()) == '' ) {
									layer.msg("手机号不能为空!");
								} else {
							 		$('#userResetPhoneBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'user/modify',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											phone: $("#userResetPhone").val()
										}
									},function(data){
										console.log(data);
										if (data.success) {
											detailOptSuc.user();
											layer.msg('重置成功!');
										} else {
											errorType(data);
										}
										$("#userResetPhoneBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})
			},
			resetPwd: function(){	//用户重置密码
				$(".userD_resetPwdBtn").on("click", function(){
					loadPage2("popup.html", "#userResetPwd_submit", function(element){
						popup.popupEdit("重置密码", element.outerHTML, function(layero){
							layero.find("#userResetPwd").val('123456');

							$("#userResetPwd_submit").on('submit',function(event){
								preDef(event);
								if ( $.trim($("#userResetPwd").val()) == '' ) {
									layer.msg("密码不能为空!");
								} else if( $.trim($("#userResetPwd").val()).length < 6 ){
									layer.msg("密码不能小于6位!");
								} else {
							 		$('#userResetPwdBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'user/modify',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											password: $("#userResetPwd").val()
										}
									},function(data){
										// console.log(data.root);
										if (data.success) {
											detailOptSuc.user();
											layer.msg('重置成功!');
										} else {
											errorType(data);
										}
										$("#userResetPwdBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})
			},
			createOrder: function(){ //创建订单
				$(".userD_createOrderBtn").on("click", function(){
					loadPage2("popup.html", "#userCreateOrder_submit", function(element){
						popup.popupAdd("创建订单", element.outerHTML, function(layero){
							
							base.fn.layerPDropHide(layero);
							
							base.fn.layerPDropBtn($(".input-group-btn button"));
							base.fn.layerPDropIpt($(".input-group input"));
							base.fn.slim.popup();

							var isRequire = 1;
							base.fn.pickCheckPopup( $(".dropdown-menu-right li"), function(){
								if ($("#userCreateOrder_orderType").attr("data-value") == 'Custom'){
									isRequire = 1;
								} else{
									isRequire = 0;
								}
							});
							
							$("#userCreateOrder_submit").on('submit',function(event){
								preDef(event);

								if (isRequire == 1 && $.trim($("#userCreateOrder_fee").val()) == ''){
									layer.msg('支付金额不能为空！'); 
									return false;
								}
								if ($.trim($("#userCreateOrder_fee").val()) != ''){
									if ( feeNumber($("#userCreateOrder_fee").val()) ){								
										if ( parseInt($("#userCreateOrder_fee").val()) > 100000 ){
											layer.msg('支付金额限制为1-100000！');
											return false;
										}
									} else{
										layer.msg('支付金额限制为1-100000！');
										return false;
									}
								}
								if (isRequire == 1 && $.trim($("#userCreateOrder_subject").val()) == ''){
									layer.msg('订单内容不能为空！');
									return false;
								}
								
								$('#userCreateOrderSubBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
								bugAjax({
									url : 'order/add',
									dataJson : {
										userId: 	$(".main_detail").attr('data-value'),
										orderType: $("#userCreateOrder_orderType").attr("data-value"),
										payType: ($("#userCreateOrder_fee").val())*100,
										subject: $("#userCreateOrder_subject").val(),
										payType: 'Offline'
									}
								},function(data){
									// console.log(data.root);
									if (data.success) {
										detailOptSuc.user();
										layer.msg('创建订单成功!');
									} else {
										errorType(data);
									}
									$("#userCreateOrderSubBtn").removeAttr('disabled').removeAttr('style').text("Submit");
								})


							})
						})
					})
				})
			},
			comment: function(userId){	//评论
				$('.userD_commentBtn').on("click", function(){
					loadPage2("popup.html", "#userEditComment_submit", function(element){
						popup.popupEdit("评论", element.outerHTML, function(layero){

							$('#userEditComment_submit').on('submit', function(event){
								preDef(event);

								if ( $.trim($('#userEditComment_content').val()) == '' ){
									layer.msg('评论内容不能为空!');
									return false;
								}

						 		$('#userEditComment_subBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
								bugAjax({
									url : 'user/comment',
									dataJson : {
										id: 	userId,
										content: $("#userEditComment_content").val()
									}
								},function(data){
									// console.log(data.root);
									if (data.success) detailOptSuc.user();
									else errorType(data);
									$("#userEditComment_subBtn").removeAttr('disabled').removeAttr('style').text("Submit");
								})
							})
						});
					})
				})
			},
			openEmailWeb: function(){ //跳转邮箱后缀网页
				$(".userD_email span").off("click");
				$(".userD_email span").on("click", function(ev){
					stopPro(ev);
					var userD_emailSpanHtml = $(".userD_email >span").html();
					var userD_emailHref = 'http://www.' + userD_emailSpanHtml;
					window.open(userD_emailHref);
				})
			},
			jumpProject_withOwnerId: function(){ //跳转项目home(搜索 拥有人ID)
				$(".userD_isProjectOwner").off("click");
				$(".userD_isProjectOwner").on("click", function(ev){
					stopPro(ev);
					var userD_id = $(".userD_id").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_project',
						success: function(){
							base.fn.sidebar.itemAnimate($(".projectList"));
							$("#projectList_ownerId").val(userD_id);
							list.projectCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpProject_withMemberId: function(){ //跳转项目home(搜索 参与人ID)
				$(".userD_isProjectMember").off("click");
				$(".userD_isProjectMember").on("click", function(ev){
					stopPro(ev);
					var userD_id = $(".userD_id").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_project',
						success: function(){
							base.fn.sidebar.itemAnimate($(".projectList"));
							$("#projectList_memberId").val(userD_id);
							list.projectCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpProject_withEmail: function(){ //跳转用户home(搜索 邮箱后缀)
				$(".userD_emailMember").off("click");
				$(".userD_emailMember").on("click", function(ev){
					stopPro(ev);
					var userD_emailSpanHtml = $(".userD_email >span").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_user',
						success: function(){
							base.fn.sidebar.itemAnimate($(".userList"));
							$("#userList_email").val(userD_emailSpanHtml);
							list.userCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpOrder_withUserId: function(){ //跳转订单home(搜索 用户ID)
				$(".userD_isOrderOwner").off("click");
				$(".userD_isOrderOwner").on("click", function(ev){
					stopPro(ev);
					var userD_id = $(".userD_id").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_order',
						success: function(){
							base.fn.sidebar.itemAnimate($(".orderList"));
							$("#orderList_userId").val(userD_id);		
							list.orderCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpUser_withRegisterIP: function(){ //跳转用户home(搜索 用户注册IP)
				$(".userD_searchRegisterIP_user").off("click");
				$(".userD_searchRegisterIP_user").on("click", function(ev){
					stopPro(ev);
					var userD_registerIP = $(".userD_registerIP").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_user',
						success: function(){
							base.fn.sidebar.itemAnimate($(".userList"));
							$("#userList_registerIP").val(userD_registerIP);	
							list.userCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpProject_withRegisterIP: function(){ //跳转项目home(搜索 用户注册IP)
				$(".userD_searchRegisterIP_project").off("click");
				$(".userD_searchRegisterIP_project").on("click", function(ev){
					stopPro(ev);
					var userD_registerIP = $(".userD_registerIP").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_project',
						success: function(){
							base.fn.sidebar.itemAnimate($(".projectList"));
							$("#projectList_createdIP").val(userD_registerIP);	
							list.projectCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpInvited_withUserId: function(){ //跳转邀请home(搜索 用户ID)
				$(".userD_searchFromUserId").off("click");
				$(".userD_searchFromUserId").on("click", function(ev){
					stopPro(ev);
					var userD_id = $(".userD_id").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_invited',
						success: function(){
							base.fn.sidebar.itemAnimate($(".invitedList"));
							$("#invitedList_fromUserId").val(userD_id);	
							list.invitedCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			}
		},
		userQ: {
			del: function(){ //删除
				$(".userQD_delBtn").on("click", function(){
					layer.confirm('确定删除吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'help/delete',
							dataJson : { 
								id : $(".main_detail").attr('data-value')
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					list.userQCount();
			 					base.fn.mDHideAni();
			 					layer.closeAll();
							} else {
								errorType(data);
							}
						})
					})
					
				})
			},
			edit: function(userQPopupInit){ //编辑
				$(".userQD_editBtn").on("click", function(){
					loadPage2("popup.html", "#userQListEdit_submit", function(element){
						popup.popupEdit("修改工单", element.outerHTML, function(){
							$(".userQDEdit_id").html(userQPopupInit.id);
							$(".userQDEdit_userId").html(userQPopupInit.userNewId);
							$("#userQListEditFullName"	).val( filterSS(userQPopupInit.fullName) );
							$("#userQListEditCompany"	).val( filterSS(userQPopupInit.company) );
							$("#userQListEditPhone"		).val( filterSS(userQPopupInit.phone) );
							$("#userQListEditQuestion"	).html( filterS(userQPopupInit.question) );
							$("#userQListEditNotes"		).val( filterSS(userQPopupInit.notes) );
							base.fn.popup_Initfuzhi($("#userQListEditResolved"), userQPopupInit.resolved);
							base.fn.popup_changeFuzhi($("#userQListEditResolved"));

							$('#userQListEdit_submit').on('submit', function(event){
								preDef(event);
								$('#userQListEditBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
								bugAjax({
									url : 'help/modify',
									dataJson : {
										id: 	$(".main_detail").attr('data-value'),
										fullName: $("#userQListEditFullName").val(),
										company:  $("#userQListEditCompany").val(),
										phone: 	  $("#userQListEditPhone").val(),
										// question: $("#userQListEditQuestion").val(),
										notes: 	  $("#userQListEditNotes").val(),
										resolved: $("#userQListEditResolved").attr("data-value")
									}
								},function(data){
									// console.log(data.root,data);
									if (data.success) {				
										detailOptSuc.userQ();
									} else {
										errorType(data);
									}
									$("#userQListEditBtn").removeAttr('disabled').removeAttr('style').text("Submit");
								})
							})
						});
					})
				})
			},
			answer: function(){ //回复
				$(".userQD_answerBtn").on("click", function(){
					loadPage2("popup.html", "#userQListAnswer_submit", function(element){
						popup.popupEdit("回复工单", element.outerHTML, function(layero){
							// base.fn.showImgFujian();

							// layero.find(".upload-file").uploadImage({
						 // 		url: 'userImage/upload',
						 // 	},function(data){})

						 	layero.find(".upload-fujian").uploadImage({
						 		url: 'userImage/upload',
						 		isFujian: true,
						 	},function(data){})

							$('#userQListAnswer_submit').on('submit', function(event){
								preDef(event);
								if ($.trim($("#userQListAnswerNotes").val()) == ''){
									layer.msg('回复内容不能为空');
								} else{
									$('#userQListAnswerBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');
									bugAjax({
										url : 'help/answer',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											notes:  $("#userQListAnswerNotes").val(),
											attachmentIds: $('#userQListAnswer_submit').find('.upload-fujian').attr("data-ids")
										}
									},function(data){
										console.log(data.root,data);
										if (data.success) {				
											detailOptSuc.userQ();
										} else {
											errorType(data);
										}
										$("#userQListAnswerBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}							
							})		
						});
					})
				})
			},
			jumpUserD_withUserId: function(){ //跳转用户详情(带该工单用户ID)
				$(".userQD_userId").off("click");
				$(".userQD_userId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else {
						stopPro(ev);
						var userQD_userId = $(".userQD_userId").html();
						$(".main_detail").loadPage({
							url: 'mainDetail.html',
							id: '.userD',
							success: function(){
								$(".main_detail").attr('data-value', userQD_userId);
								$(".main_detail_hidden").attr("title","返回");
								base.fn.slim.detail();
								detail.user();
								$(".main_detail_hidden").click(function(ev){
									ev.stopPropagation();
									if ( $(".main_table").hasClass("userQList_table") ){
										var userQD_obj = JSON.parse(bugStorage.getItem('userQD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.userQD',
											success: function(){
												$(".main_detail").attr('data-value',userQD_obj.id);
												base.fn.slim.detail();
												detail.userQ();
											}
										})
									}
								})
							}
						})				
					}	
				})
			}
		},
		invited: {
			jumpUserD_withFromUserId: function(){ //跳转用户详情(带邀请人ID)
				$(".invitedD_fromUserId").off("click");
				$(".invitedD_fromUserId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else {
						stopPro(ev);
						var invitedD_fromUserId = $(".invitedD_fromUserId").attr("data-value");
						$(".main_detail").loadPage({
							url: 'mainDetail.html',
							id: '.userD',
							success: function(){
								$(".main_detail").attr('data-value', invitedD_fromUserId);
								$(".main_detail_hidden").attr("title","返回");
								base.fn.slim.detail();
								detail.user();

								$(".main_detail_hidden").click(function(ev){
									ev.stopPropagation();
									if ( $(".main_table").hasClass("invitedList_table") ){
										var invitedD_obj = JSON.parse(bugStorage.getItem('invitedD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.invitedD',
											success: function(){
												$(".main_detail").attr('data-value',invitedD_obj.id);
												base.fn.slim.detail();
												detail.invited();
											}
										})
									}
								})
							}
						})				
					}	
				})
			},
			jumpUserD_withToUserId: function(){ //跳转用户详情(带被邀请人ID)
				$(".invitedD_toUserId").off("click");
				$(".invitedD_toUserId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else {
						stopPro(ev);
						var invitedD_toUserId = $(".invitedD_toUserId").attr("data-value");
						$(".main_detail").loadPage({
							url: 'mainDetail.html',
							id: '.userD',
							success: function(){
								$(".main_detail").attr('data-value', invitedD_toUserId);
								$(".main_detail_hidden").attr("title","返回");
								detail.user();
								base.fn.slim.detail();
								$(".main_detail_hidden").click(function(ev){
									ev.stopPropagation();
									if ( $(".main_table").hasClass("invitedList_table") ){
										var invitedD_obj = JSON.parse(bugStorage.getItem('invitedD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.invitedD',
											success: function(){
												$(".main_detail").attr('data-value',invitedD_obj.id);
												detail.invited();
												base.fn.slim.detail();
											}
										})
									}
								})
							}
						})				
					}	
				})
			}
		},
		company: {
			jumpUserD_withUserId: function(){ //跳转用户详情(带该工单用户ID)
				$(".companyD_userId").off("click");
				$(".companyD_userId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else {
						stopPro(ev);
						var companyD_userId = $(".companyD_userId").html();
						$(".main_detail").loadPage({
							url: 'mainDetail.html',
							id: '.userD',
							success: function(){
								$(".main_detail").attr('data-value', companyD_userId);
								$(".main_detail_hidden").attr("title","返回");
								base.fn.slim.detail();
								detail.user();
								$(".main_detail_hidden").click(function(ev){
									ev.stopPropagation();
									if ( $(".main_table").hasClass("companyList_table") ){
										var companyD_obj = JSON.parse(bugStorage.getItem('companyD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.companyD',
											success: function(){
												$(".main_detail").attr('data-value',companyD_obj.id);
												base.fn.slim.detail();
												detail.company();
											}
										})
									}
								})
							}
						})				
					}	
				})
			},
			approve: function(){//认证通过
				$(".companyD_approveBtn").on("click", function(){
					layer.confirm('确定通过认证吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'company/approve',
							dataJson : { 
								id : $(".main_detail").attr('data-value')
							}
						},function(data){
							console.log(data.root,data);
							if ( data.success ) detailOptSuc.company();
			 				else errorType(data);
						})
					})
					
				})
			},
			reject: function(){//认证通过
				$(".companyD_rejectBtn").on("click", function(){
					loadPage2("popup.html", "#companyListRejectWhy_submit", function(element){
						popup.popupEdit("认证拒绝", element.outerHTML, function(){
							$('#companyListRejectWhy_submit').on('submit', function(event){
								preDef(event);
								$('#companyListRejectWhyBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
								bugAjax({
									url : 'company/reject',
									dataJson : {
										id: 	$(".main_detail").attr('data-value'),
										comments:  $("#companyListRejectWhy").val()
									}
								},function(data){
									// console.log(data.root,data);
									if (data.success) {				
										detailOptSuc.company();
									} else {
										errorType(data);
									}
									$("#companyListRejectWhyBtn").removeAttr('disabled').removeAttr('style').text("Submit");
								})
							})		
						});
					})
				})
			},
		},
		project: {
			cancelPro: function(){ //取消专业版
				$(".projectD_cancelProBtn").on("click", function(){
					layer.confirm('确定取消专业版吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'project/cancelPro',
							dataJson : { 
								id : $(".main_detail").attr("data-value")
							}
						},function(data){
							// console.log(data.root,data);
							if (data.success) detailOptSuc.project();
							else errorType(data);
						})
					})
				})
			},
			addProMonth: function(){ //添加包月
				$(".projectD_addProMonthBtn").on("click", function(){
					loadPage2("popup.html", "#projectAddProMonth_submit", function(element){
						popup.popupAdd("专业版包月", element.outerHTML, function(){
							$('#projectAddProMonth_submit').on('submit', function(event){
								preDef(event);
								if ( $("#projectAddProMonthNumber").val() == '' ) {
									layer.msg("包月数不能为空!");
								} else if ( !(/^[0-9]*[1-9][0-9]*$/).test( $("#projectAddProMonthNumber").val().trim() ) ){
									layer.msg("包月数只能为正整数!");
								} else if ( parseInt($("#projectAddProMonthNumber").val()) > 120 ){
									layer.msg("包月数不能大于120!");
								} else {
							 		$('#projectAddProMonthBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'project/addProMonth',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											number: $("#projectAddProMonthNumber").val()
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) detailOptSuc.project();
										else errorType(data);
										$("#projectAddProMonthBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})
			},
			addProDay: function(){ //添加包日
				$('.projectD_addProDayBtn').on("click", function(){
					loadPage2("popup.html", "#projectAddProDay_submit", function(element){
						popup.popupAdd("专业版试用", element.outerHTML, function(){
							$('#projectAddProDay_submit').on('submit', function(event){
								preDef(event);
								if ( $("#projectAddProDayNumber").val() == '' ) {
									layer.msg("试用天数不能为空!");
								} else if ( !(/^[0-9]*[1-9][0-9]*$/).test( $("#projectAddProDayNumber").val().trim() ) ){
									layer.msg("试用天数只能为正整数!");
								} else if ( parseInt($("#projectAddProDayNumber").val()) > 120 ){
									layer.msg("试用天数不能大于120!");
								} else {
							 		$('#projectAddProDayBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'project/addProDays',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											number: $("#projectAddProDayNumber").val()
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) detailOptSuc.project();
										else errorType(data);
										$("#projectAddProDayBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						});
					})
				})
			},
			disabled: function(){ //禁止
				$(document).on("click",".projectD_disabledBtn",function(){
					layer.confirm('确定禁止吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'project/modify',
							dataJson : { 
								id : $(".main_detail").attr("data-value"),
								disabled: true
							}
						},function(data){
							// console.log(data.root,data);
							if (data.success) detailOptSuc.project();
							else errorType(data);
						})
					})
				})
			},
			enable: function(){ //恢复
				$(".projectD_enableBtn").on("click", function(){
					layer.confirm('确定恢复吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'project/modify',
							dataJson : { 
								id : $(".main_detail").attr("data-value"),
								disabled : false,
								deleted : false
							}
						},function(data){
							// console.log(data.root,data);
							if (data.success) detailOptSuc.project();
							else errorType(data);
						})
					})
				})
			},
			editOwner: function(){	//变更拥有人
				$(".projectD_ownerBtn").on("click", function(){
					loadPage2("popup.html", "#projectEditOwner_submit", function(element){
						popup.popupEdit("变更拥有人", element.outerHTML, function(){
							$('#projectEditOwner_submit').on('submit', function(event){
								preDef(event);
								if ( $("#projectEditOwner").val() == '' ) {
									layer.msg('拥有人ID不能为空！');
								} else if (!positiveIntegerReg.test( $.trim($("#projectEditOwner").val()) )) {
									layer.msg('拥有人ID必须为正整数！');
								} else {
							 		$('#projectEditOwnerBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'project/changeOwner',
										dataJson : {
											id: 	 $(".main_detail").attr('data-value'),
											ownerId: $("#projectEditOwner").val()
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) detailOptSuc.project();
										else errorType(data);
										$("#projectEditOwnerBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})			
								}

							})
						});
					})
				})
			},
			comment: function(userId){	//评论
				$('.projectD_commentBtn').on("click", function(){
					loadPage2("popup.html", "#projectEditComment_submit", function(element){
						popup.popupEdit("评论", element.outerHTML, function(layero){

							$('#projectEditComment_submit').on('submit', function(event){
								preDef(event);

								if ( $.trim($('#projectEditComment_content').val()) == '' ){
									layer.msg('评论内容不能为空!');
									return false;
								}

						 		$('#projectEditComment_subBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
								bugAjax({
									url : 'user/comment',
									dataJson : {
										id: 	userId,
										content: $("#projectEditComment_content").val()
									}
								},function(data){
									// console.log(data.root);
									if (data.success) detailOptSuc.project();
									else errorType(data);
									$("#projectEditComment_subBtn").removeAttr('disabled').removeAttr('style').text("Submit");
								})
							})
						});
					})
				})
			},
			jumpUserD_withProjectOwnerId: function(){ //跳转用户detail(搜索 项目拥有人ID)
				$(".projectD_ownerId").off("click");
				$(".projectD_ownerId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else{
						stopPro(ev); 
						var projectD_ownerId = $(".projectD_ownerId").html();	
						$(".main_detail").loadPage({
							url: 'mainDetail.html',
							id: '.userD',
							success: function(){
								$(".main_detail").attr('data-value', projectD_ownerId);
								$(".main_detail_hidden").attr("title","返回");
								base.fn.slim.detail();
								detail.user();
								$(".main_detail_hidden").click(function(ev){
									ev.stopPropagation();
									if ( $(".main_table").hasClass("projectList_table") ){
										var projectD_obj = JSON.parse(bugStorage.getItem('projectD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.projectD',
											success: function(){
												$(".main_detail").attr('data-value',projectD_obj.id);
												base.fn.slim.detail();
												detail.project();
											}
										})
									} else if ( $(".main_table").hasClass("orderList_table") ){
										var orderD_obj = JSON.parse(bugStorage.getItem('orderD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.projectD',
											success: function(){
												$(".main_detail").attr('data-value',orderD_obj.projectId);
												base.fn.slim.detail();
												detail.project();
												$(".main_detail_hidden").attr("title","返回");
												$(".main_detail_hidden").click(function(ev){
													ev.stopPropagation();
													var orderD_obj = JSON.parse(bugStorage.getItem('orderD_obj'));
													$(".main_detail").loadPage({
														url: 'mainDetail.html',
														id: '.orderD',
														success: function(){
															$(".main_detail").attr('data-value',orderD_obj.id);
															base.fn.slim.detail();
															detail.order();
														}
													})
												})
											}
										})	
									}
								})
							}
						})		
					}		
				})
			},
			jumpUser_withProjectId: function(){	//跳转用户home(搜索 项目ID)
				$(".projectD_Members").off("click");
				$(".projectD_Members").on("click", function(ev){
					stopPro(ev);
					var projectD_id = $(".projectD_id").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_user',
						success: function(){
							base.fn.sidebar.itemAnimate($(".userList"));
							$("#userList_projectId").val(projectD_id);
							list.userCount();
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			},
			jumpUser_withProjectRegisterIP: function(){ //跳转用户home(搜索 项目注册IP)
				$(".projectD_searchRegisterIP_user").off("click");
				$(".projectD_searchRegisterIP_user").on("click", function(ev){
					stopPro(ev);
					if ( $(".projectD_createdIP").html() === '' ){
						layer.msg('该项目注册IP为空');
					} else{
						var projectD_createdIP = $(".projectD_createdIP").html();
						base.fn.mDHideAni();
						base.fn.bugContentAni();
						$(".bugMain").loadPage({
							url: 'bugContent.html',
							id: '.bugMain_user',
							success: function(){
								base.fn.sidebar.itemAnimate($(".userList"));
								$("#userList_registerIP").val(projectD_createdIP);
								list.userCount();		
								base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
								base.fn.slim.homePick();
							}
						})
					}	
				})
			},
			jumpProject_withProjectRegisterIP: function(){ //跳转项目home(搜索 项目注册IP)
				$(".projectD_searchRegisterIP_project").off("click");
				$(".projectD_searchRegisterIP_project").on("click", function(ev){
					stopPro(ev);
					if ( $(".projectD_createdIP").html() === '' ){
						layer.msg('该项目注册IP为空');
					} else{
						var projectD_createdIP = $(".projectD_createdIP").html();
						base.fn.mDHideAni();
						base.fn.bugContentAni();
						$(".bugMain").loadPage({
							url: 'bugContent.html',
							id: '.bugMain_project',
							success: function(){
								base.fn.sidebar.itemAnimate($(".projectList"));
								$("#projectList_createdIP").val(projectD_createdIP);		
								list.projectCount();		
								base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
								base.fn.slim.homePick();
							}
						})
					}
				})
			},
			jumpOrder_withProjectId: function(){ //跳转订单home(搜索 项目ID)
				$(".projectD_orders").off("click");
				$(".projectD_orders").on("click", function(ev){
					stopPro(ev);
					var projectD_id = $(".projectD_id").html();
					base.fn.mDHideAni();
					base.fn.bugContentAni();
					$(".bugMain").loadPage({
						url: 'bugContent.html',
						id: '.bugMain_order',
						success: function(){
							base.fn.sidebar.itemAnimate($(".orderList"));
							$("#orderList_projectId").val(projectD_id);		
							list.orderCount();		
							base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
							base.fn.slim.homePick();
						}
					})
				})
			}
		},
		order: {
			invoiceTrue: function(){ //发票开启
				$(".orderD_invoiceTruebtn").on("click", function(){
					layer.confirm('确定已开发票吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'order/setInvoiced',
							dataJson : {
								id: 	$(".main_detail").attr('data-value'),
								invoiced: true
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ) detailOptSuc.order();
							else errorType(data)
						})
					})
				})
			},
			invoiceFalse: function(){ //发票关闭
				$(".orderD_invoiceFalsebtn").on("click", function(){
					layer.confirm('确定未开发票吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'order/setInvoiced',
							dataJson : {
								id: 	$(".main_detail").attr('data-value'),
								invoiced: false
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ) detailOptSuc.order();
							else errorType(data)
						})
					})
				})
			},
			offlineNotify: function(orderPopupInit){ //线下 完成支付
				$(".orderD_offlineNotifybtn").on("click", function(){
					loadPage2("popup.html", "#orderListOfflineNotify_submit", function(element){
						popup.popupEdit("完成支付", element.outerHTML, function(layero){
							$("#orderListEditOfflineNotify_tradeNo").val( filterS( orderPopupInit.tradeNo ) );
							$("#orderListEditOfflineNotify_fee").val( (parseFloat((orderPopupInit.fee)/100)).toFixed(0) );

							$("#orderListOfflineNotify_submit").on('submit',function(event){
								preDef(event);

								if ( $("#orderListEditOfflineNotify_tradeNo").val() == '' ) {
									layer.msg("支付流水号不能为空!");
								} else if ( $("#orderListEditOfflineNotify_fee").val() == '' ) {
									layer.msg("支付金额不能为空!");
								} else if ( !feeNumber($("#orderListEditOfflineNotify_fee").val()) ){
									layer.msg("支付金额为正整数!");
								} else {
							 		$('#orderListOfflineNotifyBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'order/offlineNotify',
										dataJson : {
											id: 	$(".main_detail").attr('data-value'),
											tradeNo: $("#orderListEditOfflineNotify_tradeNo").val(),
											fee: ($("#orderListEditOfflineNotify_fee").val())*100
										}
									},function(data){
										// console.log(data.root);
										if (data.success) {
											detailOptSuc.order();
										} else {
											errorType(data);
										}
										$("#orderListOfflineNotifyBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})
			},
			reqInvoice: function(orderPopupInit){ //申请开票
				var self = this;
				$(".orderD_reqInvoicebtn").on("click", function(){
					loadPage2("popup.html", "#orderListReqInvoice_submit", function(element){
						popup.popupEdit("申请开票", element.outerHTML, function(layero){
							layero.css({ width: '700px'});
							base.fn.layerPDropHide(layero);
							
							base.fn.layerPDropBtn($(".input-group-btn button"));
							base.fn.layerPDropIpt($(".input-group input"));
							base.fn.slim.popup();

							bugAjax({
								type: 'get',
								url: 'invoice/query',
								dataJson: {
									userId: orderPopupInit.userId,
									sorting: 'appliedTime DESC',
									firstResult: 0,
									maxResults: 1,
								}
							}, function(data){
								var lastInvoiceInfo = data.root[0];

								if (lastInvoiceInfo != undefined){
									$("#orderListReqInvoice_header").val(filterS(lastInvoiceInfo.header));
									$("#orderListReqInvoice_taxCode").val(filterS(lastInvoiceInfo.taxCode));
									$("#orderListReqInvoice_title").val(filterS(lastInvoiceInfo.title));
									$("#orderListReqInvoice_title").attr("data-value", filterS(lastInvoiceInfo.title));
									$("#orderListReqInvoice_sendAddress").val(filterS(lastInvoiceInfo.sendAddress));
									$("#orderListReqInvoice_contact").val(filterS(lastInvoiceInfo.contact));
									$("#orderListReqInvoice_contactPhone").val(filterS(lastInvoiceInfo.contactPhone));

									$("#orderListReqInvoice_bankName").val(filterS(lastInvoiceInfo.bankName));
									$("#orderListReqInvoice_account").val(filterS(lastInvoiceInfo.account));
									$("#orderListReqInvoice_companyAddress").val(filterS(lastInvoiceInfo.companyAddress));
									$("#orderListReqInvoice_companyPhone").val(filterS(lastInvoiceInfo.companyPhone));
								}
							})

							bugAjax({
								type : 'get',
								url : 'order/query',
								dataJson: {
									userId:		orderPopupInit.userId,
									state: 'Success',
									invoiced: false,
									sorting: 'orderTime desc',
									firstResult: 	0,
									maxResults: 	9999
								}
							},function(data){
								if (data.success) {
									var res = data.root;

									// 订单数据 按支付时间降序 重排序
									// var tmp;
									// for (var i = 0; i < res.length; i++){
									// 	for (var j = 0; j<=i; j++){
									// 		if ( res[i].payTime > res[j].payTime ){
									// 			tmp = res[i];
									// 			res[i] = res[j];
									// 			res[j] = tmp;
									// 		}
									// 	}  
									// }
									base.fn.sortAgainJson(res, 'payTime', 'desc');


									//插入订单选择 数据
									$(".orderListReqInvoice_orderIds").find("tbody").html('');
									for (var i=0; i<res.length; i++){
										var item = res[i];
										$(".orderListReqInvoice_orderIds").find("tbody").append('\
											<tr data-id="'+ item.id +'" data-fee="'+ (parseFloat((item.fee)/100)).toFixed(0) +'">\
												<td><input type="checkbox"/><span class="pd41">'+ filterS(item.orderNo) +'</span></td>\
												<td><span>'+ filterS(item.subject) +'</span></td>\
												<td><span>'+ (parseFloat((item.fee)/100)).toFixed(0) +'</span> 元</td>\
												<td><span>'+ timeUtils.msToDateTime( item.payTime ) +'</span></td>\
											</tr>\
										');
									}

									//订单初始选中
									var dataIds = [];
									var dataFees = 0;
									var tbody = $(".orderListReqInvoice_orderIds").find("tbody");
									tbody.find("tr").each(function(index){
										if ($(this).attr("data-id") == orderPopupInit.id){
											$(this).find('input').prop("checked",true);
											dataIds.push($(this).attr("data-id"));
											dataFees += parseInt($(this).attr("data-fee"));
										}
									})
									$(".orderListReqInvoice_orderIds").attr("data-ids", dataIds.join(","));
									$(".orderListReqInvoice_orderIds").attr("data-fees", dataFees);
									$(".orderListReqInvoice_feeTotal span").html(dataFees);

									function zhuanpiaoIptIsOpen(){
										base.fn.pickCheckPopup( $(".dropdown-menu-right li"), function(){
											if ($("#orderListReqInvoice_invoiceType").attr("data-value") == 'Special'){
												$(".zhuanpiaoBox").show();
											} else{
												$(".zhuanpiaoBox").hide();
											}
										});
									}
									
									function zhuanpiaoTextDec(num){
										if (num >= 4500){
											$(".zhuanpiaoTextDec span").html('可开专票');
											$(".orderListReqInvoice_invoiceTypeMenu").children('div').html('<li><a href="javascript:void(0);" data-value="Normal">增值税普通发票(3个点)</a></li>' +
												'<li><a href="javascript:void(0);" data-value="Special">增值税专用发票(6个点)</a></li>');
											$("#orderListReqInvoiceBtn").removeAttr('disabled').removeAttr('style').val("提交");
											zhuanpiaoIptIsOpen();

										} else if(num <450){
											$(".zhuanpiaoTextDec span").html('不可开票');
											$(".orderListReqInvoice_invoiceTypeMenu").children('div').html('<li><a href="javascript:void(0);" data-value="Normal">增值税普通发票(3个点)</a></li>');
											// $('#orderListReqInvoiceBtn').attr('disabled','disabled').css({'opacity': .45, cursor: 'not-allowed'}).val('禁止开票');
											zhuanpiaoIptIsOpen();

											$(".zhuanpiaoBox").hide();
											$("#orderListReqInvoice_invoiceType").attr("data-value", 'Normal');
											$("#orderListReqInvoice_invoiceType").val('增值税普通发票(3个点)');

										} else{
											$(".zhuanpiaoTextDec span").html('可开普票');
											$(".orderListReqInvoice_invoiceTypeMenu").children('div').html('<li><a href="javascript:void(0);" data-value="Normal">增值税普通发票(3个点)</a></li>');
											$("#orderListReqInvoiceBtn").removeAttr('disabled').removeAttr('style').val("提交");
											zhuanpiaoIptIsOpen();

											$(".zhuanpiaoBox").hide();
											$("#orderListReqInvoice_invoiceType").attr("data-value", 'Normal');
											$("#orderListReqInvoice_invoiceType").val('增值税普通发票(3个点)');

										}
									}
									zhuanpiaoTextDec(dataFees);

									//订单选择
									$(".orderListReqInvoice_orderIds").find('tbody tr input').change(function(){
										if ($(this).parents('tbody').find("input:checked").length == 0){
											layer.msg('至少选择1个订单！');
											$(this).prop("checked",true);
										} else{
											var resultIds = [];
											var resultFees = 0;

											for (var i=0; i<tbody.find("tr").length; i++){
												if ( tbody.find("tr").eq(i).find("input").is(":checked") ){
													resultIds.push( tbody.find("tr").eq(i).attr("data-id") );
													resultFees += parseInt(tbody.find("tr").eq(i).attr("data-fee"));
												}
											}

											$(".orderListReqInvoice_orderIds").attr("data-ids", resultIds.join(","));
											$(".orderListReqInvoice_orderIds").attr("data-fees", resultFees);
											$(".orderListReqInvoice_feeTotal span").html(resultFees);

											zhuanpiaoTextDec(resultFees);
										}
									})

									self.reqInvoiceSub(orderPopupInit.userId);
								} else { 
									errorType(data); 
								}
							})
						})
					})
				})
			},
			reqInvoiceSub: function(userId){
				$('#orderListReqInvoice_submit').on('submit', function(event){
					preDef(event);
					if ($.trim($("#orderListReqInvoice_header").val()) == ''){
						layer.msg("发票抬头不能为空!");
						$("#orderListReqInvoice_header").focus();
						return false;
					}
					if ($.trim($("#orderListReqInvoice_taxCode").val()) == ''){
						layer.msg("税号不能为空!");
						$("#orderListReqInvoice_taxCode").focus();
						return false;
					}
					if ($.trim($("#orderListReqInvoice_sendAddress").val()) == ''){
						layer.msg("快递地址不能为空!");
						$("#orderListReqInvoice_sendAddress").focus();
						return false;
					}
					if ($.trim($("#orderListReqInvoice_contact").val()) == ''){
						layer.msg("收件人不能为空!");
						$("#orderListReqInvoice_contact").focus();
						return false;
					}
					if ($.trim($("#orderListReqInvoice_contactPhone").val()) == ''){
						layer.msg("收件人电话不能为空!");
						$("#orderListReqInvoice_contactPhone").focus();
						return false;
					}
					if ($("#orderListReqInvoice_invoiceType").attr("data-value") == 'Special'){
						if ($.trim($("#orderListReqInvoice_bankName").val()) == ''){
							layer.msg("开户行不能为空!");
							$("#orderListReqInvoice_bankName").focus();
							return false;
						}
						if ($.trim($("#orderListReqInvoice_account").val()) == ''){
							layer.msg("银行账户不能为空!");
							$("#orderListReqInvoice_account").focus();
							return false;
						}
						if ($.trim($("#orderListReqInvoice_companyAddress").val()) == ''){
							layer.msg("公司地址不能为空!");
							$("#orderListReqInvoice_companyAddress").focus();
							return false;
						}
						if ($.trim($("#orderListReqInvoice_companyPhone").val()) == ''){
							layer.msg("公司电话不能为空!");
							$("#orderListReqInvoice_companyPhone").focus();
							return false;
						}
					}

			 		$('#orderListReqInvoiceBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');
			 		var opt = {
						userId: userId,
						orderIds: $(".orderListReqInvoice_orderIds").attr("data-ids"),
						header: $("#orderListReqInvoice_header").val(),
						taxCode: $("#orderListReqInvoice_taxCode").val(),
						title: $("#orderListReqInvoice_title").attr("data-value"),
						sendAddress: $("#orderListReqInvoice_sendAddress").val(),
						contact: $("#orderListReqInvoice_contact").val(),
						contactPhone: $("#orderListReqInvoice_contactPhone").val(),
						invoiceType: $("#orderListReqInvoice_invoiceType").attr("data-value"),
			 		}
			 		if ($("#orderListReqInvoice_invoiceType").attr("data-value") == 'Special'){
			 			opt = $.extend({
							bankName: $("#orderListReqInvoice_bankName").val(),
							account: $("#orderListReqInvoice_account").val(),
							companyAddress: $("#orderListReqInvoice_companyAddress").val(),
							companyPhone: $("#orderListReqInvoice_companyPhone").val(),
			 			}, opt)
			 		}

					bugAjax({
						url : 'invoice/apply',
						dataJson : opt,
					},function(data){
						console.log(data.root,data);
						if (data.success) {
							detailOptSuc.order();
							layer.closeAll();
						} else {
							errorType(data);
						}
						$("#orderListReqInvoiceBtn").removeAttr('disabled').removeAttr('style').text("Submit");
					})

				})
			},
			refund: function(){	//退款
				$(".orderD_refundbtn").on("click", function(){
					layer.confirm('确定退款成功？', popup.confirmObj, function(index){
						bugAjax({
							url : 'order/refund',
							dataJson : {
								id: 	$(".main_detail").attr('data-value')
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ) detailOptSuc.order();
							else errorType(data);
						})
					})
				})
			},
			jumpUserD_withUserId: function(){ //跳转用户detail(搜索 订单人ID)
				$(".orderD_userId").off("click");
				$(".orderD_userId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else{
						stopPro(ev);
						var orderD_userId = $(".orderD_userId").html();	
						$(".main_detail").loadPage({
							url: 'mainDetail.html',
							id: '.userD',
							success: function(){
								$(".main_detail").attr('data-value', orderD_userId);
								$(".main_detail_hidden").attr("title","返回");
								base.fn.slim.detail();
								detail.user();
								$(".main_detail_hidden").click(function(ev){
									ev.stopPropagation();
									if ( $(".main_table").hasClass("orderList_table") ){
										var orderD_obj = JSON.parse(bugStorage.getItem('orderD_obj'));
										$(".main_detail").loadPage({
											url: 'mainDetail.html',
											id: '.orderD',
											success: function(){
												$(".main_detail").attr('data-value',orderD_obj.id);
												base.fn.slim.detail();
												detail.order();
											}
										});
									}
								})
							}
						});
					}
				})
			},
			jumpProjectD_withOrderProjectId: function(){ //跳转项目detail(搜索 订单项目ID)
				$(".orderD_projectId").off("click");
				$(".orderD_projectId").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else{
						stopPro(ev);
						var orderD_projectId = $(".orderD_projectId").html();
						if (orderD_projectId > 0){
							$(".main_detail").loadPage({
								url: 'mainDetail.html',
								id: '.projectD',
								success: function(){
									$(".main_detail").attr('data-value', orderD_projectId);
									$(".main_detail_hidden").attr("title","返回");
									base.fn.slim.detail();
									detail.project();
									$(".main_detail_hidden").click(function(ev){
										ev.stopPropagation();
										if ( $(".main_table").hasClass("orderList_table") ){
											var orderD_obj = JSON.parse(bugStorage.getItem('orderD_obj'));
											$(".main_detail").loadPage({
												url: 'mainDetail.html',
												id: '.orderD',
												success: function(){
													$(".main_detail").attr('data-value',orderD_obj.id);
													base.fn.slim.detail();
													detail.order();
												}
											});
										}
									})
								}
							});				
						}
					}
				})
			}
		},
		customer: {
			comment: function(userId, res){	//评论
				$('.customerD_commentBtn').on("click", function(){
					loadPage2("popup.html", "#customerEditComment_submit", function(element){
						popup.popupEdit("评论", element.outerHTML, function(layero){

							$('#customerEditComment_submit').on('submit', function(event){
								preDef(event);

								if ( $.trim($('#customerEditComment_content').val()) == '' ){
									layer.msg('评论内容不能为空!');
									return false;
								}

						 		$('#customerEditComment_subBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
								bugAjax({
									url : 'user/comment',
									dataJson : {
										id: 	userId,
										content: $("#customerEditComment_content").val()
									}
								},function(data){
									// console.log(data.root);
									if (data.success){
										// detailOptSuc.customer();
										detail.customer(res);
										layer.closeAll();
									}
									else errorType(data);
									$("#customerEditComment_subBtn").removeAttr('disabled').removeAttr('style').text("Submit");
								})
							})
						});
					})
				})
			},
			openEmailWeb: function(){ //跳转邮箱后缀网页
				$(".customerD_buyerEmail span").off("click");
				$(".customerD_buyerEmail span").on("click", function(ev){
					stopPro(ev);
					var userD_emailSpanHtml = $(".customerD_buyerEmail >span").html();
					var userD_emailHref = 'http://www.' + userD_emailSpanHtml;
					window.open(userD_emailHref);
				})
			},
			jumpId: function(customerId, type,  res){ //跳转用户、项目详情
				$(".customerD_id").off("click");
				$(".customerD_id").on("click", function(ev){
					if (GLOBAL.demoFlag == true){
					} else {
						stopPro(ev);

						function returnCustomerD(customerId, res){
							$(".main_detail_hidden").click(function(ev){
								ev.stopPropagation();
								if ( $(".main_table").hasClass("customerList_table") ){

									$(".main_detail").loadPage({
										url: 'mainDetail.html',
										id: '.customerD',
										success: function(){
											$(".main_detail").attr('data-value',customerId);
											base.fn.slim.detail();
											detail.customer(res);
										}
									})
								}
							})
						}

						if (type == 'ProUser'){
							$(".main_detail").loadPage({
								url: 'mainDetail.html',
								id: '.userD',
								success: function(){
									$(".main_detail").attr('data-value', customerId);
									$(".main_detail_hidden").attr("title","返回");
									base.fn.slim.detail();
									detail.user();

									returnCustomerD(customerId, res);
								}
							})	
						} else if (type == 'ProProject'){
							$(".main_detail").loadPage({
								url: 'mainDetail.html',
								id: '.projectD',
								success: function(){
									$(".main_detail").attr('data-value', customerId);
									$(".main_detail_hidden").attr("title","返回");
									base.fn.slim.detail();
									detail.project();

									returnCustomerD(customerId, res);
								}
							})	
						}

									
					}	
				})
			},
		},
		admin: {
			new: function(){
				$(".adminListAdd").off("click");
				$(".adminListAdd").on("click", function(){
					loadPage2("popup.html", "#adminListAdd_submit", function(element){
						popup.popupAdd("增加管理员", element.outerHTML, function(){
							yymmdd( $("#adminListAddExpireTime"), nowDate );
							base.fn.popup_changeFuzhi($("#adminListAddRoles"));
							$('#adminListAdd_submit').on('submit', function(event){
								preDef(event);
								if ( $("#adminListAddUsername").val() == '' ) {
									layer.msg("用户名不能为空!");
								} else if ( $("#adminListAddFullName").val() == '' ) {
									layer.msg("姓名不能为空!");
								} else if ( $("#adminListAddPwd").val() == '' ) {
									layer.msg("密码不能为空!");
								} else {
							 		$('#adminListAddBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'manager/add',
										dataJson : {
											username: 	$("#adminListAddUsername").val(),
											fullName: 	$("#adminListAddFullName").val(),
											password: 	$("#adminListAddPwd").val(),
											roles:  	$("#adminListAddRoles").attr("data-value"),
											expireDate: $("#adminListAddExpireTime").val()
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) {
											list.adminHome();
											layer.closeAll();
										} else {
											errorType(data);
										}
										$("#adminListAddBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})				
			},
			edit: function(adminPopupInit){
				$(".adminD_editBtn").off("click");
				$(".adminD_editBtn").on("click", function(){
					loadPage2("popup.html", "#adminListEdit_submit", function(element){
						popup.popupAdd("修改管理员", element.outerHTML, function(){
							
							yymmdd( $("#adminListEditExpireTime"), nowDate );
							$(".adminListEditUsername").html( filterS(adminPopupInit.username) );
							$("#adminListEditFullName").val( filterSS(adminPopupInit.fullName) );
							$("#adminListEditExpireTime").val( timeUtils.msToDate(adminPopupInit.expireTime) );
							base.fn.popup_Initfuzhi($("#adminListEditRoles"), adminPopupInit.roles);
							base.fn.popup_Initfuzhi($("#adminListEditDisabled"), adminPopupInit.disabled);
							base.fn.popup_changeFuzhi($("#adminListEditRoles"));
							base.fn.popup_changeFuzhi($("#adminListEditDisabled"));
							$('#adminListEdit_submit').on('submit', function(event){
								preDef(event);
								if ( $("#adminListEditFullName").val() == '' ) {
									layer.msg("姓名不能为空!");
								} else if ( +new Date(now) >  +new Date($("#adminListEditExpireTime").val()) ){
									layer.msg("已过期!");
								} else {
							 		$('#adminListEditBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'manager/modify',
										dataJson : {
											id: 		$(".main_detail").attr('data-value'),
											fullName: 	$("#adminListEditFullName").val(),
											disabled: 	$("#adminListEditDisabled").attr("data-value"),
											roles: 		$("#adminListEditRoles").attr("data-value"),
											expireDate: $("#adminListEditExpireTime").val()
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) {
											list.adminHome();
											detail.admin();
											layer.closeAll();
										} else {
											errorType(data);
										}
										$("#adminListEditBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})
				})
			},
			disabled: function(){
				$(".adminD_disabledBtn").on("click", function(){
					layer.confirm('确定禁止吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'manager/modify',
							dataJson : {
								id: 	$(".main_detail").attr('data-value'),
								disabled: true
							}
						},function(data){
							console.log(data.root,data);
							if ( data.success ){
			 					list.adminHome();
								detail.admin();
			 					layer.closeAll();
							} else {
								errorType(data);
							}
						})
					})
				})
			},
			enable: function(){
				$(".adminD_enableBtn").on("click", function(){
					layer.confirm('确定恢复吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'manager/modify',
							dataJson : {
								id: 	$(".main_detail").attr('data-value'),
								disabled: false
							}
						},function(data){
							console.log(data.root,data);
							if ( data.success ){
			 					list.adminHome();
								detail.admin();
			 					layer.closeAll();
							} else {
								errorType(data);
							}
						})
					})
				})
			}
		},
		black: {
			new: function(){
				$(".blackListAdd").off("click");
				$(".blackListAdd").on("click", function(){
					loadPage2("popup.html", "#blackListAdd_submit", function(element){
						popup.popupAdd("增加黑名单", element.outerHTML, function(){
							$('#blackListAdd_submit').on('submit', function(event){
								preDef(event);
								if ( $("#blackListAddIp").val() == '' ) {
									layer.msg("ip不能为空!");
								} else if ( !(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/).test( $("#blackListAddIp").val().trim() ) ){
									layer.msg("ip格式不正确!");
								} else {
							 		$('#blackListAddBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'blacklist/add',
										dataJson: { ip: $("#blackListAddIp").val() }
									},function(data){
										// console.log(data.root,data);
										if (data.success) {
											list.blackHome();
											layer.closeAll();
										} else {
											errorType(data);
										}
										$("#blackListAddBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						});
					})
				})
			},
			del: function(){
				$(".blackListDelTd").click(function(event){
					$(this).parents("tr").addClass("blackListDelTdOn").siblings("tr").removeClass("blackListDelTdOn");
					var _index=$(".blackList_table >tbody >tr.blackListDelTdOn").index();
					layer.confirm('确定删除吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'blacklist/remove',
							dataJson : {
								ip : $(".blackList_table >tbody >tr").eq(_index).attr("data-value")
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					list.blackHome();
			 					layer.closeAll();
			 					$(".main_table >tbody >tr").removeClass("blackListDelTdOn");
							} else {
								errorType(data);
							}
						})
					},function(){
						$(".main_table >tbody >tr").removeClass("blackListDelTdOn");
					})
				})
			}
		},
		app: {
			new: function(){
				$(".appListAdd").off("click");
				$(".appListAdd").on("click", function(){
					loadPage2("popup.html", "#appAdd_submit", function(element){
						popup.popupAdd("增加APP版本", element.outerHTML, function(){
							base.fn.popup_changeFuzhi($("#appListAddType"));
							$('#appAdd_submit').on('submit', function(event){
								preDef(event);
								if ( $('#appListAddType_android').prop("checked") == false && $('#appListAddType_ios').prop("checked") == false ){
									layer.msg("App类型不能为空!");
								}else if ( $("#appListAddName").val() == '' ) {
									layer.msg("App版本名称不能为空!");
								} else if ( $("#appListAddBuild").val() == '' ) {
									layer.msg("App版本号不能为空!");
								} else if ( $("#appListAddUrl").val() == '' ) {
									layer.msg("App下载地址不能为空!");
								} else {
							 		$('#appAddBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'appVersion/add',
										dataJson : {
											name :   $("#appListAddName").val(),
											build :  $("#appListAddBuild").val(),
											url :    $("#appListAddUrl").val(),
											changeLog :   $("#appListAddChangeLog").val(),
											appType:    $("#appListAddType").attr("data-value")
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) {
											list.appCount();
											layer.closeAll();
										} else {
											errorType(data);
										}
										$("#appAddBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})						
					})
				})
			},
			edit: function(appPopupInit){
				$(".appD_editBtn").off("click");
				$(".appD_editBtn").on("click", function(){
					loadPage2("popup.html", "#appEdit_submit", function(element){
						popup.popupAdd("修改APP版本", element.outerHTML, function(){
							$("#appListEditName").val( filterSS( appPopupInit.name ) );
							$("#appListEditBuild").val( filterSS( appPopupInit.build ) );
							$("#appListEditUrl").val( filterSS( appPopupInit.url ) );
							$("#appListEditChangeLog").val( filterSS( appPopupInit.changeLog ) );
							base.fn.popup_Initfuzhi($("#appListEditType"), appPopupInit.appType);
							base.fn.popup_changeFuzhi($("#appListEditType"));
							$('#appEdit_submit').on('submit', function(event){
								preDef(event);
								if ( $('#appListEditType_android').prop("checked") == false && $('#appListEditType_ios').prop("checked") == false ){
									layer.msg("App类型不能为空!");
								}else if ( $("#appListEditName").val() == '' ) {
									layer.msg("App版本名称不能为空!");
								} else if ( $("#appListEditBuild").val() == '' ) {
									layer.msg("App版本号不能为空!");
								} else if ( $("#appListEditUrl").val() == '' ) {
									layer.msg("App下载地址不能为空!");
								} else {
							 		$('#appEditBtn').attr('disabled','disabled').css('opacity',.45).text('Submitting...');  
									bugAjax({
										url : 'appVersion/modify',
										dataJson : {
											id: $(".main_detail").attr("data-value"),
											name :   $("#appListEditName").val(),
											build :  $("#appListEditBuild").val(),
											url :    $("#appListEditUrl").val(),
											changeLog: $("#appListEditChangeLog").val(),
											appType:    $("#appListEditType").attr("data-value")
										}
									},function(data){
										// console.log(data.root,data);
										if (data.success) detailOptSuc.app();
										else errorType(data);
										$("#appEditBtn").removeAttr('disabled').removeAttr('style').text("Submit");
									})
								}
							})
						})
					})	
				})
			},
			del: function(){
				$(".appD_delBtn").on("click", function(){
					layer.confirm('确定删除吗 ?', popup.confirmObj, function(index){
						bugAjax({
							url : 'appVersion/delete',
							dataJson : {
								id: 	$(".main_detail").attr('data-value'),
								disabled: true
							}
						},function(data){
							// console.log(data.root,data);
							if ( data.success ){
			 					list.appCount();
			 					base.fn.mDHideAni();
			 					layer.closeAll();
							} else {
								errorType(data);
							}
						})
					})
				})
			}
		},
		set: {
			upDateWexinServiceNum: function(){
				$(".upDateWexinServiceNum").off("click");
				$(".upDateWexinServiceNum").on("click", function(){
					var title = '确定更新吗？<span style="color: red;">(每日更新的次数有限)</span><br/><span> </span>'
					layer.confirm(title, popup.confirmObj, function(index){
						bugAjax({
							url : 'weixin/createMenu'
						},function(data){
							// console.log(data.root,data);
							if (data.success) layer.msg("更新成功");
							else errorType(data);
						})
					})
				})
			}
		}


	}


	return{
		detailShow: detailShow,
		detailHide: detailHide,
		list: list,
		detailModal: detailModal,
		detail: detail,
		detailOptSuc: detailOptSuc,
		detailOpt: detailOpt,




	}
})