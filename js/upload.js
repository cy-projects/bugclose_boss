
define(['xml'], function(xml){



var file_input, file_form;
var flag = true,f_flag = true;

//绑定drop事件(drop 不支持jq的bind和on )
  $.fn.listen = function (type, fn) {
    return this.each(function () {
      $(this)[0].addEventListener(type, function (e) {
        if(!fn.call($(this),e)){
          e.stopPropagation();
          e.preventDefault();
        }
      });
    })
  };

$.fn.uploadImage = function (json,fn) {
  //初始化
  var config = {
    token : boss_token || bugStorage.getItem('boss_token'),
    id:'',
    projectId : '',
    url : '',
    method : 'post',
    isOnly : false,
    isFujian : false,
    isMobile : false,
    isPaste : false,
    channel : false,
    // acceptedFiles: 'image/*,application/*',
    imageIds : {
        array : [],
        setId : function (arr) {
            this.array = arr;
        },
        getId : function () {
            return this.array;
        }
    },
    attachmentIds : {
        array : [],
        setId : function (arr) {
            this.array = arr;
        },
        getId : function () {
            return this.array;
        }
    },
  };   
    
  return this.each(function(){
    var $this = $(this);

    opt = $.extend({}, config, json);  //上传ajax参数
    opt.url = '/cgi/'+ opt.url;
    $this.opt = opt;
    $this.attr('data-opt',JSON.stringify(opt));

    $this.on('dragenter', function (ev){  
      ev.preventDefault();
    }).on('dragover', function (ev){
      ev.preventDefault();
    }).listen('drop', function (e) {
      var files = e.dataTransfer;
      opt = $this.opt;
      uploadImg($this,files,fn);
    });

    if($this.opt.isOnly){
      $this.click(function () { selectImage(); });
      $this.siblings('.selectImages').click(function () { selectImage(); });
    }else{
      $this.siblings('.selectImages').click(function () { selectImage(); });
    }
    var selectImage = function () {
      opt = $this.opt;

      window.fileChange = function (th) {
        uploadImg($this,th,fn); //$this 指上传按钮； th指input； fn 成功后的回掉函数
      };

      file_form = $('<form enctype="multipart/form-data" accept-charset="UTF-8"></form>');
      // enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码。
      // multipart/form-data  不对字符编码。 在使用包含文件上传控件的表单时，必须使用该值。
      if(opt.isOnly){
          file_input = $('<input type="file" name="file" onchange="fileChange(this)" accept="image/*" >');
          // accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"   input[file]标签的accept属性可用于指定上传文件的 MIME类型 
        }else{
          if(opt.isFujian){
            file_input = $('<input type="file" name="file" onchange="fileChange(this)"  multiple="multiple">');
          }else{
            file_input = $('<input type="file" name="file" onchange="fileChange(this)" accept="image/jpeg,.jpg,.png,.bmp,.gif" multiple="multiple">');
        }
      }
      file_input.appendTo(file_form);
      file_input.click();
    };       
  })
};

function uploadImg(th,file,callback){
  var files = file.files;
  
  if(files.length){
    if (!opt.isOnly){// 多个文件
      if (opt.isFujian){
        if (f_flag && opt.attachmentIds.getId().length == 0){
          th.empty();
          f_flag = false;
        }
      } else{
        if (flag && opt.imageIds.getId().length == 0){
          th.empty();
          flag = false;
          th.addClass('upload-file-bg');
        }
      }
    } else{ //单个文件
      var newFiles = [];
      newFiles.push(files[0]);
      files = newFiles;       
    }
    console.log('文件',files);


    for(var i=0; i<files.length; i++){
      // 上传附件数量限制
      if(opt.isFujian && i>(GLOBAL.AttachmentNumber - 1)){
        layer.msg('最多上传'+GLOBAL.AttachmentNumber+'个附件');
        return false;
      }
      if(opt.isFujian && th.children().length >= GLOBAL.AttachmentNumber){
        layer.msg('最多上传'+GLOBAL.AttachmentNumber+'个附件');
        return false;
      }

      // 如果循环文件用的是let( let i = 0 ); 可以去掉匿名函数
      (function (i) {
        var img_name = files[i].name; //文件名字
        var img_type = files[i].type; //文件类型
        var img_size = files[i].size; //文件大小（单位B  1M=1024*1024）

        // 如果是上传附件
        if (opt.isFujian){
          // 文件大小是否满足
          if (img_size < 1024*1024*GLOBAL.AttachmentSize){
            // 文件类型是否允许
            if (filterFileType(img_name)){  
              var random = '';
              for (var n=0;n<10;n++){ random += Math.floor(Math.random()*10); }

              th.append('<p class="file-'+random+'">\
                          <i class="fa fa-paperclip"></i>\
                          <span class="fj-name"> '+img_name+'</span>\
                          <span class="fr defaultColor">正在上传 <em class="file-progress">0%</em></span>\
                      </p>');
              //上传参数
              var formData = new FormData();
              formData.charset = 'UTF-8';
              formData.append('file',files[i]);
              if (opt){var params = opt; for (k in params){formData.append(k, params[k]);}}
              formData.append('attachment', true);

              // ajax调用
              ajax(formData, function(percent){
                if (percent == 100) $('.file-'+random+' .fr').html('正在处理');
                $('.file-'+random+' em').html(percent+'%');
              },function(rs){
                console.log('文件返回结果', rs);
                if (rs.success){
                  // 更新DOM
                  $('.file-'+random+' span.fr').html('<i class="fa fa-times-circle-o del" id="'+rs.root.id+'" alt="删除" title="删除"></i>');
                  // $('.file-'+random+' span.fr').prepend('<i class="fa fa-pencil-square-o edit" id="'+rs.root.id+'" data-name="'+rs.root.originalFileName+'" alt="编辑名称" title="编辑名称"></i>');

                  // 更新图片ID数组
                  opt.attachmentIds.getId().push(rs.root.id);
                  th.attr('data-ids', opt.attachmentIds.getId());

                  //拖拽、删除、编辑名称等
                  bindFileOptions(th,callback);

                  //回调
                  callback(opt.attachmentIds.getId());

                } else {
                  $('.file-'+random+' em').html('上传失败');
                  $('.file-'+random+' span.fr').html('<i class="fa fa-times-circle-o del" alt="删除" title="删除"></i>');
                }
                $('.file-'+random+' span.fr .del').click(function (){
                  $(this).parents('p').remove();
                });
              })
            } else{
              th.append('<p><i class="fa fa-file-o"></i> '+img_name+' <span class="fr">上传失败，不允许的文件格式</span></p>');
            }
          } else{
            th.append('<p><i class="fa fa-paperclip"></i> '+img_name+' <span class="fr">上传失败，文件太大（建议'+GLOBAL.AttachmentSize+'M以内）</span></p>');
          }
        } else{
          if (img_size < 1024*1024*GLOBAL.ImageNumber){
            if (filterPicType(img_name)){ //图片不能超过6M
              var random = '';
              for(var n=0;n<10;n++){ random += Math.floor(Math.random()*10); }

              var reader = new FileReader();  // HTML5定义了FileReader作为文件API的重要成员用于读取文件，根据W3C的定义，FileReader接口提供了读取文件的方法和包含读取结果的事件模型。
              reader.readAsDataURL(files[i]); //将文件读取为DataURL, 可以在reader.onload 以evt.target.result  返回data: ...  图片src
                
              reader.onload = function(evt){  //文件读取成功完成时触发
                // console.log(evt);
                if (i>(GLOBAL.ImageNumber-1)){
                    layer.msg('最多上传'+GLOBAL.ImageNumber+'张照片');
                    return false;
                }
                if(th.children().length >= GLOBAL.ImageNumber){
                    layer.msg('最多上传'+GLOBAL.ImageNumber+'张照片');
                    return false;
                }

                th.removeClass('upload-file-bg');
                if(opt.isOnly){
                  th.html("<div class='upload-img' id='img-"+ random +"'>" +
                            "<div class='ui-image'><img src='"+ evt.target.result +"'  /></div>" +
                            "<div class='ui-progress'></div>" +
                          "</div> ");
                }else{
                  th.append("<div class='upload-img' id='img-"+random+"'>" +
                              "<div class='ui-image'><img src='"+ evt.target.result +"'  /></div>" +
                              "<div class='ui-progress'></div>" +
                            "</div> ");
                }

                // 上传参数
                var formData = new FormData();
                formData.append('file',files[i]);
                if (opt){var params = opt; for (k in params){formData.append(k, params[k]);}}

                // ajax调用
                ajax(formData, function (percent) {
                  if(percent == 100){
                    $('#img-'+random+' .ui-progress').html('正在处理');
                  }else{
                    $('#img-'+random+' .ui-progress').html(percent+'%');
                  }
                }, function (rs){
                  // console.log('图片返回结果', rs);
                  if(rs.success){
                    // 更新DOM
                    $('#img-'+random+' .ui-progress').html('上传完成');
                    $('#img-'+random).attr("data-value", rs.root.id);
                    $('#img-'+random+' .ui-image img').attr({'src':rs.root.thumbUrl,'layer-src':rs.root.url,'alt':rs.root.originalFileName,'title':rs.root.originalFileName});
                    $('#img-'+random+' .ui-progress').remove();
                    layer.photos({photos: '#img-'+random});
                    
                    th.find('#img-'+random).append("<div class='ui-opts' data-action='del' data-value='"+rs.root.id+"'><i class='fa fa-times-circle-o' alt='删除' title='删除'></i></div>");
                        // "<div class='ui-opts ui-opts-edit' data-action='edit' data-name='"+rs.root.originalFileName+"' data-value='"+rs.root.id+"'><i class='fa fa-pencil-square-o' alt='编辑名称' title='编辑名称'></i></div>");
                    
                    // 更新图片ID数组
                    opt.imageIds.getId().push(rs.root.id);
                    th.attr('data-ids', opt.imageIds.getId());

                    //拖拽、删除、编辑名称等
                    bindPicOptions(th,callback);

                    //回调
                    callback(opt.imageIds.getId());

                  }else{
                    $('#img-'+random+' .ui-progress').html('上传失败').addClass('ui-fail').removeClass('ui-progress');
                    th.find('#img-'+random).append("<div class='ui-opts' data-action='del'><i class='fa fa-times-circle-o' alt='删除' title='删除'></i></div>");
                    bindPicOptions(th,callback);
                  }
                });
                $('#img-'+random+' .upload-img').click(function(e){ return false; });
              };                          
            }else{
              layer.msg('不允许的图片格式');
            }
          }else{
            layer.msg('图片太大，不能超过'+GLOBAL.ImageNumber+'M');
          }
        }
      })(i);
    }
  }
}
//封装ajax
function ajax(formData, callback, results) {
  var xhr = new XMLHttpRequest();
  xhr.open(opt.method,opt.url);   //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
  xhr.onload = function (data) {  //请求完成
    var isComplate = true;
  };

  if ('onprogress' in xhr.upload) {
    xhr.upload.onprogress = function (e) {  //xhr.upload.onprogress时间模拟进度条
      if(e.lengthComputable){
        var percent =(e.loaded / e.total *100|0);   //e.loaded 表示当前加载了多大； e.total 表示总共有多大
        callback(percent);
      }
    };
  } else {
    layer.msg("upload progress event not supported");      
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var response = JSON.parse(xhr.response);
        results(response);
      }
    }
  };

  xhr.send(formData); //开始上传，发送formData数据
};
//文件绑定操作
function bindFileOptions(th, callback){
  //删除
  th.find('.del').click(function(ev){

    var $del = $(this);
    if (typeof $del.attr('id') != 'undefined'){
      var id = $del.attr('id');
      var newArrIds = [];
      for (j=0; j< opt.attachmentIds.getId().length; j++){
        if (opt.attachmentIds.getId()[j] != id){
          newArrIds.push(opt.attachmentIds.getId()[j]);
        }
      }
      if (newArrIds.length == 0 ) init(th,JSON.parse(th.attr('data-opt')));    //初始化
      opt.attachmentIds.setId(newArrIds);
      th.attr('data-ids', opt.attachmentIds.getId());

      callback(opt.attachmentIds.getId());
      $del.parents('p').remove();
    }
  });
  //编辑
  // th.find('.edit').click(function(ev){     
  //   layer.open({
  //     title: "<span class='layer_title'><i class='fa fa-plus-circle'></i><strong>" + title + "</strong></span>",
  //       type: 1,
  //       area:  '600px',
  //       content: ele,
  //       offset: '60px',
  //       shade:  [0.5, '#000000'],
  //       shift: 0,
  //       success: function(layero, index){
  //     layerCallback(layero);
  //     if (fn) { fn(); }
  //   }
  //   });


  //   $("body").append(moban);
  //   $(".modal").last().attr("id", 'myAttachmentsEditDisplayName');
  //   $("#myAttachmentsEditDisplayName").modal({
  //     show: true,
  //     // show: false,
  //     backdrop: true,
  //     keyboard: false,
  //     remote: 'tpl/popup.html #aaa'
  //   })
  //   $("#myAttachmentsEditDisplayName").on('shown.bs.modal', function(){
  //     modalExpand(this);
  //   })
  //   $("#myAttachmentsEditDisplayName").on('hidden.bs.modal', function(){
  //     $("#myAttachmentsEditDisplayName").remove();
  //   })
  // });
  return false;
}
//图片绑定操作
function bindPicOptions(th,callback) {
  //删除、编辑小图标事件
  $('.upload-img .ui-opts').off().on('click', function(){
    var $$this = $(this);
    if($$this.attr('data-action') == 'del'){
      if (typeof $$this.attr("data-value") != 'undefined'){
        var id = $$this.attr("data-value");
        var newArrayValue = [];
        for (j=0; j<opt.imageIds.getId().length; j++){
          if (opt.imageIds.getId()[j] != id){
            newArrayValue.push(opt.imageIds.getId()[j]);
          }
        }
        if (newArrayValue.length == 0 ) init(th, JSON.parse(th.attr('data-opt')));    //初始化
        opt.imageIds.setId(newArrayValue);
        th.attr('data-ids', opt.imageIds.getId());

        callback(opt.imageIds.getId());
      }
      $$this.parent().remove();
    } else if($$this.attr('data-action') == 'edit'){
      $("body").append(moban);
      $(".modal").last().attr("id", 'myPictureEditDisplayName');
      $("#myPictureEditDisplayName").modal({
        show: true,
        // show: false,
        backdrop: true,
        keyboard: false,
        remote: 'tpl/popup.html #bbb'
      })
      $("#myPictureEditDisplayName").on('shown.bs.modal', function(){
        modalExpand(this);
      })
      $("#myPictureEditDisplayName").on('hidden.bs.modal', function(){
        $("#myPictureEditDisplayName").remove();
      })
    }
    return false;
  });
  //拖放图片换位
  if ($(".upload-img").length >1){
    for (var i=0; i<$(".upload-img").length; i++){
      $(".upload-img").eq(i).get(0).ondragstart = function(e){
        e.dataTransfer.setData('name', $(this).index());
      }
    }
    for (var j=0; j<$(".upload-img").length; j++){
      $(".upload-img").eq(j).get(0).ondragover = function(e){ e.preventDefault(); }
      $(".upload-img").eq(j).get(0).ondrop = function(e){
        var index_drag = parseInt(e.dataTransfer.getData('name'));
        var index_target = parseInt($(this).index());

        var img_drag = $(".upload-img").eq(index_drag);
        var img_target = $(".upload-img").eq(index_target);
        var img_fu = $(".upload-img").parent();

        if (index_drag != index_target){
          if (index_drag == $(".upload-img").length - 1){
            img_drag.insertBefore(img_target);
            img_fu.append(img_target);

          } else if (index_drag < $(".upload-img").length - 1){
            var index_dragNext = index_drag + 1;
            var img_dragNext = $(".upload-img").eq(index_dragNext);
            if (index_dragNext == index_target){
              img_target.insertBefore(img_drag);
            } else{
              img_drag.insertBefore(img_target);
              img_target.insertBefore(img_dragNext);
            }
          }
        }
        var newArrayValue = [];
        for (var k=0; k<$(".upload-img").length; k++){
            newArrayValue.push(parseInt($(".upload-img").eq(k).attr("data-value")));    
        }
        opt.imageIds.setId(newArrayValue);
        th.attr('data-ids', opt.imageIds.getId());
        callback(opt.imageIds.getId());
      }
    }
  }
};

//删除所有图片后 初始化
function init(th,config){
  if(config.isFujian){
    f_flag = true;
  } else{
    flag = true;
    th.addClass('upload-file-bg');
  }
};




})

// 过滤文件格式
function filterFileType(str){
  var noAllow = ['app','bat','cmd','com','cpl','dll','exe','hta','sys','htt','inf','jse','msi','msp','mst','pif','prf','prg','reg','scf','scr','sct','shb','shs','url','vbe','vbs','vsmacros','ws','wsc','wsf','wsh'];
  var arr = str.split('.');

  if(arr.length > 1){
    for(var i=0; i<noAllow.length; i++){
      if(noAllow[i] == (arr[arr.length-1]).toLowerCase()){
        return false;
      }
    }
  }
  return true;
};
// 过滤图片格式
function filterPicType(str){
  var allow = ['jpeg', 'jpg', 'bmp', 'gif', 'png'];
  var arr = str.split('.');
  
  if (arr.length > 1){
    var arrLast = (arr[arr.length-1]).toLowerCase();

    if (allow.indexOf(arrLast) > -1){
      return true;
    }
  }

  return false;
};