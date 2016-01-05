(function(){
    'use strict';
     app.factory('UserListing', function($q, $http){
        return {
            getdata: function(){
                return $http.get('/now_what/getUserInfo',
                        {params: {}, cache: false}).then(function(result){
                    return result.data;
                });
            },
           
            getAdminDetail:function(){
                return $http.get('/now_what/getAdminDetail',
                        {params: {}, cache: true}).then(function(result){
                    return result.data;
                });
            },
            deleteUser:function(id){
                return $http.post('/now_what/deleteUserInfo/'+id,
                        {params: {}, cache: true}).then(function(result){
                    return result.data;
                });
            },
            getUser:function(id){
                return $http.get('/now_what/getUserData/'+id,
                        {params: {}, cache: false}).then(function(result){
                    return result.data;
                });
            },
            updateUser:function(data){
                return $http.post('/now_what/updateuserData/',
                        {params: {}, data:data ,cache: false}).then(function(result){
                    return result.data;
                });
            }
        };
    });
}());