$(document).ready(function(){

	//Create New Bank
	$('#new-bank-form').on('submit', function(e){
		e.preventDefault();
		var date = new Date().toDateString();
		//Serialize form data
		var formData = $(this).serialize() + "&date=" + date;
  		// url, data, callback
        $.post('/api/banks', formData, function(data) {
          //New Bank Div
	      var bank = "<li id = " + data._id + ">" +
	                    "<div class ='well bank-list-wrapper'>" +
	                        "<h4>" + data.itemName + "</h4>" + "<span class='glyphicon glyphicon-pencil'></span>" +
	                        "<p class='pull-right'>" + "Date Created: " + date + "</p>" +
	                        "<div class = 'bank details'>" +
	                            "<a href='#' class='btn primary' data-toggle='modal' data-target='.bs-example-modal-sm'>" +
	                            "<img src = '/img/capPoint.png'/>" +
	                            "</a>" +
	                            "<h5>Add Cash!</h5>" +
	                            "<div class='progress'>" +
	                                "<div class='progress-bar' style='width:" + data.progress + "%'  aria-valuenow='0'  aria-valuemin='0' aria-valuemax='100'>" + 
	                                '$' + data.cash_added + '/' + "<span class='item_price'>" + data.price + "</div>" +
	                            "</div>" +
	                            "<a href='#' class='btn delete' data-id =" + data._id + ">Delete bank...</a>" +
	                        "</div>" +
	                    "</div>" +
	                "</li>";

	      //Append new bank to page
          $('.bank-list').append(bank);

          });

	    });

	//Add Money to Bank
	$('.bank-list-wrapper').on('click', 'img', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		$('.bankId').val(bankId);
	});
	
	//Add Money Modal Submit
	$('.cash-submit').on('click', function(e) {
		//input value of how much user is entering into database
		var cash_added = $('#cashValue').val();
		//item cost - for updating the progress bar value
		var item_cost = $('.item_price').html();
		var progress = (cash_added/item_cost)*100;
		$('#addCash-form')[0].reset();
		var bankId = $('.bankId').val();

	//Server Request
		$.ajax({
		    url: '/api/banks/' + bankId, 
		    type: 'PUT',
		    data: {cash_added: cash_added,
		    	  progress: progress}, 		
		    dataType: 'json'
			}).done(function(bank) {
			  $('#addCash-form')[0].reset();
			  updateBar(bank.cash_added, bank.price);
			})
			  .fail(function() {
			  alert( "error" );
			});
		});

	//Delete Bank Function
	$('.bank-list').on('click', '.delete', function(e){
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

	//Edit Item Name & Item Cost

	//Update Progress bar function	
	var updateBar = function(cash_added, item_cost){
		//Remove current progress value from progress bar
		$( ".progress-bar" ).removeAttr( "style" );
		//set the new value to the cash added divided by the item cost
		var percentValue = (cash_added/item_cost) * 100;
		//create the string for the new style value
		var newProgressValue = 'width:' + percentValue + '%';
		//Set the progress bar style to the new value
		$(".progress-bar").attr("style", newProgressValue);
	};

	//Update progress bar value in server
	
	//User sign up

	//User Login

	//User Logout


}); 
