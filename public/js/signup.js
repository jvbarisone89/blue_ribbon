$(document).ready(function(){

	function checkAuth(){
		$.get('/current-user', function(data){
			console.log(data);
			if (data.user){	
				$('.sign-up').hide();
				$('.log-out').show();
			} else {
				$('.sign-up').show();
				$('.log-out').hide();			}
			});
		}

	checkAuth();

	//Sign Up
	$('#signup-form').on('submit', function(e){
		e.preventDefault();
		var user = ($(this).serialize());

		$.post('/users', user, function(data){
		console.log(data);
		window.location.href='/home';
		});
	});

	//Logout
	$('#logout').on('click', function(e){
		e.preventDefault();

		$.get('/logout', function(data){
		console.log(data.msg);
		window.location.href ='/login';
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

});

