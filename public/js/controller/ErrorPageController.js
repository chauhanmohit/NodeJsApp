(function(){
	'use strict';
	app.controller('ErrorPageController', function(code){
		var vm = this;
		vm.code = code;
		switch (vm.code) {
            case 404 :
				vm.errorMessage = "Page Not found " ;
			break;
			
			case 500 :
				vm.errorMessage = "Internal server Occured" ;
			break;
		
			case 403 :
				vm.errorMessage = "Not Authorized to view this page" ;
			break;
		
			default :
				vm.errorMessage = "Un Exceptional error handeled" ;
			break;
        }
	});
})();