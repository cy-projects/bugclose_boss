/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */

//全局变量
    var GLOBAL = {
        url: '/cgi/',
        demoFlag: false,
        _user: {},
        _managerType: '',
        TIME : 500,
        ImageNumber : 10,
        AttachmentNumber : 3,
        //SubTask : false,
        professional : false,
        projectType : false,
        userType : 'Basic',
        AttachmentSize: 6
    };


//返回双数
    var td = function(n) {
        if (n<10) {
            return "0" + n ;
        } else {
            return "" + n;  
        }
    }
    //常用限制日期
    var now = new Date();
    var nowYear = td( now.getFullYear() );
    var nowDate = td( now.getFullYear() ) + '-' + td( now.getMonth()+1 ) + '-' + td( now.getDate() ) ;
    var nowMonthFirstDay = td( now.getFullYear() ) + '-' + td( now.getMonth()+1 ) + '-01';


var pageHeight = $(window).height();

//过滤掉为空，未定义等情况
    function filterS(text){
        if ( text === undefined || text === '' || text === [] ) {
            return '';
        } else {
            return strRegExp(text);
        }
    }
    function filterSS(text){
        if ( text == undefined || text === '' || text === [] ) {
            return '';
        } else {
            return text;
        }
    }