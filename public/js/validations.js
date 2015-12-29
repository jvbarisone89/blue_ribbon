$(document).ready(function(){

	$.validator.addMethod( 'costPositive', function (value, element) {
	  return this.optional(element) || value > 0;
	}, jQuery.validator.format("Please enter a number greater than 0."));
	// New Bank Validations
	$('#newBankForm').validate({
		rules: {
			name: {
				required: true,
				maxlength: 25
			},
			cost: {
				required: true,
				maxlength: 12,
				costPositive: true
			}
		},
		messages: {
			name: {
				required:"Please enter in the name of an item you are saving for.",
				maxlength: "Please shorten the item name! This one is too long."
			},
			cost: {
				required: "Please enter the price of the item you are saving for.",
				maxlength: "Sorry, that price is too high! Please enter a smaller number."
			}
		}
	});

});