/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */
 
define(['base'], function(base){	
	//封装layer-confirm确认框的相似参数
		var confirmObj = {
			title : '提示',
			move : false,
			success: function(layero, index){
				$(layero).find(".layui-layer-setwin a").removeClass("layui-layer-ico").addClass("fa fa-remove");
				$(layero).find(".layui-layer-setwin").attr("title","关闭");
				layero.find(".layui-layer-close").click(function(ev){
					stopPro(ev);
					layero.remove();
					$(".layui-layer-shade").last().remove();
					if ($(".main_table").hasClass("blackList_table")) {
						$(".main_table >tbody >tr").removeClass("blackListDelTdOn");
					}
				})
			}
		}
	// layer回调相似
		var layerCallback = function(layero){
			layero.find(".layui-layer-setwin a").removeClass("layui-layer-ico").addClass("fa fa-remove");
			layero.find(".layui-layer-setwin").attr("title","关闭");
			layero.find(".layui-layer-content").css({height: 'auto'});
			layero.find(".cancelBtn, .layui-layer-close").click(function(ev){
				stopPro(ev);
				layero.remove();
				$(".layui-layer-shade").last().remove();
			})
			// slimScrollFn();
			// base.fn.slim.popup();
		}
	//增加弹出层
		var popupAdd = function ( title, ele, fn ){				
		    layer.open({
		    	title: "<span class='layer_title'><i class='fa fa-plus-circle'></i><strong>" + title + "</strong></span>",
		        type: 1,
		        area:  '600px',
		        content: ele,
		        offset: '60px',
		        shade:  [0.5, '#000000'],
		        shift: 0,
		        success: function(layero, index){
					layerCallback(layero);
					if (fn) { fn(layero); }
				}
		    });
		}
	//编辑弹出层
		var popupEdit =function ( title, ele, fn ){
		    layer.open({
		    	title: "<span class='layer_title'><i class='fa fa-edit'></i><strong>" + title + "</strong></span>",
		        type: 1,
		        area: '600px',
		        content: ele,
		        offset: '60px',
		        shade:  [0.5, '#000000'],
		        shift: 0,
		        success: function(layero, index){
					layerCallback(layero);
					if (fn) { fn(layero); }
				}
		    });
		}


	return{
		confirmObj: confirmObj,
		layerCallback: layerCallback,
		popupAdd: popupAdd,
		popupEdit: popupEdit,


	}
})
