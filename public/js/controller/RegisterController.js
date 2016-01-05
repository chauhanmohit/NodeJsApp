(function(){
    'use strict';
    app
        .controller('RegisterController', ['$state','$http','$timeout','Authentication',controllerMethod]);
        
        function controllerMethod($state,$http,$timeout,Authentication) {
            var vm = this ;
            vm.ResponseMessage = true ;
            
            vm.registerUser = function(){
                var data = {
                    "email" : vm.registerData.email,
                    "password" : vm.registerData.password,
                }
                $http.post('/register',data).success(function(res){
                    Authentication.setData(res);
                    $state.go('dashboard');
                    if (res.status == 200) {
                        vm.message = res.message ;
                        vm.messageClass = 'success' ;
                        $timeout(function(){
                            vm.message = '' ;
                            vm.messageClass = '' ;
                        },3000);
                    }
                }).error(function(err){
                    if (err) {
                        vm.updateStatus = err;
                        vm.ResponseMessage = false ;
                        $timeout(function(){
                            vm.updateStatus = '';
                            vm.ResponseMessage = true ;
                        },3000);
                    }
                });
            }
        }
}());
