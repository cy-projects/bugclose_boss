/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
define(['xml','systemData','base','sidebar'], function(xml,systemData,base,sidebar){
	//头部用户名详情 下拉小箭头
	$(".username_wrap").click(function(event){
		if ( $(".user_setting").is(":hidden") ) {
			$(".user_setting").stop().slideDown();
		} else {
			$(".user_setting").stop().slideUp();
		}
	})

	$(document).click(function(event){
		var target = $(event.target);
		if(target.closest('.username_wrap,.user_setting').length != 0){
			if(target.closest('.change_password,.user_setting .exit').length == 0){
				return false;
			}
		}else{
			$(".user_setting").stop().slideUp();
		}
	})
	//sidebar左右收缩
	function hiddenSidebar(){
		$(".hiddenSidebar").click(function(){
			if ( $(".hiddenSidebar").attr("data-value") == 1 ) {
				$(".hiddenSidebar").attr("data-value",2);
				$(".headerLogo, .sidebar").stop().animate({ left: '-220px' });
				$(".headerRight, .bugContent").stop().animate({ left: 0 });
				base.fn.sidebar.hide_wrapperMinW( $(".main_table >thead th") );
			} else if ( $(".hiddenSidebar").attr("data-value") == 2 ) {
				$(".hiddenSidebar").attr("data-value",1);
				$(".headerLogo, .sidebar").stop().animate({ left: 0 });
				$(".headerRight, .bugContent").stop().animate({ left: '220px' });
				base.fn.sidebar.show_wrapperMinW( $(".main_table >thead th") );
					
			}

		})
	}
	hiddenSidebar();
	//侧边栏收缩按钮tips
	$(document).on('mouseover','.hiddenSidebar',function(){
		if ( $(".hiddenSidebar").attr("data-value") == 1 ) {			
			// layer.tips('收起左边栏','.hiddenSidebar',{ tips: 2, time: 1000 });
			$(".hiddenSidebar").attr('title','收起左边栏');
		} else if ( $(".hiddenSidebar").attr("data-value") == 2 ) {
			// layer.tips('展开左边栏','.hiddenSidebar',{ tips: 2, time: 1000 });
			$(".hiddenSidebar").attr('title','展开左边栏');
		}
	})
	




	var fn = {
		//sidebar 加载后的回调
		sidebarBack: function(){
			var _this = this;
			//滚动条
			// base.fn.slim.sidebar($(".sidebar >div"));
			//sidebar子栏目 上下拉伸
			for (var i=1; i<$(".side_menu ul").length; i++){
				base.fn.sidebar.sectionHeight( $(".side_menu ul").eq(i), 70 );
			}
			base.fn.sidebar.sectionHeight( $(".side_menu ul").eq(0), 50 );
			//sidebar 单项切换 加载样式
			_this.switch();
			//sidebar 单项切换 加载数据
			sidebar.clickBack();
		},
		//侧边栏切换动画效果
		switch: function(){
			var _this = this;
			$(".side_menu_item >li").click(function(){
				if (Window.systemOutlineData){
					clearTimeout(systemOutlineData);
				}
				base.fn.sidebar.itemAnimate($(this));
				base.fn.bugContentAni();
			})
		},

		
		
	}





	return{
		hiddenSidebar: hiddenSidebar,
		fn: fn
	}


})
