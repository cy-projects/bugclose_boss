/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
$(function(){
	$('#userName').on('blur', function(){
  	var userNameInput = $.trim($(this).val());

  	if ( userNameInput != '' ) {
  		// if ( !validateEmail(userNameInput) ) {
  		// 	$(this).parent().siblings('span.inputTips').html('<i class="fa fa-times-circle"></i> 邮箱格式错误');
  		// 	return false;
  		// } else {
  		// 	$(this).parent().siblings('span.inputTips').html('');
  		// }
      $(this).parent().siblings('span.inputTips').html('');
  	} else{
  		$(this).parent().siblings('span.inputTips').html('<i class="fa fa-times-circle"></i> 用户名不能为空');
  	}
  });
  $('#pwd').on('blur', function(){
  	var pwdInput = $.trim($(this).val());

  	if ( pwdInput != '' ) {
      // if ( !validatePwd(pwdInput) ) {
      //     $(this).parent().siblings('span.inputTips').html('<i class="fa fa-times-circle"></i> 密码必须6-20个字符');
      //     return false;
      // } else {
      //     $(this).parent().siblings('span.inputTips').html('');
      // }
      $(this).parent().siblings('span.inputTips').html('');
  	} else{
  		$(this).parent().siblings('span.inputTips').html('<i class="fa fa-times-circle"></i> 密码不能为空');
  	}
  });

	$("#userLoginForm").submit(function(ev){
		preDef(ev);
		loginSub();
	});

	$(document).keyup(function(event){
		if ( event.keyCode == 13 ){
			$("#userLoginForm").click();
		}
	});




	function loginSub(){
		var userName = $.trim($("#userName").val());
		var pwd = $.trim($("#pwd").val());

		if (userName == '' && pwd == ''){
			$(".userName_inputTips").html('<i class="fa fa-times-circle"></i> 用户名不能为空');
			$(".pwd_inputTips").html('<i class="fa fa-times-circle"></i> 密码不能为空');
			return false;
		};
		if (userName != '' && pwd == ''){
			$(".userName_inputTips").html('');
			$(".pwd_inputTips").html('<i class="fa fa-times-circle"></i> 密码不能为空');
			return false;
		};
		if (userName == '' && pwd != ''){
			$(".userName_inputTips").html('<i class="fa fa-times-circle"></i> 用户名不能为空');
			$(".pwd_inputTips").html('');
			return false;
		};

		$('#login_btn').attr('disabled','disabled').css('opacity',.45).text('登陆中...');
		$.ajax({
			url: '/cgi/manager/login',
			type: 'post',
			data: {
				username: userName,
				password: pwd
			},
			success: function(data){
				// console.log(data);
				if ( data.success ){
					bugStorage.setItem('boss_token', data.root);

					if ( bugStorage.getItem('bugInfoUrl') != null ) {
						var newUrl=bugStorage.getItem("bugInfoUrl");
						bugStorage.delItem("bugInfoUrl");
						window.location.href = newUrl;
					} else {
						window.location.href = '/boss/console.html';
					};

					$("#changePwdBtn").removeAttr('disabled').removeAttr('style').text('提交');
				} else {
					errorType(data);
					$("#changePwdBtn").removeAttr('disabled').removeAttr('style').text('提交');
				};	
			},
		});
	};


	




})
