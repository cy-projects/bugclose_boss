/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */

define( ['xml', 'timeUtils'], function(xml, timeUtils){
	return {
		systemOutline: function(){
			var yesterday 			= timeUtils.getSomeDaysLaterDate(now, -1),
				weekBeginDate 		= timeUtils.getSomeWeeksLaterBeginDate(now, 0),
				weekEndDate 		= timeUtils.getSomeWeeksLaterEndDate(now, 0),
				prevWeekBeginDate 	= timeUtils.getSomeWeeksLaterBeginDate(now, -1),
				prevWeekEndDate 	= timeUtils.getSomeWeeksLaterEndDate(now, -1),
				monthBeginDate 		= timeUtils.getSomeMonthsLaterBeginDate(now, 0),
				monthEndDate 		= timeUtils.getSomeMonthsLaterEndDate(now, 0),
				prevMothBeginDate 	= timeUtils.getSomeMonthsLaterBeginDate(now, -1),
				prevMothEndDate 	= timeUtils.getSomeMonthsLaterEndDate(now, -1);
			bugAjax2({
				url: 'user/heartBeat'
			},function(data){
				// console.log(data.root,data);
				if (data.success){
					window.systemOutlineData = setTimeout(function(){
						loadingSystemData = layer.msg('<i class="fa fa-spinner fa-spin" style="margin-right: 10px;"></i>正在加载...',{
				            time : 5*60*1000,
				            shade : [ 0.4, '#000',true ]
				        });
						orderNumberDataFn();
					}, 0);
					function orderNumberDataFn(){
						orderNumberFn(nowDate, nowDate, $(".orderNumberDay"), function(){
							orderNumberFn(yesterday, yesterday, $(".orderNumberYesterday"), function(){
								orderNumberFn(weekBeginDate, weekEndDate, $(".orderNumberWeek"), function(){
									orderNumberFn(prevWeekBeginDate, prevWeekEndDate, $(".orderNumberLastweek"), function(){
										orderNumberFn(monthBeginDate, monthEndDate, $(".orderNumberMonth"), function(){
											orderNumberFn(prevMothBeginDate, prevMothEndDate, $(".orderNumberLastmonth"), function(){
												orderNumberFn('', '', $(".orderNumberAllmonth"), orderMoneyDataFn);
											})
										})
									})
								})
							})
						})
					}
					function orderMoneyDataFn(){
						orderMoneyFn(nowDate, nowDate, $(".orderMoneyDay"), function(){
							orderMoneyFn(yesterday, yesterday, $(".orderMoneyYesterday"), function(){
								orderMoneyFn(weekBeginDate, weekEndDate, $(".orderMoneyWeek"), function(){
									orderMoneyFn(prevWeekBeginDate, prevWeekEndDate, $(".orderMoneyLastweek"), function(){
										orderMoneyFn(monthBeginDate, monthEndDate, $(".orderMoneyMonth"), function(){
											orderMoneyFn(prevMothBeginDate, prevMothEndDate, $(".orderMoneyLastmonth"), function(){
												orderMoneyFn('', '', $(".orderMoneyAllmonth"), projectNumberDataFn );
											})
										})
									})
								})
							})
						})
					}
					function projectNumberDataFn(){
						projectNumberFn(nowDate, nowDate, $(".projectNumberDay"), function(){
							projectNumberFn(yesterday, yesterday, $(".projectNumberYesterday"), function(){
								projectNumberFn(weekBeginDate, weekEndDate, $(".projectNumberWeek"), function(){
									projectNumberFn(prevWeekBeginDate, prevWeekEndDate, $(".projectNumberLastweek"), function(){
										projectNumberFn(monthBeginDate, monthEndDate, $(".projectNumberMonth"), function(){
											projectNumberFn(prevMothBeginDate, prevMothEndDate, $(".projectNumberLastmonth"), function(){
												projectNumberAllmonthFn(registerUserNumberDataFn);
											})
										})
									})
								})
							})
						})
					}
					function registerUserNumberDataFn(){
						registerUserNumberFn(nowDate, nowDate, $(".registerUserNumberDay"), function(){
							registerUserNumberFn(yesterday, yesterday, $(".registerUserNumberYesterday"), function(){
								registerUserNumberFn(weekBeginDate, weekEndDate, $(".registerUserNumberWeek"), function(){
									registerUserNumberFn(prevWeekBeginDate, prevWeekEndDate, $(".registerUserNumberLastweek"), function(){
										registerUserNumberFn(monthBeginDate, monthEndDate, $(".registerUserNumberMonth"), function(){
											registerUserNumberFn(prevMothBeginDate, prevMothEndDate, $(".registerUserNumberLastmonth"), function(){
												registerUserNumberAllmonthFn(registerIPNumberDataFn);
											})
										})
									})
								})
							})
						})
					}
					function registerIPNumberDataFn(){
						registerIPNumberFn(nowDate, nowDate, $(".registerIPNumberDay"), function(){
							registerIPNumberFn(yesterday, yesterday, $(".registerIPNumberYesterday"), function(){
								registerIPNumberFn(weekBeginDate, weekEndDate, $(".registerIPNumberWeek"), function(){
									registerIPNumberFn(prevWeekBeginDate, prevWeekEndDate, $(".registerIPNumberLastweek"), function(){
										registerIPNumberFn(monthBeginDate, monthEndDate, $(".registerIPNumberMonth"), function(){
											registerIPNumberFn(prevMothBeginDate, prevMothEndDate, $(".registerIPNumberLastmonth"), loginUserNumberDataFn );
										})
									})
								})
							})
						})
					}
					function loginUserNumberDataFn(){
						loginUserNumberFn(nowDate, nowDate, $(".loginUserNumberDay"), function(){
							loginUserNumberFn(yesterday, yesterday, $(".loginUserNumberYesterday"), function(){
								loginUserNumberFn(weekBeginDate, weekEndDate, $(".loginUserNumberWeek"), function(){
									loginUserNumberFn(prevWeekBeginDate, prevWeekEndDate, $(".loginUserNumberLastweek"), function(){
										loginUserNumberFn(monthBeginDate, monthEndDate, $(".loginUserNumberMonth"), function(){
											loginUserNumberFn(prevMothBeginDate, prevMothEndDate, $(".loginUserNumberLastmonth"), loginIPNumberDataFn );
										})
									})
								})
							})
						})
					}
					function loginIPNumberDataFn(){
						loginIPNumberFn(nowDate, nowDate, $(".loginIPNumberDay"), function(){
							loginIPNumberFn(yesterday, yesterday, $(".loginIPNumberYesterday"), function(){
								loginIPNumberFn(weekBeginDate, weekEndDate, $(".loginIPNumberWeek"), function(){
									loginIPNumberFn(prevWeekBeginDate, prevWeekEndDate, $(".loginIPNumberLastweek"), function(){
										loginIPNumberFn(monthBeginDate, monthEndDate, $(".loginIPNumberMonth"), function(){
											loginIPNumberFn(prevMothBeginDate, prevMothEndDate, $(".loginIPNumberLastmonth"), function(){
												layer.close(loadingSystemData);
											});
										})
									})
								})
							})
						})
					}
				} else {
					errorType(data);
				}
			})
		}
	}
	//成交订单数
	function orderNumberFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/orderNumber',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*3; }
				ele.html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
	//交易金额
	function orderMoneyFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/orderMoney',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*3; }
				ele.html((parseFloat((data.root)/100)).toFixed(2));
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
	//创建项目数
	function projectNumberFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/projectNumber',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*3; }
				ele.html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
	function projectNumberAllmonthFn(fn){
		bugAjax2({
			type: 'get',
			url: 'stat/projectNumber'
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)+ 30000; }
				$(".projectNumberAllmonth").html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
	//注册用户数
	function registerUserNumberFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/registerUserNumber',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*3; }
				ele.html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
	function registerUserNumberAllmonthFn(fn){
		bugAjax2({
			type: 'get',
			url: 'stat/registerUserNumber'
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)+50000; }
				$(".registerUserNumberAllmonth").html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}	
	//注册IP数
	function registerIPNumberFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/registerIPNumber',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*2; }
				ele.html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}		
	//登陆用户数
	function loginUserNumberFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/loginUserNumber',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*3; }
				ele.html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
	//登陆IP数
	function loginIPNumberFn(begin,end,ele, fn){
		bugAjax2({
			type: 'get',
			url: 'stat/loginIPNumber',
			dataJson: {
				beginDate: begin,
				endDate: end
			}
		},function(data){
			// console.log(data.root,data);
			if (data.success){
				if (GLOBAL.demoFlag == true){ data.root = (data.root)*3; }
				ele.html(data.root);
				if(fn){fn()};
			} else {
				errorType(data);
			}
		})
	}
		



})












































