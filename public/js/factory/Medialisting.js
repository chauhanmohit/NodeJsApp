(function(){
    'use strict';
     app.factory('MediaListing', function($q, $http){
        return {
            saveMsg:function(data){
                console.log("data", data);
                return $http.post('/now_what/saveContentData/',
                        {params: {}, data:data ,cache: false}).then(function(result){
                    return result.data;
                },function(error){
                    return error;
                });
            },
            getPageData: function(){
                return $http.get('/now_what/getPageTemplateContent/').then(function(result){
                    return result;
                },function(error){
                    return error ;
                });
            }
            
        };
    });
}());