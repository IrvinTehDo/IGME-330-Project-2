// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .sound module and immediately invoke it in an IIFE
app.sound = (function(){
	var bgAudio = undefined;
	var SOUNDS = {
        BOUNCE: "media/bounce.wav",
    };
    
    var timePaused = 0;

	function init(){
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume=0.25;
	}
		
	function stopBGAudio(){
		bgAudio.pause();
		timePaused = bgAudio.currentTime;
	}
	
	function playEffect(toPlay){
    var effectSound = document.createElement('audio');
        effectSound.volume = 0.3;
		effectSound.src = toPlay;
		effectSound.play();
	}
    
    function resumeBGAudio(){
        //bgAudio.currentTime = timePaused;
        bgAudio.play();
    }
    
    function playBGAudio(){
        bgAudio.play();
    }
		
	// export a public interface to this module
	// TODO
    return{
        SOUNDS: SOUNDS,
        init: init,
        stopBGAudio: stopBGAudio,
        playEffect: playEffect,
        playBGAudio: playBGAudio,
        resumeBGAudio: resumeBGAudio,
    };
}());