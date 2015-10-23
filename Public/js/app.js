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
	                        "<h4><span class='glyphicon glyphicon-pencil'>" + data.itemName + "</span></h4>" +
	                        "<p class='pull-right'>" + "Date Created: " + date + "</p>" +
	                        "<div class = 'bank details'>" +
	                            "<a href='#' class='btn primary' data-toggle='modal' data-target='.bs-example-modal-sm'>" +
	                            "<img src = '/img/capPoint.png'/>" +
	                            "</a>" +
	                            "<h5>Add Cash!</h5>" +
	                            "<div class='progress'>" +
	                                "<div class='bar' style='width: 50%'>" + '$0/' + data.price + "</div>" +
	                            "</div>" +
	                            "<a href='#' class='btn delete'>Delete bank...</a>" +
	                        "</div>" +
	                    "</div>" +
	                "</li>";

          $('.bank-list').append(bank);
          });
	    });

	//Add Money to Bank
	$('.bank-list').on('click', 'img', function(e){
		e.preventDefault();
		var bankId = $(this).closest('li').attr('id');
		console.log(bankId);
		$('#bankId').val(bankId);
	});
	
	//Add Money Modal Submit
	$('#cash-submit').on('click', function(e) {
		var cashAdded = $('#cashValue').val();
		var bankId = $('#bankId').val();

	//Server Request
		$.ajax({
		    url: '/api/banks/' + bankId, 
		    type: 'PUT',
		    data: {cashAdded: cashAdded},
		    dataType: 'json'
			}).done(function(data) {
				console.log(data);
			  alert( "success" );
			})
			  .fail(function() {
			  alert( "error" );
			});
		});

	//Delete Bank Function
	$('.bank-list').on('click', '.delete', function(e){
		e.preventDefault();
		// console.log('I was clicked');
		// alert('Are you sure?');
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


	//Server Delete Bank Request


	//Post request to send amount into server for bank with that ID







	//Update Progress bar function







	//Edit Properties of Bank



}); 
