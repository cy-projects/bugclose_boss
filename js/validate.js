/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel     15903620494
 */
 
	// var phoneReg = new RegExp(/\d+-?/);
	// var phoneReg = new RegExp(/[0-9-]/);
	// var emailReg = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
	// var emailReg = new RegExp(/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$ /);
	// var emailReg = new RegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

    var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    // var pwdReg = /^(?!\D+$)(?![^a-z]+$)[a-zA-Z\d]{6,20}$/;
    var pwdReg =  /^\w{6,20}$/;
    var ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var positiveIntegerReg = /^[0-9]*[1-9][0-9]*$/; //正整数
    var nonnegativeIntegerReg = /(^[1-9]+\d*$)|(^0$)/; //非负整数
    var _feifuNumber = new RegExp(/^\d+(\.{0,1}\d+){0,1}$/); //非负实数


    var validatePwd = function (value) {
        return pwdReg.test(value.trim());
    };
    //验证邮箱
    var validateEmail = function(value){
        return emailReg.test(value.trim());
    };
    // 验证非负整数
    var validateNInteger = function (value) {
        return nonnegativeIntegerReg.test(value);
    };
    // 验证非负实数
    var validateNRealNum = function (value) {
        return nonnegativeRealNumberReg.test(value);
    };
    //非负实数
    function feifuNumber(value){
        return _feifuNumber.test(value);
    }
    //正整数
    function feeNumber(str){
        var reg = new RegExp(/^[0-9]*[1-9][0-9]*$/);
        return reg.test(str);
    }





$(function(){
	
})