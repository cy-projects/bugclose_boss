/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel     15903620494
 */
 
// cookie
    var cookie = {
        setCookie : function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        },
        getCookie : function (name) {
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr != null) return unescape(arr[2]); return null;
        },
        delCookie : function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=this.getCookie(name);
            if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    };
// localStorage
    var bugStorage = {
        setItem : function(name,value){
            if(window.localStorage){
                localStorage.setItem(name,value);
            }else{
                layer.msg('您的浏览器版本过低，暂不支持本地存储，请使用高版本浏览器');
            }
        },
        getItem : function(name){
            return localStorage.getItem(name);
        },
        delItem : function(name){
            localStorage.removeItem(name);
        },
        isExist : function(name){
            if(localStorage.getItem(name))
                return true;
            else
                return false;
        }
    };
// 判断是否是移动设备
    //判断访问终端
        var browser={
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/\sQQ/i) == " qq" //是否QQ
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        };
        function platform(){
            //平台、设备和操作系统
            var system ={
                win : false,
                mac : false,
                x11 : false
            };
            //检测平台
            var p = navigator.platform;                 //获取系统
            system.win = p.indexOf("Win") == 0;         //判断是否是Windows
            system.mac = p.indexOf("Mac") == 0;         //判断是否是mac
            system.x11 = (p == "X11") || (p.indexOf("Linux") == 0); //判断是否是Unix, Linux
            //跳转语句
            if(system.win||system.mac||system.x11){
                // alert("PC访问");
                // window.location.replace( '' + window.location.pathname.substr(1) );
                //精准判断
                if(browser.versions.mobile||browser.versions.ios){
                    // alert("移动端");
                    // console.log(window.location.pathname);
                    // window.location.replace( '/m/' + window.location.pathname.substr(1) );
                }
                if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0")
                {
                    alert("当前浏览器版本过低，建议您升级至IE11或以上版本");
                }
                else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")
                {
                    alert("当前浏览器版本过低，建议您升级至IE11或以上版本");
                }
                else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")
                {
                    alert("当前浏览器版本过低，建议您升级至IE11或以上版本");
                }
            }else{
                // alert("非PC访问");
                alert(window.screen.width);
                if(window.screen.width<=768){
                   // window.location.replace( '/m/' + window.location.pathname.substr(1) );
                }
            }
        }
// 判断IE浏览器版本
    function isInternetExplorer(){
        var browser = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        if (version.length > 1) {
            var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
            if (trim_Version < 11) {
                //layer.msg('当前浏览器版本过低，建议您升级至ie11或以上版本',{maxWidth:'400px',time:24*60*60*1000,shade:[0.4 ,'#000',true]});
                var oDiv = $('<div>');
                oDiv.html('当前浏览器版本过低，建议您升级至IE11或以上版本');
                oDiv.addClass('ie-low');
                $('body').prepend(oDiv).addClass('is-ie');
                return false;
            }
        }
    }
// 格式化boolean
    function isBoolean(str){
        if(str == 'true'){
            return true;
        }
        if(str == 'false'){
            return false;
        }
    }
// ajax加载页面
    /*function loadPage(div,str,callback){
        //设置loading
        var loadIngTips = '';
        var index = '';
        loadIngTips = setTimeout(function(){
            index = layer.msg('<i class="fa fa-spinner fa-spin"></i> 正在加载',{time:10*60*1000});
        },500);
        
        //加载模板
        $.ajax({
            url:'./tpl/'+str,
            cache:false,
            //dataType:'html',
            success:function(data){
                div.html(data);
                clearTimeout(loadIngTips);
                layer.close(index);
                console.log(typeof callback);
                if(typeof callback === 'function')
                    callback();
            },
            error: function () {
                layer.msg('请求失败');
            }
        })
    }*/
