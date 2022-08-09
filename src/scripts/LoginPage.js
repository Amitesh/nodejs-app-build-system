/*
    author: Trimbak Bardale
    Desc:   Right panel, Controller class for Login page.
*/

var loginPage = function() {
    this._about = "loginPage panel";
    if (window === this) {
        return new loginPage();
    }

   return this;
}

loginPage.prototype.init = function() {
}

loginPage.prototype.getDefaultView = function() {
    return _net.ajax.getHtmlSync(_net.urls.Right.LoginPage._template);
};

function getParameterByName(name){
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

loginPage.prototype.Controller = function ($scope, $compile, $rootScope,$window) {
    var _this = _panels.rights.loginPage;
    var _page = _panels.menus.scope.staticModel.menus.main[1];
    _this.base = new _class.baseController.Controller($scope);
    _this.scope = $scope;

    function init() {
	    $scope.init(_this, _page.key);
        $scope.model.Username = "ad-8140";
        $scope.model.Password = "tune23";
        $scope.model.ProductID = 3;
				$scope.model.agreement = "NO";
        $scope.model.errorMessage = "";
				$('body').addClass('login-background');	
    }

    $scope.login = function() {
			var authToken = getParameterByName('token');

			/* ============ When user does not explicitly pass the token, use blank token ============== */
			if(authToken == null)
				authToken = "";	
	    
	    $scope.model.errorMessage = _net.dataApi.login($scope.model, authToken);

			if($scope.model.Username == "" && $scope.model.Password == "")	{
				alert("Please enter username and password.");
				$('.login-name').focus();
			}else if($scope.model.Username == "")	{
			   alert("Please enter username.");
			   $('.login-name').focus();
			}else	if($scope.model.Password == "")	{
				alert("Please enter password.");
				$('.login-password').focus();
			}else if($scope.model.agreement == "NO") {
				alert("Please select checkbox to agree our terms and conditions.");
			}else if($scope.model.errorMessage === "" && $scope.model.agreement === "YES") {
				$scope.home();
			}
		}
	
	init();
}

	//Pre load the main background image
	$(document).ready(function(){
		function preloadImage (url) {
			try {
				var img = new Image();
					img.src = url;
					img.onload = function(){
						console.log('loaded - ', url);
					}
				console.log('loading main image');
			} catch (e) { }
		}
		
		setTimeout(function(){
			// TODO : Correct the path of image
			preloadImage('./images/bg-images/4.jpg');
		}, 10);
	});