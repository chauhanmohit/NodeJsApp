(function(){
    'use strict';
    
    app.
        controller('LoginController',['$http','$state','$timeout','Authentication',loginControllerMethod]);
        
        function loginControllerMethod($http, $state,$timeout,Authentication) {
            var lc = this ;
            lc.ResponseMessage = true ;
            /**
             *  Login form submittion handel here
             **/
            lc.guestLogin = function(){
                $http.post('/login', lc.loginData).success(function(res){
                    if (res.status == 200) {
                        Authentication.setData(res);
                        $state.go('dashboard');
                        }
                }).error(function(err){
                    if (err) {
                        lc.updateStatus = err;
                        lc.ResponseMessage = false ;
                        $timeout(function(){
                            lc.updateStatus = '';
                            lc.ResponseMessage = true ;
                        },3000);
                    }
                });
            }
        }
}());

