/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
define(['popup'],function(popup){
	$(".change_password").on("click", function(){
		loadPage2('popup.html', "#changePwd_submit", function(element){
			layer.open({
		    	title: "<span class='layer_title'><i class='fa fa-unlock-alt'></i><strong>修改密码</span></span>",
		        type: 1,
		        area: '600px',
		        offset: '60px',
		        shade:  [0.5, '#000000'],
		        shadeClose: false,
		        content: element.outerHTML,
		        success: function(layero, index){
					popup.layerCallback(layero);
					$("#changePwd_submit").on("submit", function(){
				        if ( $("#changePwdOld").val() == '' ){
				        	layer.msg('旧密码不能为空');
				        } else if ( $("#changePwdNew1").val() == '' || $("#changePwdNew2").val() == '' ) {
				        	layer.msg('新密码不能为空');
				        } else if ( $("#changePwdNew1").val() != '' && $("#changePwdNew2").val() != '' ) {
					        if ( $("#changePwdNew1").val() != $("#changePwdNew2").val() ) {
					        	layer.msg('两次输入密码不一致');
					        } else if ( $("#changePwdNew1").val() == $("#changePwdNew2").val() ) {
					        	if ( !(/^\w{6,20}$/).test( $("#changePwdNew1").val().trim() ) ){
					        		layer.msg('新密码必须6-20位字符');
					        	} else {
					        		$('#changePwdBtn').attr('disabled','disabled').css('opacity',.45).text('提交中...');
						        	bugAjax({
						        		url : 'manager/changePassword',
						        		dataJson : {
						        			oldPassword : $("#changePwdOld").val(),
						        			newPassword : $("#changePwdNew1").val()
						        		}
						        	},function(data){
						        		// console.log(data.root,data);
						        		if (data.success) {
						                    bugStorage.delItem("token");
						                    layer.closeAll();
						        			window.location.href= '/boss/login.html';
						        		} else {
						        			errorType(data);
						        		}
						                $("#changePwdBtn").removeAttr('disabled').removeAttr('style').text('提交');
						        	},function(){
						        		$("#changePwdBtn").removeAttr('disabled').removeAttr('style').text('提交');
						        	})
					        	}
					        }
				        }
				        return false;
					})
				}
		    });
		})
	})



	



})

