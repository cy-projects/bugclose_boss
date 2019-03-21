/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
 define(['xml'],function(xml){

 	//time毫秒、时间， date日期, ms毫秒， to转换， current当前， formatter格式化
 	return {
 		//获取当前时间毫秒
 		getCurrentMs: function(){
 			return now.getTime();
 		},
 		//毫秒 转 时间格式(含时间)	(如： 2017-08-27 14:42:14)
 		msToDateTime: function(time){
 			if(time === undefined){ 
 				return '';
 			} else{
 				var myDate = new Date(time);
 				return this.formatterDateTime(myDate);
 			}
 		},
 		//毫秒 转 时间格式(不含时间)	(如： 2017-08-27)
 		msToDate: function(time){
 			if(time === undefined){ 
 				return '';
 			} else{
	 			var myDate = new Date(time);
	 			return this.formatterDate(myDate);
 			}
 		},
 		//毫秒 转 时间格式(不含时间)	(如： 2017-08-27 00:00:00)
 		msToDate2: function(time){
 			var myDate = new Date(time);
 			return this.formatterDate2(myDate);
 		},
 		//毫秒 转 时间格式(不含时间)	(如： 08-27)
 		msToDate3: function(time){
 			var myDate = new Date(time);
 			return this.formatterDate3(myDate);
 		},

 		//格式化日期(含时间)
        formatterDateTime: function(date){
        	var result = td(date.getFullYear()) + "-" + td(date.getMonth()+1) + "-" + td(date.getDate()) + " "
 				+ td(date.getHours()) + ":" + td(date.getMinutes()) + ":" + td(date.getSeconds());
 			return result;
        },
 		//格式化日期(不含时间)
 		formatterDate: function(date){
 			var result = td(date.getFullYear()) + "-" + td(date.getMonth()+1) + "-" + td(date.getDate());
 			return result;
 		},
 		//格式化日期(含时间"00:00:00")
 		formatterDate2: function(date){
 			var result = td(date.getFullYear()) + "-" + td(date.getMonth()+1) + "-" + td(date.getDate()) + " " + "00:00:00";
 			return result;
 		},
 		//格式化日期(不含时间)
 		formatterDate3 : function(date) {
            var result = td(date.getMonth()+1) + "-" + td(date.getDate());              
            return result;
        },

        //获取过去了多长时间
        getLongtime: function(time){
        	var nowMs = this.getCurrentMs();
        	var longtime = nowMs - time;
        	var s = longtime/1000,
        		m = longtime/1000/60,
        		h = longtime/1000/60/60,
        		d = longtime/1000/60/60/24;
        	if(m>=1 && m<60){
        		return parseInt(m) + '分钟前';
        	} else if(h>=1 && h<24){
        		return parseInt(h) + '小时前';
        	} else if(h>=24){
        		return this.msToDate(time);
        	} else{
        		return '刚刚';
        	}
        },
        //获取过去了多少天
        getLongDays: function(time){
        	var nowMs = this.getCurrentMs();
        	var longtime = nowMs - time;
        	var s = longtime/1000,
        		m = longtime/1000/60,
        		h = longtime/1000/60/60,
        		d = longtime/1000/60/60/24;
        	return td(Math.floor(d));
        },
        //获取还剩多少天
        getSurplusDays: function(time){
        	var nowMs = this.getCurrentMs();
        	var longtime = time - nowMs;
        	var s = longtime/1000,
        		m = longtime/1000/60,
        		h = longtime/1000/60/60,
        		d = longtime/1000/60/60/24;
        	return td(Math.floor(d));
        },
        //判断时间
        isNowTime: function(time){
        	var is = '';
        	var nowMs = this.getCurrentMs();
        	var stime = this.msToDate(nowMs).replace(new RegExp("-","gm"),"/");
        	var ntime = (new Date(stime)).getTime();
        	if(time > ntime){
        		//console.log('未到期');
        		is = 1;
        	}else if(time == time){
        		//console.log(’今天);
        		is = 0;
        	}else{
        		//console.log('过期');
        		is = -1;
        	}
        	return is;
        },
        //加上X个月之后的年月日
        getXMonthAfter: function(num){
        	var myAfterDate = new Date(now.getFullYear(), now.getMonth()+num, now.getDate());
        	return myAfterDate.getFullYear() +'年'+ (myAfterDate.getMonth()+1) +'月'+ myAfterDate.getDate() +'日';
        },
        //获取一段时间的日期
        GetDates: function(begin, end){	 // console.log( timeUtils.GetDates("2017-08-25", "2017-08-28"));
        	var ab = begin.split("-");					//["2017", "08", "25"]
        	var db = new Date();						//Sun Aug 27 2017 23:16:36 GMT+0800 (中国标准时间)
        		db.setFullYear(ab[0], ab[1]-1, ab[2]);	//Fri Aug 25 2017 23:16:36 GMT+0800 (中国标准时间)

        	var ae = end.split("-");
        	var de = new Date();
        		de.setFullYear(ae[0], ae[1]-1, ae[2]);	//Mon Aug 28 2017 23:16:36 GMT+0800 (中国标准时间)
        	var a = [];

        	for (var i=0,temp=db; temp<de; i++){
        		var month = td(temp.getMonth()+1);
        		var day = td(temp.getDate());
        		a[i] = temp.getFullYear() + "-" + month + "-" + day;
        		temp.setTime(temp.getTime() + 24*60*60*1000);
        	}
        	return a;	//["2017-08-25", "2017-08-26", "2017-08-27"]
        },
    	//获取所传时间 	n天后(日期)
    	getSomeDaysLaterDate: function(time, n){
			if(time) return this.msToDate( +new Date(time) + n*24*60*60*1000 );
		},
    	//获取所传时间 	n周后（开始天数）
    	getSomeWeeksLaterBeginDate: function(time, n){
    		var day = (new Date(time)).getDay();
    		if (time) return this.msToDate( +new Date(time) - ( day -n*7)*24*60*60*1000 );
    	},
    	//获取所传时间 	n周后（结束天数）
    	getSomeWeeksLaterEndDate: function(time, n){
    		var day = (new Date(time)).getDay();
    		if (time) return this.msToDate( +new Date(time) + (6 - day + n*7)*24*60*60*1000 );
    	},
    	//获取所传时间	n月后（开始天数）
    	getSomeMonthsLaterBeginDate: function(time, n){
    		if (time){
    			var aaa = new Date(time);
    			var y = aaa.getFullYear(),
    				m = aaa.getMonth() + n,
    				result = null;
    			result = new Date(y,m);
    			result = this.msToDate(result);
    			return result;
    		}
    	},
    	//获取所传时间	n月后（结束天数）
    	getSomeMonthsLaterEndDate: function(time, n){
    		if (time){
    			var nextMonthMs = +new Date( this.getSomeMonthsLaterBeginDate(time,n+1) ),
    				oneDayMs = 24*60*60*1000;
    			return this.msToDate(nextMonthMs - oneDayMs);
    		}
    	},




 	}




 });




