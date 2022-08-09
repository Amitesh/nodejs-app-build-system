/*
    author: Trimbak Bardale
    Desc:   Right panel, Controller class for Home page.
*/

var homePage = function() {
    this._about = "homePage panel";
    if (window === this) {
        return new homePage();
    }

   return this;
}

homePage.prototype.init = function() {
}

homePage.prototype.getDefaultView = function() {
    return _net.ajax.getHtmlSync(_net.urls.Right.HomePage._template);
};

homePage.prototype.Controller = function ($scope, $compile, $rootScope,$timeout,$window,$sce) {
		
	$scope.val=true;
    $scope.wordval = false;
    $scope.wordval1=false;
	moveToWTFromResult = false;
	moveToWTFromReport = false;
	moveToWDFromReport = false;
	reportFlag = false;
    $scope.count = 0;
    $scope.arr = [];
    var _this = _panels.rights.homePage;
    var _home = _panels.menus.scope.staticModel.menus.main[0];
    _this.base = new _class.baseController.Controller($scope);
    _this.scope = $scope;
	
	/* ========= Change background ========= */
	loadBackgroundImage = function (){
		$('body').removeClass();
		$('body').addClass('bg_4');	
	}
	
	/* ========= Change background color of my word list sub game icons ========= */
	loadGreenSliderBackground = function (){
		$('#sliderBackground').removeClass();
		$('#sliderBackground').addClass('myWordListSliderCenter');
	}
	
	/* ========= Change background color of bonus sub game icons ========= */
	loadPinkSliderBackground = function (){
		$('#sliderBackground').removeClass();
		$('#sliderBackground').addClass('bonusSliderCenter');
	}
	
	/* ========= Default slider background ========= */
	loadSliderBackground = function (){
		$('#sliderBackground').removeClass();
		$('#sliderBackground').addClass('sliderCenter');
	}
	
	loadCourseData = function()
	{
		console.log("Load Course");
		var activeIndex = 0;
		if(_net.dataApi.activeCourse.name == undefined)
			$scope.activeClass = $scope.readonly.profile.ClassroomCourses[0];
		else
		for(var i = 0; i < _net.dataApi.courseList.length; i++)
			if(_net.dataApi.activeCourse.name == _net.dataApi.courseList[i].name) {
			$scope.activeClass = $scope.readonly.profile.ClassroomCourses[i];
			activeIndex = i;
			break;
		}
		
		$scope.readonly.courses = _net.dataApi.getCourseList($scope.readonly.profile.ClassroomCourses,0);
		$scope.readonly.activeCourse = _net.dataApi.getActiveCourse(activeIndex);
		getCourseData();
		$scope.readonly.activeCourse.activeList = {"words":[]};
		
		console.log($scope.readonly.activeCourse);
		if($scope.viewmodel.selectionLevel==2){
			getActiveListWordList(glob);
			$scope.selectedCourse = $scope.readonly.activeCourse.lists[glob].name;
		}
		/* ========= words for word training game ========= */
		$scope.readonly.words = _net.dataApi.getCourseWords();
		
		$('#wordDiv1').slimscroll({
			height: '100%'
		});
		
		/* ============ Face maker app url service  ============= */
		$scope.readonly.facemakerURL = _net.dataApi.facemakerAppURL();
		
		/* ============ Mathletics url service  ============= */
		$scope.readonly.mathleticsURL = _net.dataApi.mathleticsURL();
		
		$scope.readonly.score = _net.dataApi.getScoreData();
	
		if($scope.readonly.score.IsError==true){
			alert("Service Fault Internal Server Error");
			$window.location.reload();
		}
		else{
			$scope.points = $scope.readonly.score.Points;
		}
	}
	
	//For Annimation
	if(globalData == 0){
		$timeout(function(){
			$scope.beginingImage = true;
			$scope.beginingImageAfter = false;
			$scope.homePageBackgronud = false;
			$scope.showClassSelectionMenu = false;
			console.log("globalData"+globalData);
			globalData=globalData+1;
						
			$timeout(function(){
				$scope.beginingImage = false;
				$scope.showAssessment = false;
				//$scope.homePageBackgronud = false;
				$scope.beginingImageAfter = true;
				$scope.showClassSelectionMenu = false;
			}, 5000);
			
			$timeout(function(){
				$scope.beginingImage = false;
				$scope.beginingImageAfter = false;
				$scope.showClassSelectionMenu = false;
				$scope.assessmentListDetails();
			}, 5500);
	
			$timeout(loadCourseData, 5200);
		}, 0);
			
	}
		
	console.log("globalData="+globalData);	
	if(globalData>=1){
		$timeout(function(){
			$scope.beginingImage = false;
			$scope.beginingImageAfter = false;
			$scope.homePageBackgronud = true;
			$scope.showClassSelectionMenu = false;
			$("#splashAnimation").css("display","none");
		}, 0);
		$timeout(loadCourseData,0);
	}	
	
	/* ========= Show assessment pop up , If assessment is assigned by teacher to student ========= */
	$scope.assessmentListDetails = function() {
		/* ========= Load assessment list ========= */
		$scope.readonly.assessmentList = _net.dataApi.getAssessmentList();
		if(_.isEmpty($scope.readonly.assessmentList.ScheduledChallengeInfoList)){
			$scope.showAssessment = false;
			$scope.homePageBackgronud = true;
		}else{
			$scope.showAssessment = true;
			$("#leftPanelBlock").css("display","none");
			$scope.assessmentDueDate();
		}
	}
	
	/* ========= showHomePage will be called after assessment selection  ========= */
	$scope.showHomePage = function(){
		$scope.showAssessment = false;
		$scope.homePageBackgronud = true;
		$("#leftPanelBlock").css("display","block");
	}
		
    function init() {
		$scope.beginingImage = false;
		$scope.beginingImageAfter = false;
		$scope.showClassSelectionMenu = false;
		$scope.showAssessment = false;
		$scope.showClassDropdown = false;
		$scope.init(_this, _home.key, {"CourseID" : 3});
		$timeout(loadBackgroundImage,0);
		
		initModels();
		$scope.xmlDataTransform();
	}
	
	initModels = function() {
	    $scope.viewmodel.home = _panels.menus.scope.staticModel.menus.main[0];
        $scope.viewmodel.activeMenu = $scope.viewmodel.activeMenu || $scope.viewmodel.home;
        $scope.model.sideMenus= _panels.menus.scope.staticModel.menus.sideMenu;
        menuChanged();
        $scope.faceSetting = unescape($scope.readonly.profile.FaceSetting).split("|");
		_net.dataApi.profile = $scope.readonly.profile;
		
		if(_net.dataApi.profile.IsError == true){
			// _panels.menus.scope.activateByMenukey($scope.viewmodel.activeMenu.key);
		}else{
			profileData = $scope.readonly.profile;
			console.log($scope.readonly.profile);
			_net.dataApi.saveAudioLink($scope.readonly.profile);
			_net.dataApi.saveLogoutLink($scope.readonly.profile);
		}
		$scope.classDropdown();
	}
		
		//If any one enter any game the logic applied
		if(gameFlag==0){
			$scope.homePageEnableTabs = true;
			$scope.subMenuEnableTabs = false;
		}else if(gameFlag>=1)
		{
			$scope.homePageEnableTabs = false;
			$scope.subMenuEnableTabs = true;
			$scope.gamePrevNext = true;
		}
		
	//For Slider
			$scope.currentIndex=0;
			$scope.next=function(){
				console.log("$scope.currentIndex="+$scope.currentIndex);
				$scope.currentIndex<$scope.model.menus.length-1?$scope.currentIndex++:$scope.currentIndex=0;
			};
			
			$scope.prev=function(){
				console.log("$scope.currentIndex="+$scope.currentIndex);
				$scope.currentIndex>0?$scope.currentIndex--:$scope.currentIndex=$scope.model.menus.length-1;
			};
			
			$scope.$watch('currentIndex',function(){
				if($scope.model){
					$scope.model.menus.forEach(function(menu){
						menu.visible=false;
					});
					$scope.model.menus[$scope.currentIndex].visible=true;
				}
			});
	//For Slider
		
    menuChanged = function () {
		if($scope.viewmodel.activeMenu.key=="myWordList"){
		var _subMenus = _panels.menus.scope.staticModel.menus[$scope.viewmodel.activeMenu.home];
		}
		else{
		var _subMenus = _panels.menus.scope.staticModel.menus[$scope.viewmodel.activeMenu.key];
		}
		var temp = _panels.menus.scope.staticModel.menus['homePage'];
		
        _.forEach(_subMenus, function( object) {
                object.icon = object.key + "Icon.png";
				object.mainIcon = object.key + "MainIcon.png";
        });
        $scope.model.menus = _subMenus;
		$scope.temp = temp;//For submenu(myWorldListGame and bonusGame) 
		console.log("menus objects ="+$scope.model.menus);
				
		//Added Functionality for visible or disable silder
			$scope.model.menus[$scope.currentIndex].visible=false;
			if($scope.model.menus.length==3){
				$scope.model.menus[$scope.currentIndex].visible=false;
				$scope.model.menus[0].visible=false;
				$scope.model.menus[1].visible=false;
				$scope.model.menus[2].visible=false;
				if($scope.model.menus[0].key=="cyclobotRevenge"||$scope.model.menus[1].key=="wordInPieces"||$scope.model.menus[2].key=="cyclobotChallenge"){
					$scope.model.menus[$scope.currentIndex].visible=true;
					$scope.gamePrevNext = true;
				}
				else{
					$scope.model.menus[$scope.currentIndex].visible=false;
					$scope.gamePrevNext = false;
				}
			}
			if($scope.model.menus.length==2){
				$scope.model.menus[$scope.currentIndex].visible=false;
				$scope.model.menus[0].visible=false;
				$scope.model.menus[1].visible=false;
				if($scope.model.menus[0].key=="findAWord"||$scope.model.menus[1].key=="crossWord"){
					console.log("findAWord");
					$scope.model.menus[$scope.currentIndex].visible=true;
					$scope.gamePrevNext = true;
				}
				else{
					$scope.model.menus[$scope.currentIndex].visible=false;
					$scope.gamePrevNext = false;
					$scope.gamePrevNext = true;
				}
			}
			if($scope.model.menus.length==6){
				$scope.homePageEnableTabs = true;
				$scope.subMenuEnableTabs = false;
				$scope.gamePrevNext = false;
			}
			//End of Visible and disable slider
		
    };
	
	//logout from spellodrome
	$scope.logoutSpellodrome= function(){
		$window.location.href = _net.dataApi.getLogoutLink();
	}
	
    $scope.page = function(menu, selectionLevel) {
		
		console.log("$scope.viewmodel.selectionLevel="+$scope.viewmodel.selectionLevel)
		
		/* ========= Change the Slider Background  ========= */
		if(menu.key=="myWordListGame"){
			$scope.viewmodel.selectionLevel = 0;
			if($scope.viewmodel.selectionLevel == 0){
				$scope.currentIndex = 0;
				$('#sliderBackground a #cyclobotRevenge').attr('src','images/home_page/cyclobotRevengeMainIcon.png');
				$('#sliderBackground a #wordInPieces').attr('src','images/home_page/wordInPiecesMainIcon.png');
				$('#sliderBackground a #cyclobotChallenge').attr('src','images/home_page/cyclobotChallengeMainIcon.png');
				$scope.viewmodel.titleName = menu.name;
			}
			$timeout(loadGreenSliderBackground,0);
		}else if(menu.key=="bonusGame"){
			$scope.viewmodel.selectionLevel = 0;
			if($scope.viewmodel.selectionLevel == 0){
				$scope.currentIndex = 0;
				$('#sliderBackground a #findAWord').attr('src','images/home_page/findAWordMainIcon.png');
				$('#sliderBackground a #crossWord').attr('src','images/home_page/crossWordMainIcon.png');
				$scope.viewmodel.titleName = menu.name;
			}
			$timeout(loadPinkSliderBackground,0);
		}else {
			$timeout(loadSliderBackground,0);
		}
		
		//Newly added
		if(menu.key=="myWordListGame"||menu.key=="bonusGame"){
			if(gameFlag==0){
				$scope.homePageEnableTabs = false;
				$scope.subMenuEnableTabs = true;
			}
			else if(gameFlag>=1)
			{
				$scope.homePageEnableTabs = false;
				$scope.subMenuEnableTabs = true;
				$scope.gamePrevNext = true;
			}
		}
		
		if(menu.key=="homePage"||menu.key=="myResult"||menu.key=="writingFun"||menu.key=="liveSpellodrome"){
			$scope.homePageEnableTabs = true;
			$scope.subMenuEnableTabs = false;
			$scope.gamePrevNext = false;
		}
		
        var _oldActiveMenu = $scope.viewmodel.activeMenu;
        $scope.viewmodel.activePage = menu;
        $scope.viewmodel.activeMenu = menu;
        $scope.viewmodel.selectionLevel = selectionLevel || 0;
		
        if( _.isEqual(menu.key,  "myWordList")  &&
           $scope.viewmodel.selectionLevel < 2 ) {
            $scope.viewmodel.selectionLevel++;
			$scope.gamePrevNext = false;
			if($scope.viewmodel.selectionLevel == 1){
				$('.slimScrollBar').css("top","0%");
				$('#testDiv').animate({
					  scrollTop:'0px'
					}, 1000);
				$('#sliderBackground a #cyclobotRevenge').attr('src','images/home_page/myWordListMainIcon.png');
				$('#sliderBackground a #wordInPieces').attr('src','images/home_page/myWordListMainIcon.png');
				$('#sliderBackground a #cyclobotChallenge').attr('src','images/home_page/myWordListMainIcon.png');
				$('#sliderBackground a #findAWord').attr('src','images/home_page/myWordListMainIcon.png');
				$('#sliderBackground a #crossWord').attr('src','images/home_page/myWordListMainIcon.png');
				$scope.viewmodel.titleName = "My Word List";
			}
			if($scope.viewmodel.selectionLevel == 2){
				console.log($scope.viewmodel.selectionLevel);
				$(".slimScrollBar").css({top: '0px'});
				$('#wordDiv1').animate({
					  scrollTop:'0px'
					}, 1000);

			}
            // yet to get more selection from user, do not load page
            return;
        }
        if( !_.isEmpty(_panels.menus.scope.staticModel.menus[menu.key]) ) {
            return menuChanged();
        }
		
		if( _.isEqual(menu.key,  "myWordListGame")){
			menu.visible=true;
		 }
		 
		if( _.isEqual(menu.key,  "bonusGame")){
			menu.visible=true;
		 }
		 
        // since loading other page, revert active menu to called one.
        $scope.viewmodel.activeMenu = _oldActiveMenu;
        return _this.base.page(menu);
    }

    $scope.sideMenuOnClick = function(menu) {
        switch(menu.key)
        {
            case 'help' :	
					var helpContent = _net.dataApi.queryData(menu.urlKey,{"country":"AUS","isSpellodrome":"true","guide":"studentGuide"});
					_logger.logInfo(helpContent);
					alert(helpContent);
					break;
            case 'mathletics' :	
					$window.open($scope.readonly.mathleticsURL, '_parent');
					break;
            default :		
					$scope.page(menu);
					break;
        }
    }

    $scope.setUserSelection = function (selection) {
		arr = $scope.readonly.words;
		for(var  i =0;i<arr.length;i++)
		{
		   if(arr[i].WordName.length>17)
			{
				$scope.wordval = true;
				$scope.count++;
			}
		
		}
		if($scope.count==arr.length)
		{ 
			$scope.wordval1 = true;
		}
      
      
        switch ($scope.viewmodel.selectionLevel) {
            case 1:
				glob = selection;
				$scope.selectedCourse = $scope.readonly.activeCourse.lists[selection].name;
                $scope.course = selection;
				getActiveListWordList(selection);
                _helper.sharedProperties.setCourseIndex($scope.course);  // set course in service
                break;
            case 2:
                $scope.wordIndex = selection;
                _helper.sharedProperties.setWordIndex($scope.wordIndex);
                break;
        }

        $scope.page($scope.viewmodel.activeMenu, $scope.viewmodel.selectionLevel);
    };
	
	
	function getCourseData()
	{
//		console.log(this.globalQuery.UserAuthToken);
		$scope.readonly.activeCourse.courseData = _net.dataApi.getActiveCourseData(true); 
		$scope.readonly.activeCourse.words = _net.dataApi.getCourseWords();
		$scope.readonly.activeCourse.sentences = _net.dataApi.getCourseSentences();
	}
	
	
	function getActiveListWordList(activeListIndex)
	{
		filterActiveListData(activeListIndex);
	}
	
	function filterActiveListData(activeListIndex)
	{
		console.log("Get Active List Word List");
		console.log("activeIndex"+activeListIndex);
		$scope.readonly.activeCourse.activeList.words = [];
		var activeList = $scope.readonly.activeCourse.lists[activeListIndex];
		for(var i = 0; i < $scope.readonly.activeCourse.words.length; i++)
		{
			if(wordInList(activeList,$scope.readonly.activeCourse.words[i]))
				$scope.readonly.activeCourse.activeList.words.push($scope.readonly.activeCourse.words[i]);
		}
		
		_net.dataApi.activeCourse.activeList = $scope.readonly.activeCourse.activeList;
	}
	
	function wordInList(activeList,word)
	{
		for(var i=0; i < activeList.items.length; i++)
		{
			if(activeList.items[i].id == word.WordID)
				return true;
		}
		return false;
	}

    $scope.myWordListPrevLevel = function () {
        if($scope.viewmodel.selectionLevel > 0 ) {
            $scope.viewmodel.selectionLevel--;
        }
		$(".slimScrollBar").css({top: '0px'});
		$('#testDiv').animate({
					  scrollTop:'0px'
					}, 0);
    };

    $scope.menuHoverIn = function (menu,index) {
			if($scope.viewmodel.selectionLevel==1){
				$scope.model.menus[0].visible=true;
				$scope.viewmodel.titleName = "My Word List";
			}
			else{
				$scope.viewmodel.titleName = menu.name;
				if((menu.key == "cyclobotRevenge" )||(menu.key == "wordInPieces") ||(menu.key == "cyclobotChallenge")){
					menu.visible=false;
					for(i=0;i<=2;i++)
					$scope.model.menus[i].visible=false;
					$scope.model.menus[index].visible=true;
				}
				else if((menu.key == "findAWord") ||(menu.key == "crossWord")){
					menu.visible=false;
					for(i=0;i<=1;i++)
					$scope.model.menus[i].visible=false;
					$scope.model.menus[index].visible=true;	
				}
				else {
					for(i=0;i<=5;i++)
					$scope.model.menus[i].visible=false;
					$scope.model.menus[index].visible=true;
				}
			}
		
    };

     $scope.menuHoverOut = function (menu,index) {
			if($scope.viewmodel.selectionLevel==1){
				$scope.model.menus[0].visible=true;
				$scope.viewmodel.titleName = "My Word List";
			}
			else{
				$scope.model.menus[index].visible=false;
				$scope.model.menus[index].visible=true;
				
				//myWordListGame
				if($scope.viewmodel.activeMenu.key=="myWordListGame"){
					
					$scope.model.menus[index].visible=true;
				}
				//bonusGame
				if($scope.viewmodel.activeMenu.key=="bonusGame"){
					
					$scope.model.menus[index].visible=true;
				}
			}
     }
	 //Score Ponits Logic and spellometer animation
	 $scope.initializePoints = function(){
		if($scope.points >= 200 && $scope.points < 400){
            angular.element(".level-1").addClass('level-hide');
        }else if($scope.points >= 400 && $scope.points < 600){
            angular.element(".level-1,.level-2").addClass('level-hide');
			angular.element(".wave").removeClass('level-1-wave');
        }else if($scope.points >= 600 && $scope.points < 800){
            angular.element(".level-1,.level-2,.level-3").addClass('level-hide');
			angular.element(".wave").removeClass('level-1-wave level-2-wave');
        }else if($scope.points >= 800 && $scope.points < 1000){
            angular.element(".level-1,.level-2,.level-3,.level-4").addClass('level-hide');
          	angular.element(".wave").removeClass('level-1-wave level-2-wave level-3-wave');
        }else if($scope.points >= 1000){
            angular.element(".level-1,.level-2,.level-3,.level-4,.level-5").addClass('level-hide');
           	angular.element(".wave").removeClass('level-1-wave level-2-wave level-3-wave level-4-wave');
        }
    }

	/* ========= Class dropdown will be available only if student has mutiple classes in course list =========*/
	$scope.classDropdown = function (){
		if($scope.readonly.profile.ClassroomCourses.length > 1){
			$scope.showClassDropdown = true;
		}else{
			$scope.showClassDropdown = false;
		}
	}
	
	$scope.selectClass = function(activeIndex){
		$scope.readonly.activeCourse = _net.dataApi.getActiveCourse(activeIndex);
		getCourseData();
		$scope.readonly.activeCourse.activeList = {"words":[]};
		$scope.showClassSelectionMenu = false;
		$scope.activeClass = $scope.readonly.profile.ClassroomCourses[activeIndex];
	}

	/* ========= Class selection pop up  ========= */
	$scope.classSelection = function (){
		$scope.showClassSelectionMenu = true;
	}
	
	$scope.closeClassSelectionPanel = function (){
		$scope.showClassSelectionMenu = false;
	}
	
	$scope.assessmentDueDate = function (){
		var lengthOfList = $scope.readonly.assessmentList.ScheduledChallengeInfoList.length;
		$scope.dueDateString = [];
		$scope.assessmentDueDateList =[];
		
		for(var i = 0; i < lengthOfList; i++){
			$scope.dueDateString = $scope.readonly.assessmentList.ScheduledChallengeInfoList[i].AvailableToUTC;
			$scope.dateString = $scope.dueDateString.split("(");
			$scope.dateValue =$scope.dateString[1];
			$scope.dateValue = $scope.dateValue.split(")");	
			$scope.assessmentDueDateList.push({convertedDate: $scope.dateValue[0]}) ;
		}
	}
		
	$scope.assessmentDetails = function(){
		$scope.showHomePage();
		$scope.readonly.assessmentLink = _net.dataApi.assessmentURL();
		console.log($scope.readonly.assessmentLink.url);
		$window.open($scope.readonly.assessmentLink.url, '_blank');
	}
	
	/* ======== FACE MAKER ======== */
		$scope.xmlDataTransform = function() {
			
			var studentface = $scope.readonly.profile.FaceSetting;
			var countrycode = $scope.readonly.profile.CountryCode;
			
		    var sface = studentface.split('|');
            studentface = sface;
            var country_image = $sce.trustAsHtml('<img width="24" height="24" src="./media/flags/flags/'+countrycode+'.png" align="left" />');
				
            faceHtml = '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/bg-'+studentface[15]+'.png"/>';

            if(studentface[13] != 0) {
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-hatback-'+studentface[13]+'-'+studentface[14]+'.png"/>';
            }

            if(studentface[1] != 0) {
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-hairback-'+studentface[1]+'-'+studentface[2]+'.png"/>';
            }

            faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-face-1-'+studentface[8]+'.png"/>'

            if(studentface[5] != 0) {
                var color = studentface[4];
                if(parseInt(color, 16) >= 6) {
                    color = "3";
                }
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-eyebrows-'+studentface[5]+'-'+color+'.png"/>';
            }

            if(studentface[3] != 0) {
                var color = studentface[4];
                if(parseInt(color, 16) >= 6) {
                    color = "3";
                }
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-eyes-'+studentface[3]+'-'+color+'.png"/>';
            }

            if(studentface[6] != 0) {
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-nose-'+studentface[6]+'-'+studentface[8]+'.png"/>';
            }

            if(studentface[7] != 0) {
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-mouth-'+studentface[7]+'-'+studentface[8]+'.png"/>';
            }

            if(studentface[9] != 0) {
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-cloth-'+studentface[9]+'-'+studentface[10]+'.png"/>';
            }

            if(studentface[11] != 0) {
                var color = studentface[12];
                if(parseInt(color, 16) >= 6) {
                    color = "3";
                }
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-glasses-'+studentface[11]+'-'+color+'.png"/>';
            }

            if(studentface[1] != 0) {
                faceHtml += '<img src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-hair-'+studentface[1]+'-'+studentface[2]+'.png"/>';
            }

            if(studentface[13] != 0) {
                faceHtml += '<img  src="http://west.cdn.mathletics.com/faceMaker/Student/PNGs/'+studentface[0]+'-hat-'+studentface[13]+'-'+studentface[14]+'.png"/>';
            }

            $scope.country_1 = $sce.trustAsHtml('<img src="./media/flags/flags/'+countrycode+'.png" align="left" />');
            $scope.faceHtml_1 = $sce.trustAsHtml(faceHtml);
        };
		
		$scope.redirectToFacemakerApp = function(){
			$window.open($scope.readonly.facemakerURL, '_parent');
		}
		
		init();
	
}
