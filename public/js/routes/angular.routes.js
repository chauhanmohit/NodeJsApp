app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('login', {
		  url: '/login',
		  templateUrl: 'js/template/login/login-tmpl.html',
		  controller: 'LoginController',
		  controllerAs: 'LC',
		})
		
		.state('register', {
		  url: '/register',
		  templateUrl: 'js/template/login/register-tmpl.html',
		  controller: 'RegisterController',
		  controllerAs: 'RC',
		})
	  
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'js/template/dashboard/dashboard-tmpl.html',
			controller: 'DashboardController',
			controllerAs: 'Dashboard',
		})
		.state('404', {
			templateUrl: 'js/error/error-page-tmpl.html',
			controller: 'ErrorPageController',
			controllerAs: 'error',
			resolve: {
			  code: function () {
				return 404;
			  }
			}
		});
		$urlRouterProvider
		  .when('', '/login')
		  .when('/', '/login')
		  .otherwise(function ($injector) {
			$injector.get('$state').go('404');
		});
});