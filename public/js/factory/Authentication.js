(function(){
	'use strict';
	app.factory("Authentication", function($window, $rootScope) {
		angular.element($window).on('storage', function(event) {
			if (event.key === 'user') {
				$rootScope.$apply();
			}
		});
		return {
			setData: function(val) {
				console.log('val', val);
				$window.localStorage && $window.localStorage.setItem('user', JSON.stringify(val));
				return this;
			},
			getData: function() {
				return $window.localStorage && $window.localStorage.getItem('user');
			},
			clearAll: function() {
				$window.localStorage && $window.localStorage.setItem('user', null);
			}
		};
	});
}());


