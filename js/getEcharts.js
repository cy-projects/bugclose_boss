/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
define( ['xml', 'timeUtils'], function(xml, timeUtils){

	var dayX = [];
	var dayOrderNumber = [];
	var dayOrderMoney = [];
	var dayProjectNumber = [];
	var dayRegisterUserNumber = [];
	var dayRegisterIPNumber = [];
	var dayLoginUserNumber = [];
	var dayLoginIPNumber = [];

	var weekX = [];
	var weekOrderNumber = [];
	var weekOrderMoney = [];
	var weekProjectNumber = [];
	var weekRegisterUserNumber = [];
	var weekRegisterIPNumber = [];
	var weekLoginUserNumber = [];
	var weekLoginIPNumber = [];

	var monthX = [];
	var monthOrderNumber = [];
	var monthOrderMoney = [];
	var monthProjectNumber = [];
	var monthRegisterUserNumber = [];
	var monthRegisterIPNumber = [];
	var monthLoginUserNumber = [];
	var monthLoginIPNumber = [];

//日视图
	function dayLine(){
		var dayLineInit = echarts.init($("#dayEchart")[0]);
		dayLineInit.setOption({
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		    	selected: {
		    		'成交订单数': true,
		    		'交易金额(元)': false,
		    		'创建项目数': false,
		    		'注册用户数': false,
		    		'注册IP数': false,
		    		'登录用户数': false,
		    		'登录IP数': false
		    	},
		        data:['成交订单数','交易金额(元)','创建项目数','注册用户数','注册IP数','登录用户数','登录IP数']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: dayX
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [
		        {
		            name:'成交订单数',
		            type:'line',
		            data: dayOrderNumber,
		        },
		        {
		            name:'交易金额(元)',
		            type:'line',
		            data: dayOrderMoney
		        },
		        {
		            name:'创建项目数',
		            type:'line',
		            data: dayProjectNumber,
		        },
		        {
		            name:'注册用户数',
		            type:'line',
		            data: dayRegisterUserNumber,
		        },
		        {
		            name:'注册IP数',
		            type:'line',
		            data: dayRegisterIPNumber,
		        },
		        {
		            name:'登录用户数',
		            type:'line',
		            data: dayLoginUserNumber,
		        },
		        {
		            name:'登录IP数',
		            type:'line',
		            data: dayLoginIPNumber,
		        }
		    ]
		});
	}
//周视图
	function weekLine(){
		var weekLineInit = echarts.init($("#weekEchart")[0]);
		weekLineInit.setOption({
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		    	selected: {
		    		'成交订单数': true,
		    		'交易金额(元)': false,
		    		'创建项目数': false,
		    		'注册用户数': false,
		    		'注册IP数': false,
		    		'登录用户数': false,
		    		'登录IP数': false
		    	},
		        data:['成交订单数','交易金额(元)','创建项目数','注册用户数','注册IP数','登录用户数','登录IP数']
		    },
		    grid: {
		        left: '3%',
		        right: '6%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: weekX
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [
		        {
		            name:'成交订单数',
		            type:'line',
		            data: weekOrderNumber
		        },
		        {
		            name:'交易金额(元)',
		            type:'line',
		            data: weekOrderMoney
		        },
		        {
		            name:'创建项目数',
		            type:'line',
		            data: weekProjectNumber
		        },
		        {
		            name:'注册用户数',
		            type:'line',
		            data: weekRegisterUserNumber
		        },
		        {
		            name:'注册IP数',
		            type:'line',
		            data: weekRegisterIPNumber
		        },
		        {
		            name:'登录用户数',
		            type:'line',
		            data: weekLoginUserNumber
		        },
		        {
		            name:'登录IP数',
		            type:'line',
		            data: weekLoginIPNumber
		        }
		    ]
		});		
	}
//月视图
	function monthLine(){
		var monthLineInit = echarts.init($("#monthEchart")[0]);
		monthLineInit.setOption({
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		    	selected: {
		    		'成交订单数': true,
		    		'交易金额(元)': false,
		    		'创建项目数': false,
		    		'注册用户数': false,
		    		'注册IP数': false,
		    		'登录用户数': false,
		    		'登录IP数': false
		    	},
		        data:['成交订单数','交易金额(元)','创建项目数','注册用户数','注册IP数','登录用户数','登录IP数']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: monthX
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [
		        {
		            name:'成交订单数',
		            type:'line',
		            data: monthOrderNumber
		        },
		        {
		            name:'交易金额(元)',
		            type:'line',
		            data: monthOrderMoney
		        },
		        {
		            name:'创建项目数',
		            type:'line',
		            data: monthProjectNumber
		        },
		        {
		            name:'注册用户数',
		            type:'line',
		            data: monthRegisterUserNumber
		        },
		        {
		            name:'注册IP数',
		            type:'line',
		            data: monthRegisterIPNumber
		        },
		        {
		            name:'登录用户数',
		            type:'line',
		            data: monthLoginUserNumber
		        },
		        {
		            name:'登录IP数',
		            type:'line',
		            data: monthLoginIPNumber
		        }
		    ]
		});		
	}
//重排序对象
	function objKeySort(obj) {//排序的函数
	    var newkey = Object.keys(obj).sort();	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组　　
	    var newObj = {};	//创建一个新的对象，用于存放排好序的键值对
	    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
	        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
	    }
	    return newObj;
	}
//日
	function get_dayX(fn){	//获取x轴日期数组
		bugAjax2({
			type: 'get',
			url: 'stat/group',
			dataJson: {
				groupTarget: 'RegisterUserNumber',
				groupMode: 'Day'
			}
		},function(data){
			// console.log(data.root);
			if(data.success){
				var newDataSort = objKeySort(data.root);
				for ( key in newDataSort){
					dayX.push(key);
				}
				if (fn){fn()};
			} else{
				errorType(data);
			}
		})
	}
//周
	function get_weekX(fn){
		bugAjax2({
			type: 'get',
			url: 'stat/group',
			dataJson: {
				groupTarget: 'RegisterUserNumber',
				groupMode: 'Week'
			}
		},function(data){
			// console.log(data.root);
			if(data.success){
				var newDataSort = objKeySort(data.root);
				for ( key in newDataSort){
					weekX.push(key+' 至\n'+timeUtils.msToDate( +new Date(key) + 6*24*3600*1000 ));
				}
				if (fn){fn()};
			} else{
				errorType(data);
			}
		})
	}

//月
	function get_monthX(fn){
		bugAjax2({
			type: 'get',
			url: 'stat/group',
			dataJson: {
				groupTarget: 'RegisterUserNumber',
				groupMode: 'Month'
			}
		},function(data){
			// console.log(data.root);
			if(data.success){
				var newDataSort = objKeySort(data.root);
				for ( key in newDataSort){
					monthX.push(key);
				}
				if (fn){fn()};
			} else{
				errorType(data);
			}
		})
	}
//获取交易金额
	function trendData_pay(groupTarget, groupMode, numArr, fn){	
		bugAjax2({
			type: 'get',
			url: 'stat/group',
			dataJson: {
				groupTarget: groupTarget,
				groupMode: groupMode
			}
		},function(data){
			// console.log(data.root);
			if(data.success){
				var newDataSort = objKeySort(data.root);
				for ( key in newDataSort){
					numArr.push( (parseFloat((newDataSort[key])/100)) )
				}
				if (fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
//获取其他数据
	function trendData(groupTarget, groupMode, numArr, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/group',
			dataJson: {
				groupTarget: groupTarget,
				groupMode: groupMode
			}
		},function(data){
			// console.log(data.root);
			if(data.success){
				var newDataSort = objKeySort(data.root);
				for ( key in newDataSort){
					numArr.push(newDataSort[key])
				}
				if (fn){fn()};
			} else {
				errorType(data);
			}
		})
	}


	var echartsFn = {
		day: function(){
			var loadingDayEchart = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>正在加载...',{
	            time : 5*60*1000,
	            shade : [ 0.4, '#000',true ]
	        });

			dayX = [];
			dayOrderNumber = [];
			dayOrderMoney = [];
			dayProjectNumber = [];
			dayRegisterUserNumber = [];
			dayRegisterIPNumber = [];
			dayLoginUserNumber = [];
			dayLoginIPNumber = [];
			get_dayX(function(){
				trendData('OrderNumber', 'Day', dayOrderNumber, function(){
					trendData_pay('OrderMoney', 'Day', dayOrderMoney, function(){
						trendData('ProjectNumber', 'Day', dayProjectNumber, function(){
							trendData('RegisterUserNumber', 'Day', dayRegisterUserNumber, function(){
								trendData('RegisterIPNumber', 'Day', dayRegisterIPNumber, function(){
									trendData('LoginUserNumber', 'Day', dayLoginUserNumber, function(){
										trendData('LoginIPNumber', 'Day', dayLoginIPNumber, function(){
											layer.close(loadingDayEchart);
											dayLine();
										})
									})
								})
							})
						})
					})
				})
			});
		},
		week: function(){
			var loadingWeekEchart = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>正在加载...',{
	            time : 5*60*1000,
	            shade : [ 0.4, '#000',true ]
	        });

			weekX = [];
			weekOrderNumber = [];
			weekOrderMoney = [];
			weekProjectNumber = [];
			weekRegisterUserNumber = [];
			weekRegisterIPNumber = [];
			weekLoginUserNumber = [];
			weekLoginIPNumber = [];
			get_weekX(function(){
				trendData('OrderNumber', 'Week', weekOrderNumber, function(){
					trendData_pay('OrderMoney', 'Week', weekOrderMoney, function(){
						trendData('ProjectNumber', 'Week', weekProjectNumber, function(){
							trendData('RegisterUserNumber', 'Week', weekRegisterUserNumber, function(){
								trendData('RegisterIPNumber', 'Week', weekRegisterIPNumber, function(){
									trendData('LoginUserNumber', 'Week', weekLoginUserNumber, function(){
										trendData('LoginIPNumber', 'Week', weekLoginIPNumber, function(){
											layer.close(loadingWeekEchart);
											weekLine();
										})
									})
								})
							})
						})
					})
				})
			});
		},
		month: function(){
			var loadingMonthEchart = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>正在加载...',{
	            time : 5*60*1000,
	            shade : [ 0.4, '#000',true ]
	        });

			monthX = [];
			monthOrderNumber = [];
			monthOrderMoney = [];
			monthProjectNumber = [];
			monthRegisterUserNumber = [];
			monthRegisterIPNumber = [];
			monthLoginUserNumber = [];
			monthLoginIPNumber = [];
			get_monthX(function(){
				trendData('OrderNumber', 'Month', monthOrderNumber, function(){
					trendData_pay('OrderMoney', 'Month', monthOrderMoney, function(){
						trendData('ProjectNumber', 'Month', monthProjectNumber, function(){
							trendData('RegisterUserNumber', 'Month', monthRegisterUserNumber, function(){
								trendData('RegisterIPNumber', 'Month', monthRegisterIPNumber, function(){
									trendData('LoginUserNumber', 'Month', monthLoginUserNumber, function(){
										trendData('LoginIPNumber', 'Month', monthLoginIPNumber, function(){
											layer.close(loadingMonthEchart);
											monthLine();
										})
									})
								})
							})
						})
					})
				})
			});
		}
	}
	return{
		echartsFn: echartsFn
	}
})

