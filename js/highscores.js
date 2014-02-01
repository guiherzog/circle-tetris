//----------------modify this part-----------------------------------//
var postMessage = "Eu estou jogando Circle Tetris. Jogue você também!";
var APP_ID = '185145435027936';                                                                                             //facebook app id
var picURL = "http://www.hertizog.com/circleTetris/menu.png";                                                                                                           //icon to show on facebook
var linkURL = "http://www.hertizog.com/circleTetris/index.html";                                                             //link to show on facebook
//---------------end------------------------------------------------//

/*
FB.api('/104113',loginResponse);
FB.api('/fql', {q: 'select uid, pic, pic_small, pic_big, pic_square from user where uid=me()'},loginResponse);

https://graph.facebook.com/100001180503751/picture?type=square
*/


//-------------------------facebook code---------------------------//
var score=0;
var mySavedScore = 0;

window.fbAsyncInit = function() {
FB.init({ appId:APP_ID });

// Additional initialization code here
};

// Load the SDK Asynchronously
(function(d){
 var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
 js = d.createElement('script'); js.id = id; js.async = true;
 js.src = "//connect.facebook.net/en_US/all.js";
 d.getElementsByTagName('head')[0].appendChild(js);
}(document));

function login(){
FB.login(loginResponse, FB.JSON.parse( '{"perms":"publish_stream"}' ) );
}

function loginResponse(response) {
    var loggedIn = false;
    if (response && response.session && response.session.access_token){
        loggedIn = true;
    }else if(response && response.authResponse && response.authResponse.accessToken){
        loggedIn = true;
    }
    
    if (loggedIn){
        FB.api('/me/friends',onFriendsLoaded);
        getSavedScore();
    }
}

function onFriendsLoaded(result){
    if (result.data.length > 0){
        gameRef._handleGameStart();
        $.mobile.changePage("#game");
    }
}


function filterData(friendData, minLength, maxLength){
    var newArray = new Array;
    
    for (var i=0;i<friendData.length;i++){
        var f = friendData[i];
        var idx = f.name.indexOf(" ");
        var name = f.name;
        
        if (idx > 0){
            name = name.substring(0, idx);
        }
        
        if (name.length <= maxLength && name.length >= minLength){
            f.name = name;
            
            newArray[newArray.length] = f;
        }
    }
    
    return newArray;
}

function randSet(from, to, setSize){
    var randIgnoreList = {};
    var matched = 0;
    
    while (matched < setSize){
        var r = randNum(from, to);
        
        if (randIgnoreList[r] == null){
            randIgnoreList[r] = true;
            matched++;
        }
    }
    
    return randIgnoreList;
}

function randNum(from, to){
    var numLow = from;
    var numHigh = to;

    var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;

    return Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
}

function getSavedScore(){
    FB.api('/me/scores', function(response) {
        if (response.data){
            mySavedScore = response.data[0].score;
        }
    });
}

function saveScore(myScore){
	console.log("saving score...");
    if (myScore > mySavedScore){
        mySavedScore = myScore;
        if (typeof FB != 'undefined')
	        FB.api('/me/scores', 'post', {score:myScore}, function(response) {});
    }
}
function onLeaderboardUpdate(response){
    var leaderboard = document.getElementById("leaderboardDiv");
    leaderboard.innerHTML = "";
    
    if (response.data){
        var innerHTML = "";
        for (var i = 0; i < response.data.length && i < 10; i++){
            innerHTML += 
            '<li class="highscore-item"><img class="imagemPerfil" src="https://graph.facebook.com/' 
            + response.data[i].user.id 
            + '/picture"><h3 id="name">' 
            + response.data[i].user.name 
            + '</h3><h5 id="score"> ' 
            + response.data[i].score 
            + '<h5></li>'
            + '<div class="line-separator"></div>';
        }
        
        leaderboard.innerHTML = innerHTML;
    }
    
}
function updateLeaderboard(){
    if (typeof FB != 'undefined')
    	FB.api('/' + APP_ID + '/scores', onLeaderboardUpdate());
}

saveScore(130);
updateLeaderboard();

