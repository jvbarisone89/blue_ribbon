$(document).ready(function(){

	function checkAuth(){
		$.get('/current-user', function(data){
			console.log(data);
			if (data){	
				$('.log-in').hide();
				$('.sign-up').hide();
				$('.log-out').show();
			} else {
				$('.log-in').show();	
				$('.sign-up').show();
				$('.log-out').hide();	
			}
		});
	}

	checkAuth();

	$('#login-form').validate();

	//Sign Up
	$('#signup-form').on('submit', function(e){
		e.preventDefault();
		var user = ($(this).serialize());
		$.post('/users', user, function(new_user){
			var current_user = new_user;
			console.log(current_user);
			window.location.href='/home';
		});
	});

	//Login
	$('#login-form').on('submit', function(e){
		e.preventDefault();
		var login = $(this).serialize();
		$.post('/login', login, function(data){
			window.location.href ='/home';
		});
	});

	//Logout
	$('#logout').on("click", function(e){
		e.preventDefault();
		// console.log('logout button is listening');
		$.get('/logout', function(data){
			console.log(data.msg);
		});
	});

});

