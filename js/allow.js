/**
 * 
 * @authors Chaoyang Zhu (zcy_2013@163.com)
 * @date    2017-02-21 10:00:00
 * @tel 	15903620494
 */

define([], function(){
	var fn = {
		// managerTypeAllow: function(){
		// 	if(GLOBAL._managerType == 'Standalone'){ $(".userListAdd").show(); } else { $(".userListAdd").hide(); }
		// },
		userDAllow: function(data){
			if ( data.root.allowActions.indexOf("SetUnverified")> -1 ) { $(".userD_setUnVerifiedBtn").show(0); 	} else { $(".userD_setUnVerifiedBtn").hide(0); }
			if ( data.root.allowActions.indexOf("SetVerified")	> -1 ) { $(".userD_setVerifiedBtn").show(0); 	} else { $(".userD_setVerifiedBtn").hide(0); }
			if ( data.root.allowActions.indexOf("CancelPro") 	> -1 ) { $(".userD_cancelProBtn").show(0); 		} else { $(".userD_cancelProBtn").hide(0); }
			if ( data.root.allowActions.indexOf("AddProMonth") 	> -1 ) { $(".userD_addProMonthBtn").show(0); 	} else { $(".userD_addProMonthBtn").hide(0); }
			if ( data.root.allowActions.indexOf("AddProMonth") 	> -1 ) { $(".userD_addProDayBtn").show(0); 		} else { $(".userD_addProDayBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Disable") 		> -1 ) { $(".userD_disabledBtn").show(0); 		} else { $(".userD_disabledBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Enable") 		> -1 ) { $(".userD_enableBtn").show(0); 		} else { $(".userD_enableBtn").hide(0); }
			$(".userD_resetPwdBtn").show();
			$(".userD_createOrderBtn").show();
			$(".userD_commentBtn").show();
			$(".userD_resetPhoneBtn").show();
		},
		userQDAllow: function(data){
			if ( data.root.allowActions.indexOf("Modify") 		> -1 ) { $(".userQD_editBtn").show(0); 	} else { $(".userQD_editBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Delete") 		> -1 ) { $(".userQD_delBtn").show(0); 	} else { $(".userQD_delBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Answer") 		> -1 ) { $(".userQD_answerBtn").show(0); 	} else { $(".userQD_answerBtn").hide(0); }
		},
		companyDAllow: function(data){
			if ( data.root.allowActions.indexOf("Approve") 		> -1 ) { $(".companyD_approveBtn").show(0); } else { $(".companyD_approveBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Reject") 		> -1 ) { $(".companyD_rejectBtn").show(0); 	} else { $(".companyD_rejectBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Close") 		> -1 ) { $(".companyD_closeBtn").show(0); 	} else { $(".companyD_closeBtn").hide(0); }
		},
		projectDAllow: function(data){
			if ( data.root.allowActions.indexOf("CancelPro")	> -1 ) { $(".projectD_cancelProBtn").show(0); 	} else { $(".projectD_cancelProBtn").hide(0); }
			if ( data.root.allowActions.indexOf("AddProMonth")	> -1 ) { $(".projectD_addProMonthBtn").show(0); } else { $(".projectD_addProMonthBtn").hide(0); }
			if ( data.root.allowActions.indexOf("AddProMonth")	> -1 ) { $(".projectD_addProDayBtn").show(0); 	} else { $(".projectD_addProDayBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Disable") 		> -1 ) { $(".projectD_disabledBtn").show(0); 	} else { $(".projectD_disabledBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Enable") 		> -1 ) { $(".projectD_enableBtn").show(0); 		} else { $(".projectD_enableBtn").hide(0); }

			if ( data.root.allowActions.indexOf("Enable") 		> -1 ) { $(".projectD_ownerBtn").show(0); 		} else { $(".projectD_ownerBtn").show(0); }
			$('.projectD_commentBtn').show();
		},
		orderDAllow: function(data){
			if ( data.root.allowActions.indexOf("Refund") 		> -1 ) { $(".orderD_refundbtn").show(); 		} else { $(".orderD_refundbtn").hide(); }
			if (data.root.state == 'Success'){
				if (data.root.invoiced == false){
					$(".orderD_invoiceTruebtn").show(0);
					$(".orderD_invoiceFalsebtn").hide(0);
				} else if(data.root.invoiced == true){
					$(".orderD_invoiceTruebtn").hide(0);
					$(".orderD_invoiceFalsebtn").show(0);
				}
			}
			if (data.root.payType == "Offline"){
				$(".orderD_offlineNotifybtn").show(0);
			} else{
				$(".orderD_offlineNotifybtn").hide(0);
			}
			if (data.root.state == 'Success' && data.root.invoiced == false){
				$(".orderD_reqInvoicebtn").show(0);
			} else{
				$(".orderD_reqInvoicebtn").hide(0);
			}

		},
		customerDAllow: function(data){
			$(".customerD_commentBtn").show();
		},
		adminDAllow: function(data){
			if ( data.root.allowActions.indexOf("Disable")	> -1 ) { $(".adminD_disabledBtn").show(0); 	} else { $(".adminD_disabledBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Enable")	> -1 ) { $(".adminD_enableBtn").show(0); 	} else { $(".adminD_enableBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Modify") 	> -1 ) { $(".adminD_editBtn").show(0); 		} else { $(".adminD_editBtn").hide(0); }
		},
		appDAllow: function(data){
			if ( data.root.allowActions.indexOf("Modify") 		> -1 ) { $(".appD_editBtn").show(0); 	} else { $(".appD_editBtn").hide(0); }
			if ( data.root.allowActions.indexOf("Delete") 		> -1 ) { $(".appD_delBtn").show(0); 	} else { $(".appD_delBtn").hide(0); }			
		}
	}


	return{
		fn: fn
	}
})
