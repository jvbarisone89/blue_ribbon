$(document).ready(function(){

var addprogressmodal = "<div class='modal fade' id='basicModal' tabindex='-1' role='dialog' aria-labelledby='basicModal' aria-hidden='true'><form id='addProgress-form'><div class='modal-dialog form-group'><div class='modal-content'><div class='modal-header'><input type='hidden' class='bankId'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>Add Cash</h4><input type='text' id='cashValue' class='form-control' aria-label='Amount (to the nearest dollar)' placeholder='0$'></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' class='btn btn-primary cashSubmit'>Save</button></div></div></div></form></div>";

	//Create New Bank
	$("#newBankForm").on("submit", function(e){
		var isvalidate = $("#newBankForm").valid();
		if(isvalidate) {
		e.preventDefault();
		var data = $(this).serialize();
    $.post("/api/banks", data, function(data) {
    	console.log("This is the DATA" + data);
    	var name = data.name;
    	var cost = data.cost;
    	$(".bankList").append("<li id ='" + data._id + "' class='bank-li'><div class ='well bank-list-wrapper'><i class='ion-close-round pull-right delete'></i><h4>Item: " + data.name + "</h4><h4>Price: $" + data.cost + "</h4><h4>Cash Added: $<span id='CashId" + data._id + "'>" + data.cash_added + "</span></h4><div class = 'bankDetails'><div class='progress'><div id = 'ProgressId" + data._id + "'class='progress-bar' role='progressbar' style='width:0'></div></div><a href='#' class='btn primary' data-toggle='modal' data-target='#basicModal'><i class='ion ion-plus-circled' style='font-size: 40px'></i></a>" + addprogressmodal + "</div></div></li>");
    	$('#newBankForm')[0].reset();
    	$("#banksDiv").scrollTop($("#banksDiv")[0].scrollHeight);
    	});
    }
	});
	//Add Cash to Bank
	$('.bankList').on('click', '.btn', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		// console.log(bankId);
		$('.bankId').val(bankId);
		// console.log($('.bankId').val());
	});
	//Add Cash Modal Submit
	$('.form-group').on('click', '.cashSubmit', function(e) {
		e.preventDefault();
		var cash_added = $('#cashValue').val();
		console.log(cash_added);
		var bankId = $('.bankId').val();
		console.log(bankId);
	//Server Request to add Cash
	$.ajax({
	    url: '/api/banks/' + bankId, 
	    type: 'Put',
	    data: {cash_added: cash_added}, 		
	    dataType: 'json'
		}).done(function(bank) {
			console.log(bank);
			//Change Cash Added value
			cashUpdate(bank._id, cash_added);
			progressUpdate(bank._id, bank.cost, bank.cash_added);
		  // progressUpdate(bank.progress_added, bank.price, bank._id);
		  $('#addProgress-form')[0].reset();
		})
		  	.fail(function() {
		  	alert( "error" );
		});
	});
	//Update cash added
	var cashUpdate = function(bankId, cash_added){
		var currentCashValue = parseInt($("#CashId" + bankId).text());
		var cashToAdd = parseInt(cash_added);
		var newValue = currentCashValue + cashToAdd;
		$("#CashId" + bankId).text(newValue);
	};
	//Update progress bar
	var progressUpdate = function(bank_id, cost, cash_added){
		var progressBar = $('#ProgressId' + bank_id);
		var itemCost = parseInt(cost);
		var totalAdded = parseInt(cash_added);
		var newProgressValue = totalAdded/itemCost*100;
		progressBar.css('width', newProgressValue+'%').attr('aria-valuenow', newProgressValue);   
	};
	// //Server Request to add Comment 
	// 	$.ajax({
	// 	    url: '/api/banks/' + bankId + '/comments', 
	// 	    type: 'Post',
	// 	    data: {text: comment}, 		
	// 	    dataType: 'json'
	// 		}).done(function(newComment) {
	// 			$('#addProgress-form')[0].reset();
	// 			$(".comments-bank").append('<p>'+ comment + '</p>');
	// 		})
	// 		  	.fail(function() {
	// 		  	alert( "Error" );
	// 	});
//Delete Bank Function
	$('.bankList').on('click', '.delete', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		var bank = $(this).closest('li');
//Server delete request
	$.ajax({
        type: "delete",
        url: '/api/banks/' + bankId
      	})
      	.done(function(data) {
        	$(bank).remove();
      	})
      	.fail(function(data) {
        	console.log("Failed to terminate bank.");
		});
	});
//Edit Item Name 
$('.bankList').on('click', 'h4', function() {
	console.log('I was clicked');
		var bank_form = $(this).siblings('.item-update-form');
		bank_form.toggle();
		// $('.item-update-form').toggle();
		var bankId = $(this).closest('li').attr('id');
		$('.bankId').val(bankId);
 });

//Submit New Item Name to DOM
	$('.bankList').on('click', '.itemUpdateSubmit', function(e){
		e.preventDefault();
		console.log("I was clicked");
		var previousName = $(this).closest('li').find('h4').text();
		var newItemName = $('.item-update-field').val();
		var bankId = $('.bankId').val();
		var input = $(this);
		console.log(newItemName);

		if (newItemName === '' || null){
	 	alert('Name input is empty');
		} else {
		$.ajax({
	        type: "PUT",
	        url: '/api/banks/' + bankId,
	        data: {itemName: newItemName},
	        dataType: 'json'
	      	})
	      	.done(function(data) {
	      		console.log(data);
	      		input.siblings().val("");
	      		input.closest('li').find('h4').text(newItemName);
      	})
      	.fail(function(data) {
        	console.log("Failed to update bank.");
			});
		} 		
	});
	//Display Comments 
	$('.show-comments').on('click', function(){
		var id = $(this).data('bank-id');
		$('#comment-bank-' + id).toggle();
	});
}); 
