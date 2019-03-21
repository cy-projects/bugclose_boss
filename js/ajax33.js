/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel     15903620494
 */

var GLOBAL = {
	url:'/cgi/'
}
var getToken = function(){

}
//data 格式为 {xxx:aaa}
var bugAjax = function(data,callback,callback2){
    var loading = null;
    // var loading = layer.load(1);
    var loadIngTips = setTimeout(function(){
        loading = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>Loading...',{
            time : 5*60*1000,
            shade : [ 0.4, '#000',true ]    //控制遮罩  0.4:遮罩透明度,’#000′:遮罩颜色,true:是否遮罩(否:false)
        });
    },500);
	var defaultJson = {
		type : 'post',
		url  : '',
		dataJson : {}
	};
	data = $.extend(defaultJson,data);
	// console.log('ajax参数',data);
	data.dataJson.token = boss_token;
	return $.ajax({
		type : data.type,
        cache:false,
		url  : GLOBAL.url+data.url,
		data : data.dataJson,
		dataType : 'json',
		success : function (data) {
            console.log('ajax请求结果',data);
			if(typeof callback != 'undefined'){
				callback(data);
			}
            clearTimeout(loadIngTips);
            layer.close(loading);
		},
		error : function () {
			if(typeof callback2 != 'undefined'){
				callback2();
			}else{
				// layer.msg('Failed to load！');
			}
            layer.msg('Failed to load！');
            clearTimeout(loadIngTips);
            layer.close(loading);
		}
	});
}

//错误处理
var errorType = function(data){
    if(typeof data.errorType != 'undefined'){
    //判断session过期
        if(data.errorType == 'SessionExpired'){
            layer.msg('会话过期，请重新登录');
            // layer.msg('Session expired, please log in again');
            bugStorage.setItem('bugInfoUrl',window.location.href);
            setTimeout(function(){
               bugStorage.delItem('boss_token');
                window.location.href='/boss/login.html';
            },1000);
            return false;
        }
    //参数错误
          if(data.errorType == 'ParameterError'){
            layer.msg("参数错误");
            return false;
        }      
    //密码错误
        if(data.errorType == 'PasswordError'){
            layer.msg(data.errorMessage);
            return false;
        }
    //用户不存在
        if(data.errorType == 'UserNotExists'){
            layer.msg(data.errorMessage);
            return false;
        }
    //用户被禁止
        if(data.errorType == 'AccessDenied'){
            layer.msg(data.errorMessage);
            return false;
        }

    //存在记录
        if(data.errorType == 'RecordExists'){
            layer.msg(data.errorMessage);
            return false;
        }
    //不存在记录
        if(data.errorType == 'RecordNotExists'){
            layer.msg(data.errorMessage);
            return false;
        }
    //不能删除
        if(data.errorType == 'CanNotDelete'){
            layer.msg(data.errorMessage);
            return false;
        }


    //权限不足
        if(data.errorType == 'RightLimited'){
            layer.msg(data.errorMessage);
            return false;
        }
    //系统错误
        if(data.errorType == 'SystemError'){
            // layer.msg('操作失败，系统错误！');
            layer.msg(data.errorMessage);
            return false;
        }
    //其他情况
        if(data.errorMessage != 'undefined'){
            layer.msg(data.errorMessage);
            return false;
        }
    }
};

var bugBackupsAjax = function(data,callback,callback2){
    var loading = null;
    // var loading = layer.load(1);
    // var loadIngTips = setTimeout(function(){
    //     loading = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>Loading...',{
    //         time : 5*60*1000,
    //         shade : [ 0.4, '#000',true ]    //控制遮罩  0.4:遮罩透明度,’#000′:遮罩颜色,true:是否遮罩(否:false)
    //     });
    // },500);
    var defaultJson = {
        type : 'post',
        url  : '',
        dataJson : {}
    };
    data = $.extend(defaultJson,data);
    // console.log('ajax参数',data);
    data.dataJson.token = boss_token;
    return $.ajax({
        type : data.type,
        url  : GLOBAL.url+data.url,
        data : data.dataJson,
        dataType : 'json',
        success : function (data) {
            // console.log('ajax请求结果',data);
            if(typeof callback != 'undefined'){
                callback(data);
            }
            // clearTimeout(loadIngTips);
            // layer.close(loading);
        },
        error : function () {
            if(typeof callback2 != 'undefined'){
                callback2();
            }else{
                // layer.msg('Failed to load！');
            }
            layer.msg('Failed to load！');
            // clearTimeout(loadIngTips);
            // layer.close(loading);
        }
    });
}