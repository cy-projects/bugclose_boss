/**
 *
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel     15903620494
 */

var GLOBAL = {
    url: '/cgi/'
};
var bugAjax = function(options, callback, callback2){
    var loading = null;
    // var loading = layer.load(1);
    var loadIngTips = setTimeout(function(){
        loading = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i> 正在加载...',{
            time : 5*60*1000,
            shade : [ 0.4, '#000',true ]    //控制遮罩  0.4:遮罩透明度,’#000′:遮罩颜色,true:是否遮罩(否:false)
        });
    },500);
    var defaults = {
        type : 'post',
        url: '',
        dataJson: {}
    };
    var opts = $.extend({}, defaults, options);
    opts.dataJson.token = boss_token;
    // console.log("ajax上传参数", opts);
    return $.ajax({
        type: opts.type,
        cache: false,
        url: GLOBAL.url + opts.url,
        data: opts.dataJson,
        dataType: 'json',
        success: function(data){
            // console.log("ajax请求结果", data.root);
            if (callback){
                callback(data);
            }
            clearTimeout(loadIngTips);
            layer.close(loading);
        },
        error: function(data){
            if (callback2){
                callback2(data);
            } else{
                layer.msg('加载失败！');
            }
            clearTimeout(loadIngTips);
            layer.close(loading);
        }
    });
}


// ajax加载页面
    var TPL = {
        url: './tpl/'
    }
    $.fn.loadPage = function(options){
        var defaults = {
            type: 'get',
            url: '',
            async: true,
            dataJson: {},
            id: '',
        }
        var opts = $.extend({}, defaults, options);
        return this.each(function(){
            var $this = $(this);
            //设置loading
            var loadIngTips = '';
            var loading = '';
            loadIngTips = setTimeout(function(){
                loading = layer.msg('<i class="fa fa-spinner fa-spin"></i> 正在加载...',{time:10*60*1000});
            },500);
            $.ajax({
                type: opts.type,
                url: TPL.url + opts.url,
                data: opts.dataJson,
                dataType: 'html',
                cache: false,
                async: opts.async,
                success: function(bugHtml){
                    var ele = $(bugHtml).filter(opts.id).get(0);
                    $this.html(ele);
                    if (opts.success){
                        opts.success(bugHtml);
                    }
                    clearTimeout(loadIngTips);
                    layer.close(loading);
                },
                error: function(data){
                    layer.msg('加载页面失败');
                    clearTimeout(loadIngTips);
                    layer.close(loading);
                }
            })
        })

    }
//弹出框专用-加载页面
    function loadPage2(url, id, callback){
        // 设置loading
            var loading = null;
            var loadIngTips = setTimeout(function(){
                loading = layer.msg('<i class="fa fa-spinner fa-spin"></i> 正在加载...',{time:10*60*1000});
            },500);
        //加载模板
            $.ajax({
                type: 'get',
                url:'./tpl/'+ url,
                cache:false,
                // async: false,
                dataType:'html',
                success:function(data){
                    var ele = $(data).filter(id).get(0);
                    if (callback){
                        callback(ele);
                    }
                    clearTimeout(loadIngTips);
                    layer.close(loading);
                },
                error: function () {
                    layer.msg('加载页面失败');
                    clearTimeout(loadIngTips);
                    layer.close(loading);
                }
            })
    }
    // function loadPage1(element, url, id, callback){
    //     $.ajax({
    //         type: 'get',
    //         url:'./tpl/'+url,
    //         cache:false,
    //         async: false,
    //         dataType:'html',
    //         success:function(data){
    //             var ele = $(data).filter(id).get(0);
    //             element.html(ele);
    //             if(callback) callback();
    //         }
    //     })
    // }




//错误处理
    var errorType = function(data){
        if(data.errorType){
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
                layer.msg(data.errorMessage || "参数错误");
                return false;
            }
        //密码错误
            if(data.errorType == 'PasswordError'){
                layer.msg('密码错误!');
                return false;
            }
        //用户不存在
            if(data.errorType == 'UserNotExists'){
                layer.msg('管理人员不存在！');
                return false;
            }
        //用户被禁止
            if(data.errorType == 'AccessDenied'){
                layer.msg('用户被禁止！');
                return false;
            }
        //存在记录
            if(data.errorType == 'RecordExists'){
                layer.msg('存在记录！');
                return false;
            }
        //不存在记录
            if(data.errorType == 'RecordNotExists'){
                layer.msg('不存在记录！');
                return false;
            }
        //不能删除
            if(data.errorType == 'CanNotDelete'){
                layer.msg('不能删除！');
                return false;
            }
        //权限不足
            if(data.errorType == 'RightLimited'){
                layer.msg('权限不足！');
                return false;
            }
        //系统错误
            if(data.errorType == 'SystemError'){
                layer.msg('操作失败，系统错误！');
                return false;
            }
        //其他情况
            if(data.errorMessage != 'undefined'){
                layer.msg(data.errorMessage);
                return false;
            }
        }
    };




var bugAjax2 = function(options, callback, callback2){
    var defaults = {
        type : 'post',
        url: '',
        dataJson: {}
    };
    var opts = $.extend({}, defaults, options);
    opts.dataJson.token = boss_token;
    // console.log("ajax上传参数", opts);
    return $.ajax({
        type: opts.type,
        cache: false,
        url: GLOBAL.url + opts.url,
        data: opts.dataJson,
        dataType: 'json',
        success: function(data){
            // console.log("ajax请求结果", data.root);
            if (callback){
                callback(data);
            }
        },
        error: function(data){
            if (callback2){
                callback2(data);
            } else{
                layer.msg('加载失败！');
            }
        }
    });
}
