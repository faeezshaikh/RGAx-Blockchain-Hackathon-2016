

// function setStatus(message) {
//   var status = document.getElementById("status");
//   status.innerHTML = message;
// };

// function refreshBalance() {
//   var meta = MetaCoin.deployed();

//   meta.getBalance.call(account, {from: account}).then(function(value) {
//     var balance_element = document.getElementById("balance");
//     balance_element.innerHTML = value.valueOf();
//   }).catch(function(e) {
//     console.log(e);
//     setStatus("Error getting balance; see log.");
//   });
// };

// function sendCoin() {
//   var meta = MetaCoin.deployed();

//   var amount = parseInt(document.getElementById("amount").value);
//   var receiver = document.getElementById("receiver").value;

//   setStatus("Initiating transaction... (please wait)");

//   meta.sendCoin(receiver, amount, {from: account}).then(function() {
//     setStatus("Transaction complete!");
//     refreshBalance();
//   }).catch(function(e) {
//     console.log(e);
//     setStatus("Error sending coin; see log.");
//   });
// };


 angular.module('myApp', ['ionic'])


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'BlockChainController'
  })

    .state('app.buy', {
      url: '/buy',
      views: {
        'menuContent': {
          templateUrl: 'templates/buy.html',
          controller: 'BlockChainController'
        }
      }
    })

    .state('app.escrow', {
      url: '/escrow',
      views: {
        'menuContent': {
          templateUrl: 'templates/escrow.html',
          controller: 'BlockChainController'
        }
      }
    })
    .state('app.policies', {
      url: '/policies',
      views: {
        'menuContent': {
          templateUrl: 'templates/market.html',
          controller: 'MarketPlaceController'
        }
      }
    })
  .state('app.policy', {
    url: '/policies/:policyId',
    views: {
      'menuContent': {
        templateUrl: 'templates/policy.html',
        controller: 'PolicyController'
       }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/buy');
})

.service("BlockChainService", function() {
    var policys = [];
    var ownerAccount;
    var escrowAccount;
    return {
      setPolicys : function(pol) {
        policys = pol;
      },
      getPolicys : function() {
        return policys;
      },
      setOwnerAccount : function(act) {
        ownerAccount = act;
      },
      getOwnerAccount : function() {
        return ownerAccount;
      },
      setEscrowAccount : function(act) {
        escrowAccount = act;
      },
      getEscrowAccount : function() {
        return escrowAccount;
      }
    }

})
.controller("MarketPlaceController", function($scope,BlockChainService) {
      function init() {
        $scope.policys = BlockChainService.getPolicys();
        console.log('Marketplace',$scope.policys);
      }
      init();
})

.controller("PolicyController", function($scope,BlockChainService,$stateParams,$ionicModal) {
      var policySelected = {};
      $scope.form = {'share' : 0};
      $scope.myCoverage = $scope.premiumRecvd = 0;



//////

///Move to service

  

//////

        function sendCoinToInvestor() {
            var meta = MetaCoin.deployed();

            var amount = parseInt($scope.premiumRecvd);
            // var amount = 10;
            console.log('Amount = ',amount);
            var receiver = BlockChainService.getOwnerAccount(); // for demo purposes the owner is also the investor
            var sender = BlockChainService.getEscrowAccount();

            // setStatus("Initiating transaction... (please wait)");

            meta.sendCoin(receiver, amount, {from: sender}).then(function() {
              // setStatus("Transaction complete!");
             // refreshBalance();
              //refreshEscrowBalance(receiver);
              return;
            }).catch(function(e) {
              console.log(e);
              // setStatus("Error sending coin; see log.");
            });
      };
         function getPolicyDetails(id,pols) {
            for(var i=0;i<pols.length;i++) {
              if(id == pols[i].id) {
                  policySelected = pols[i];
                return pols[i];
              }
            }
          }

      function init() {
        var pols = BlockChainService.getPolicys();
        console.log('PolicyController',$scope.policys);
         var policyId = $stateParams.policyId;
        $scope.policyDetails = getPolicyDetails(policyId,pols);
        console.log('PolicyController details',$scope.policyDetails);
      }
      init();

      $scope.onRangeChange1 = function() {
        $scope.myCoverage = $scope.form.share * (policySelected.total / 100);
        $scope.premiumRecvd = $scope.form.share * (policySelected.premium / 100);
      }


       function openModal() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
          $scope.finalSent = false;
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
        };

        $ionicModal.fromTemplateUrl('templates/modalPolicy.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

      $scope.invest = function() {
          openModal();
      }
      $scope.confirmInvest = function() {
        $scope.finalSent = true;
        sendCoinToInvestor();
      }
})
.controller("BlockChainController", function($scope, $ionicModal,$ionicScrollDelegate,$stateParams,$timeout,BlockChainService) {
          var accounts;
          var account;
          var escrowAccount;
          $scope.ownerBalance = "Fetching..";
          $scope.date = new Date().getTime();
          $scope.policys = [];

          $scope.refresh = function() {
            $scope.date = new Date().getTime();
            refreshEscrowBalance(escrowAccount);
          }

          $scope.refreshBalance = function() {
            refreshBalance();
          }
      function refreshEscrowBalance(account) {
          // return 300;
            var meta = MetaCoin.deployed();

            return meta.getBalance.call(account, {from: account}).then(function(value) {
                $timeout(function(){
                 $scope.escrowBalance = value.c[0];
                 console.log('Escrow Account',$scope.escrowBalance);
                },1000);
            }).catch(function(e) {
                console.log(e);
            });
        }
         function refreshBalance() {
            var meta = MetaCoin.deployed();

            meta.getBalance.call(account, {from: account}).then(function(value) {
                $timeout(function(){
                  $scope.ownerBalance = value.c[0];
                },1000);
            }).catch(function(e) {
                console.log(e);
                // setStatus("Error getting balance; see log.");
            });
        };

        function sendCoin() {
            var meta = MetaCoin.deployed();

            var amount = parseInt($scope.form.cost);
            // var amount = 10;
            console.log('Amount = ',amount);
            var receiver = escrowAccount ;

            // setStatus("Initiating transaction... (please wait)");

            meta.sendCoin(receiver, amount, {from: account}).then(function() {
              // setStatus("Transaction complete!");
              refreshBalance();
              refreshEscrowBalance(receiver);
              return;
            }).catch(function(e) {
              console.log(e);
              // setStatus("Error sending coin; see log.");
            });
          };


          function foo(){
            
            web3.eth.getAccounts(function(err, accs) {
              if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
              }

              if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
              }

              accounts = accs;
              // $scope.allAccounts = accs;
              account = accounts[0];

              $scope.ownerAccount = account;
              BlockChainService.setOwnerAccount(account);
              
              
             escrowAccount  = accounts[1];
             BlockChainService.setEscrowAccount(escrowAccount);

              refreshBalance();
              refreshEscrowBalance(escrowAccount);

            });

          }

       
        function init() {
        resetForm();
        foo();

        var pols = [{
          'id':1,
          'acerage':10000,
          'name': 'John Doe',
          'number':"34XSFF434345",
          'total':10000,
          'addr':'Maples, FL',
          'avlbl':7500,
          'crop':'Soy bean',
          'premium':200,
          'year':2017
        },
        {
          'id':2,
          'acerage':30000,
          'name': 'Mike Cox',
          'number':"656XSFF434345",
          'total':1000000,
          'addr':'Houston, TX',
          'avlbl':7500,
          'crop':'Oranges',
          'premium':4500,
          'year':2017
        },
        {
          'id':3,
          'acerage':45000,
          'name': 'Bruce Willis',
           'number':"756XSFF434345",
          'total':10000,
          'addr':'Miami, FL',
          'avlbl':4500,
          'crop':'Grapes',
          'premium':300,
          'year':2017
        },
        {
          'id':4,
          'acerage':76000,
          'name': 'Jay Sprague',
           'number':"982SDSFF434345",
          'total':10000,
          'addr':'Chicago, IL',
          'avlbl':7500,
          'crop':'Oranges',
          'premium':500,
          'year':2017
        },
        {
          'id':5,
          'acerage':33000,
          'name': 'Randy Allen',
          'number':"3GHJ2SDSFF434345",
          'total':10000,
          'addr':'Chicago, IL',
          'avlbl':7500,
          'crop':'Grapes',
          'premium':800,
          'year':2017
        }
        ];
        BlockChainService.setPolicys(pols);
       
        $scope.policys = BlockChainService.getPolicys();
        $scope.balance = 100;
          // $scope.finalSent = false;
        }
        init();



        function resetForm() {
             $scope.form = {
            'firstName': '',
            'lastName': '',
            'email': '',
            'addr':'',
            'acerage':'',
            'value': "40",
            'coverage': 0,
            'cost': 0,
            'crop':'Soy Beans',
            'year':'2017'

          };
        }


        $scope.isFormInvalid = function() {
          // if (!$scope.myForm.firstName.$valid || !$scope.myForm.lastName.$valid ||
          //   !$scope.myForm.email.$valid || !$scope.myForm.addr.$valid || !$scope.myForm.acerage.$valid)
          //   return true;
          return false;
        }
        $scope.onRangeChange = function() {
          var coveragePercent = $scope.form.value / 100;
          if ($scope.form.acerage) {

            $scope.form.coverage = 100 * coveragePercent * $scope.form.acerage;
            $scope.form.cost = 1.25 * coveragePercent * $scope.form.acerage;
          } else {
            $scope.form.cost = $scope.form.coverage = 0;
          }
          console.log('Range changed', $scope.form.value);

        }


        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
          $scope.finalSent = false;
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
        };

        $ionicModal.fromTemplateUrl('templates/modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });


        $scope.send = function() {
          // TODO: Send the Txn to Blockchain
          console.log($scope.form); // This is the request object

          // var mc = MainContract.deployed();
          // mc.proposedAcerage($scope.form.acerage, {from: account});

          var newPolicy = {
          'id' : 6,
          'acerage' : $scope.form.acerage,
          'name' :'Faeez Shaikh',
          'number': $scope.ownerAccount,
          'total':$scope.form.coverage,
          'addr':$scope.form.addr,
          'avlbl':100,
          'crop':$scope.form.crop,
          'premium':$scope.form.cost,
          'year':$scope.form.year
          };
        

          sendCoin();


          resetForm();
          $scope.finalSent = true;  // this is to show the 'sent' msg
          var stack = BlockChainService.getPolicys();
          stack.push(newPolicy);
          BlockChainService.setPolicys(stack);
          console.log('Pushed to service',BlockChainService.getPolicys());
          $scope.balance-=5;


        }

       

      });
