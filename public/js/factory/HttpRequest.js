(function(){
    'use strict';
    app.factory('HttpRequest',function apiRequestMethod($http,$q) {
        var apiRequestDefer = $q.defer();
        return {        
            login : function signIn(apiParams){
                apiRequestDefer.resolve();
                apiRequestDefer = $q.defer();
                var params = {
                    params: apiParams,
                    timeout: apiRequestDefer.promise
                };
                $http.post('/login',params).then(function(result){
                    if (result.status == 200) {
                       // if (result.data.message.message.message == 'User authenticated successfully') {
                            //Authentication.setData(result.data.message.message);
                            apiRequestDefer.resolve(result)  ; 
                        //}
                    }
                },function(error){
                    return apiRequestDefer.reject(error) ;  
                });
                return apiRequestDefer.promise;
            },
            register : function(apiParams){
                apiRequestDefer.resolve();
                apiRequestDefer = $q.defer();
                var params = {
                    params: apiParams,
                    timeout: apiRequestDefer.promise
                };
                $http.post('/register',params).then(function(result){
                    if (result.status == 200) {
                        //if (result.data.message.message.message == 'User Re successfully') {
                            //Authentication.setData(result.data.message.message);
                            apiRequestDefer.resolve(result)  ; 
                        //}
                    }
                },function(error){
                    return apiRequestDefer.reject(error) ;  
                });
                return apiRequestDefer.promise;
            },
            logout : function signOut(){  
                //Authentication.clearAll();
            },
            getApikey : function(){
                return $http.get('/now_what/getMailChimpkey',
                        {params: {}, cache: true}).then(function(result){
                    return result.data;
                },function(error){
                    return error
                });
            }
        }
    });
}());

