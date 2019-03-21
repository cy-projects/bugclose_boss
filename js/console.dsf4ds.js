/**
 *
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */

window.onload = function(){
	layer.closeAll();
}

require.config({
	baseUrl: 'js',
	urlArgs: "v150",
	paths: {


	}
})


require(['xml','systemData','allow','base','validate','logout','changePwd','consoleBase', 'consoleData' ],
	function(xml,systemData,allow,	base,	validate,	logout,	changePwd,	consoleBase, consoleData){

	base.fn.slim.sidebar($(".sidebar >div"));
	base.fn.slim.content();
//用户登录信息
	bugAjax2({
		type: 'get',
		url: 'manager/get'
	},function(data){
		// console.log(data.root);
		if (data.success){
			GLOBAL._user = data.root;
			$(".setting .username_txt").html(data.root.fullName);
			$(".setting .userSetFace_username").html(data.root.username);
			var userObj = {
				id: data.root.id,
				username: data.root.username,
				fullName: data.root.fullName,
				disabled: data.root.disabled,
				roles: data.root.roles,
				managerType: data.root.managerType,
				expireTime: data.root.expireTime
			};

			bugStorage.setItem( 'userObj',JSON.stringify(userObj) );
			// var new_element = document.createElement("link");
			// new_element.setAttribute("rel","stylesheet");
			// new_element.setAttribute("href","css/consoleCenter.css?v143");
			// document.body.appendChild(new_element);
			//加载sidebar模板
			$(".sideMain").loadPage({
				url: 'bugContent.html',
				id: '.side_menu_SAAS',
				success: function(){
					consoleBase.fn.sidebarBack();
					base.fn.sidebar.itemAnimate($(".systemOutline"));
					// base.fn.sidebar.itemAnimate($(".userList"));

				}
			})
			//加载bugMain模板
			$(".bugMain").loadPage({
				url: 'bugContent.html',
				id: '.bugMain_systemOutline',
				// id: '.bugMain_user',
				success: function(){
					systemData.systemOutline();
					// consoleData.list.userCount();

					if (GLOBAL.demoFlag == true){
						$(".main_table thead i").remove();
						$(".main_table thead tr th").removeClass("sort");
					}
					base.fn.sidebar.show_wrapperMinW($(".main_table >thead th"));
				}
			})
		} else {
			errorType(data);
		}
	})

})
