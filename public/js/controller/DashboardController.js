(function(){
    'use strict';
    
    app.controller('DashboardController',  ['$state',
                                            '$scope',
                                            'Authentication',
                                            '$http',
                                            '$uibModal',
                                            '$timeout',
                                            dashboardControllerMethod
                                        ]
                   );
    
    app.controller('infoUpdate', ['$uibModalInstance','info','$http',infoUpdateControllerMethod]);
    
    function dashboardControllerMethod($state,$scope,Authentication,$http,$uibModal,$timeout) {
        var dc = this ;
        dc.ResponseMessage = true ;
        
        /**
         *  Logout action performed here
         **/
        if (Authentication.getData() !== 'null') {
			dc.logOut = function(){
                Authentication.clearAll();
                $http.get("/logout").success(function(res){
                    console.log("user logout successfully",res);
                }).error(function(err){
                    console.log("Error occured", err);
                });
                $state.go('login');
            }
            
            dc.getAdminUser = function(){
                $http.get('/getUserListing')
                .success(function(response){
                    if (response.length) {
                        dc.userData = response ;
                    }
                }).error(function(Error){
                    console.log(Error);
                });
            }
            
            dc.updateDetails = function(data){
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'js/template/modelTemplate/Update-details.html',
                    controller: 'infoUpdate',
                    controllerAs : 'IU',
                    resolve: {
                        info: function () {
                          return data;
                        }
                    }
                });
                
                modalInstance.result.then(function (selectedItem) {
                        dc.updateStatus = selectedItem;
                        dc.ResponseMessage = false ;
                        $timeout(function(){
                            dc.updateStatus = '';
                            dc.ResponseMessage = true ;
                        },3000);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                });
            }
            
            dc.DeleteUser = function(data){
                console.log("going to delte user",data.id);
                $http.post('/deleteUser',{'id':data.id}).success(function(response){
                    dc.userData.splice(dc.userData.indexOf(data),1);
                    dc.updateStatus = response;
                    dc.ResponseMessage = false ;
                    $timeout(function(){
                        dc.updateStatus = '';
                        dc.ResponseMessage = true ;
                    },3000);
                }).error(function(error){
                    dc.updateStatus = error;
                    dc.ResponseMessage = false ;
                    $timeout(function(){
                        dc.updateStatus = '';
                        dc.ResponseMessage = true ;
                    },3000);
                });
            }
            
        }else{
              $state.go('login');
        }
    }
    
    function infoUpdateControllerMethod($uibModalInstance,info, $http) {
        var IFC = this ;
        IFC.updateData = info ;
        
        IFC.ok = function () {
            $http.post('/updateUser',IFC.updateData).success(function(response){
                if (response.status == 200) {
                    $uibModalInstance.close(response);
                }
            }).error(function(error){
                console.log("Error occured", error)
                $uibModalInstance.close(error);
            });
        };
        
        IFC.cancel = function () {
            console.log("cancel trigger");
            $uibModalInstance.dismiss('cancel');
        };
    }

}());