// 字符转义
    function strRegExp(str){
        if(typeof str == 'undefined')
            str = '';
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');
        //str = str.replace(/\&/g,'&amp;');
        str = str.replace(/\"/g,'&quot;');
        str = str.replace(/\'/g,'&#39;');
        str = str.replace(/\ /g,'&nbsp;');
        str = str.replace(/\    /g,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        return str;
    }
    function htmlEncode ( str ) {  
      var ele = document.createElement('span');  
      ele.appendChild( document.createTextNode( str ) );  
      return ele.innerHTML;  
    }
    // function HTMLEncode(html) {    
    //     var temp = document.createElement ('div');    
    //     (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);    
    //     var output = temp.innerHTML;
    //     temp = null;    
    //     return output; 
    // }
//字符反转义
    function HTMLDecode(text) {    
        var temp = document.createElement('div');
        temp.innerHTML = text;    
        var output = temp.innerText || temp.textContent;    
        temp = null;    
        return output;
    }
// 添加链接
    function strRegExpAddUrl(str){
        if(typeof str == 'undefined')
            str = '';
        var exp = /((http[s]{0,1}|ftp):\/\/[a-zA-Z0-9\.\-]+\.([a-zA-Z]{2,4})(:\d+)?(\/[a-zA-Z0-9\.\-~!@#$%&*+?:_\/=]*)?)/g;
        str = str.replace(/\</g,' &lt; ');
        str = str.replace(/\>/g,' &gt; ');
        str = str.replace(/\n/g,' <br/> ');
        str = str.replace(/\"/g,' &quot; ');
        str = str.replace(/\'/g,' &#39; ');

        str = str.replace(exp,"<a href='$1' target='_blank' style='color:#00aeef'>$1</a>");
        str = str.replace(/ &lt; /g, '&lt;');
        str = str.replace(/ &gt; /g, '&gt;');
        str = str.replace(/ <br\/> /g, '<br/>');
        str = str.replace(/ &quot; /g, '&quot;');
        str = str.replace(/ &#39; /g, '&#39;');
        var ina = false;
        var newStr = '';
        for(var i = 0;i<str.length;i++) {
            var c = str[i];
            if(c == '<') {
                ina = true;
            }
            else if(c == '>') {
                ina = false;
            }
            if(c == ' ' || c == '   ') {
                if (!ina) {
                    if(c == ' ') {
                        newStr += '&nbsp;';
                    }
                    else {
                        newStr += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    }
                }
                else {
                    newStr += c;
                }
            }
            else {
                newStr += c;
            }
        }
        return newStr;
    }
// 获取地址栏字符串
    function getUrlString(str){
        var reg = new RegExp("(^|&)"+ str +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
// 获取地址栏文件名
    function getUrlPageName(){
        var url = window.location.href;
        var arr = url.split('/');
        return arr[arr.length-1].split('?')[0];
    }
// 限制字符串个数
    function checkStrNum(th,num){
        var val = $(th).val();
        if(val.length > num){
            layer.msg('Type up to '+ num +' characters');       //最多输入num个字符
            $(th).val($(th).attr('data-value'));
            return false;
        }else{
            $(th).attr('data-value',val);
        }
    }
// utf-8 字符转换
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for(i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    }
// 阻止默认行为
    function preDef(event){
        var e = event || window.event;
        if (typeof e.preventDefault != 'undefined'){ //W3C
            e.preventDefault();
        } else {  //IE
            e.returnValue = false;
        }
    }
// 阻止冒泡
    function stopPro(event) {
        var e = event || window.event;
        if (typeof e.stopPropagation != 'undefined') {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }
// 跨浏览器获取视口大小
    function getInner(){
        if (typeof window.innerWidth != 'undefined'){
            return {
                width: window.innerWidth,
                height: window.innerHeight
            }
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }   
    }
// 跨浏览器获取Style
    function getStyle(element, attr){
        if (typeof window.getComputedStyle != 'undefined'){ //W3C
            return window.getComputedStyle(element,null)[attr];
        } else if (typeof element.currentStyle !='undefined'){  //IE
            return element.currentStyle[attr];
        }       
    }
    function getStyle2(obj,attr){
        var ie = !+"\v1";       //简单判断ie6~8
        if (attr=="backgroundPosition") {//IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y
            if (ie) {        
                return obj.currentStyle.backgroundPositionX +" "+obj.currentStyle.backgroundPositionY;
            }
        }
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else{
            return document.defaultView.getComputedStyle(obj,null)[attr];
        }
    }
// 获取当前目标
    function getTarget(evt) {
        if (evt.target) {       //W3C
            return evt.target;
        } else if (window.event.srcElement) {       //IE
            return window.event.srcElement;
        }
    }
// 键码
    function getCharCode(evt) {
        var e = evt || window.event;
        if (typeof e.charCode == 'number') {
            return e.charCode;
        } else {
            return e.keyCode;
        }
    }
// 滚动条清零
    function scrollTop(){
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
//获得随机字符串(16位ASCII字符)
    function getRanNum(num){
        var result = [];
        for(var i=0; i<num; i++){
           var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
            //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
            result.push(String.fromCharCode(65+ranNum));
        }
        var str = result.join(",");
        var re = str.replace(/,/g, "");
        return re;
    }
