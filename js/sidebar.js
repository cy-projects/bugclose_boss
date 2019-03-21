/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
define(['xml','systemData','base','allow','consoleData','getEcharts'],function(xml,systemData,base,allow,consoleData,getEcharts){
	var clickBack = function(){
		//系统概况
		$(".systemOutline").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_systemOutline',
				success: function(){
					systemData.systemOutline();
				}
			})
		})
		//日趋势
		$(".dayTrend").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_day',
				success: function(){
					getEcharts.echartsFn.day();
				}
			})
		})
		//周趋势
		$(".weekTrend").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_week',
				success: function(){
					getEcharts.echartsFn.week();
				}
			})
		})
		//月趋势
		$(".monthTrend").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_month',
				success: function(){
					getEcharts.echartsFn.month();
				}
			})
		})
		//用户列表
		$(".userList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_user',
				success: function(){
					consoleData.list.userCount();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
					// allow.fn.managerTypeAllow();
					// consoleData.detailOpt.user.new();
				}
			})
		})
		//问题列表
		$(".userQList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_userQ',
				success: function(){
					consoleData.list.userQCount();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		//邀请列表
		$(".invitedList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_invited',
				success: function(){
					consoleData.list.invitedCount();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		//公司列表
		$(".companyList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_company',
				success: function(){
					consoleData.list.companyCount();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		//项目列表
		$(".projectList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_project',
				success: function(){
					consoleData.list.projectCount();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		//订单列表
		$(".orderList").click(function(){		
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_order',
				success: function(){
					consoleData.list.orderCount();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		// 发票列表
		$(".invoiceList").click(function(){		
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_invoice',
				success: function(){
					// consoleData.list.orderCount();
					// base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
					
				}
			})
		})
		// 客户列表
		$(".customerList").click(function(){		
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_customer',
				success: function(){
					consoleData.list.customerList();
					base.fn.slim.homePick();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		//管理员
		$(".adminList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_admin',
				success: function(){
					consoleData.list.adminHome();
					base.fn.slim.homePick();
					consoleData.detailOpt.admin.new();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})	
		//黑名单
		$(".blackList").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_black',
				success: function(){
					consoleData.list.blackHome();
					base.fn.slim.homePick();
					consoleData.detailOpt.black.new();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})
		//App 版本管理
		$(".appList").click(function(){		
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_app',
				success: function(){
					consoleData.list.appCount();
					base.fn.slim.homePick();
					consoleData.detailOpt.app.new();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})	
		//设置
		$(".smSet").click(function(){
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_smSet',
				success: function(){
					consoleData.detailOpt.set.upDateWexinServiceNum();
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		})		
	}
	return{
		clickBack: clickBack
	}
})