//Bootstrap dateTimePicker日期
	//yyyy
		var yyyy = function( a , b){
			a.datetimepicker({
				format: 'yyyy',				//日期格式
				autoclose: true,			//当选择一个日期之后是否立即关闭此日期时间选择器。
				keyboardNavigation: true,	//是否允许通过方向键该改变日期
				todayHighlight: 1,			//高亮当前日期
				startView: 4,				//日期时间选择器打开之后首先显示的视图。
				minView: 4,					//日期时间选择器所能够提供的最精确的时间选择视图。
				language:　'zh-CN',
				clearBtn: true				//清除按钮
			});
			a.datetimepicker('setStartDate', b );
		}
	//yyyy (月报专用)(清除时，写入placeholder = [No set])
		var yyyyMonthlyReports = function( a , b ){
			a.datetimepicker({
				format: 'yyyy',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 4,
				minView: 4,
				language:　'zh-CN',
				clearBtn: true
			});
			a.datetimepicker('setStartDate', b );
			a.datetimepicker().on('changeDate', function(ev){
				if ( a.val() == '' ) { a.attr('placeholder','[ No set ]'); }
			})
		}
	//yyyy-mm-dd
		var yymmdd = function( a , b){
			a.datetimepicker({
				format: 'yyyy-mm-dd',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				language:　'zh-CN',
				clearBtn: true
			});
			a.datetimepicker('setStartDate', b );
		}
	//From yyyy-mm-dd to yyyy-mm-dd(可以传参限制日期)
		var yymmddDbl= function (a,b,c){
			a.datetimepicker({
				format: 'yyyy-mm-dd',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				language:　'zh-CN',
				clearBtn: true,
			});
			a.datetimepicker('setStartDate', c );
			a.datetimepicker().on('changeDate', function(ev){
				if ( ev.date != null ) {
					if ( +new Date(a.val()) >= +new Date(b.val()) ) { 
						b.val( a.val() );
					};
				}
			})
			b.datetimepicker({
				format: 'yyyy-mm-dd',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				language:　'zh-CN',
				clearBtn: true,
			});
			b.datetimepicker('setStartDate', c );
			b.datetimepicker().on('changeDate', function(ev){
				if ( ev.date != null ) {
					if ( +new Date(a.val()) >= +new Date(b.val()) ) { a.val( b.val() ) };
				}
			})
		}
	//From yyyy-mm-dd to yyyy-mm-dd(可以传参限制日期)(月报专用)(清除时，写入placeholder = [No set])
		var yymmddDblWeeklyReports= function (a,b,c){
			a.datetimepicker({
				format: 'yyyy-mm-dd',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				language:　'zh-CN',
				clearBtn: true,
			});
			a.datetimepicker('setStartDate', c );
			a.datetimepicker().on('changeDate', function(ev){
				if ( ev.date != null ) {
					if ( +new Date(a.val()) >= +new Date(b.val()) ) { 
						b.val( a.val() );
					};
				}
				if ( a.val() == '' ) { a.attr('placeholder','[ No set ]'); }
			})
			b.datetimepicker({
				format: 'yyyy-mm-dd',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				language:　'zh-CN',
				clearBtn: true,
			});
			b.datetimepicker('setStartDate', c );
			b.datetimepicker().on('changeDate', function(ev){
				if ( ev.date != null ) {
					if ( +new Date(a.val()) >= +new Date(b.val()) ) { a.val( b.val() ) };
				}
				if ( b.val() == '' ) { b.attr('placeholder','[ No set ]'); }
			})
		}
		//From yyyy-mm-dd(清除时，写入placeholder = [All])
		var yymmddClear_addPlaceholderAll= function (a,b){
			a.datetimepicker({
				format: 'yyyy-mm-dd',
				autoclose: true,
				keyboardNavigation: true,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				language:　'zh-CN',
				clearBtn: true,
			});
			a.datetimepicker('setStartDate', b );
			a.datetimepicker().on('changeDate', function(ev){
				if ( a.val() == '' ) { a.attr('placeholder','[All]'); }
			})
		}
	//hh:ii
		var hhii = function( a ){
			a.datetimepicker({
				format: 'hh:ii',
				autoclose: true,
				keyboardNavigation: true,
				startView: 1,
				minView: 0,
				language:　'zh-CN',
				clearBtn: true,
				title: ''
			});
			$(".datetimepicker thead tr th").empty();
			$(".table-condensed thead>tr>th").css({"padding":"0","height":"0"});
		}
