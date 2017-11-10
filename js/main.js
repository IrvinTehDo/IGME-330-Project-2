"use strict";

var app = app || {};

app.main = {
    WIDTH: 800,
    HEIGHT: 600,
    
    canvas: undefined,
    ctx: undefined,
    animationID: 0 ,
    
    GAME_STATE: Object.freeze({
        BEGIN: 0,
        DEFAULT: 1,
        MOVING: 2,
        ROUND_OVER: 3,
        REPEAT_LEVEL: 4,
        END: 5
    }),
    
    MENU_STATE: Object.freeze({
        MAIN: 0,
        PLAYING: 1,
        GAME_OVER: 2,
    }),
    
    OBJ_TYPE: Object.freeze({
        PLAYER: 0,
        BLOCK: 1,
        GOAL: 2,
    }),
    
    curGameState: null,
    curMenuState: null,
    
    ball: {
        x: 0,
        y: 0,
        r: 0,
        speed: 5,
        velocityX:0,
        velocityY:0,
        rotationX: 1, // -1 = left, 1 = right
        rotationY: 1, // -1 = down, 1 = up
        moving: false,
        type: null,
        isColliding: true,
    },
    
    block: {
        x: 0,
        y: 0,
        w: 50,
        h: 100,
        type: null,
    },
    
    goal: {
        x: 0,
        y: 0,
        w: 25,
        h: 25,
        type: null,
    },
    
    //MARK - Initializers
    
    init: function(){
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.onmousedown  = this.doMouseDown.bind(this);
        this.canvas.onmouseup = this.doMouseUp.bind(this);
        this.canvas.onmousemove = this.doMouseMove.bind(this);
        
        this.block.x = this.canvas.width - 300;
        this.block.y = this.canvas.height/2 - this.block.h/2;
        this.block.type = this.OBJ_TYPE.BLOCK;
        
        this.goal.x = 25;
        this.goal.y = 25;
        this.goal.type = this.OBJ_TYPE.GOAL;
        
        
        this.ball.x = this.canvas.width/2;
        this.ball.y = this.canvas.height/2;
        this.ball.r = 10;
        this.ball.type = this.OBJ_TYPE.PLAYER;
        
        this.curGameState = this.GAME_STATE.DEFAULT;
        this.curMenuState = this.MENU_STATE.MAIN;
        
        this.update();
    },
    
    //MARK - Update Loop
    update: function(){
        this.animationID = requestAnimationFrame(this.update.bind(this));
        var dt = this.calculateDeltaTime();
        
        //Update Loop
        //this.moveBall();
        if(this.curGameState == this.GAME_STATE.MOVING && this.curMenuState == this.MENU_STATE.PLAYING){
            this.moveBall(); 
        }
        
        
        this.draw();
       
    },
    
    draw: function(){
        // Draw Loop
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
        
        if(this.curMenuState == this.MENU_STATE.PLAYING){
            this.drawGame();
        }
        
        else if(this.curMenuState == this.MENU_STATE.MAIN){
            this.drawMenu();
        }
        
        else if(this.curMenuState == this.MENU_STATE.GAME_OVER){
            this.drawGameOver();
        }
    },
    
    drawGame: function(){
        this.ctx.save();
        this.ctx.fillStyle = makeColor(0,255,0,1);
        this.ctx.fillRect(this.block.x,this.block.y, this.block.w, this.block.h);
        this.ctx.fillStyle = makeColor(0,0,255,1);
        this.ctx.fillRect(this.goal.x,this.goal.y, this.goal.w, this.goal.h);   
        this.ctx.restore();
        this.drawBall(this.ctx);
    },
    
    drawMenu: function(){
        this.ctx.save();
        this.ctx.fillStyle = "Red";
        this.ctx.font = '48px Serif';
        this.ctx.fillText("Main Menu", this.canvas.width/2 - 125, this.canvas.height/2);
        this.ctx.font = '24px Serif';
        this.ctx.fillText("Click anywhere to play", this.canvas.width/2 - 125, this.canvas.height/2 + 50);
        this.ctx.restore();
    },
    
    drawGameOver: function(){
        this.ctx.save();
        this.ctx.fillStyle = "Red";
        this.ctx.font = '48px Serif';
        this.ctx.fillText("Game Over", this.canvas.width/2 - 125, this.canvas.height/2);
        this.ctx.font = '24px Serif';
        this.ctx.fillText("Click anywhere to go to main menu", this.canvas.width/2 - 175, this.canvas.height/2 + 50);
        this.ctx.restore();
        
    },
    
    // MARK - Listener Events
    doMouseDown: function(e){
        //Mouse Functions
        var mouse = getMouse(e);
        
        if(this.curMenuState == this.MENU_STATE.MAIN){
            this.reinit();
            this.curMenuState = this.MENU_STATE.PLAYING;
            this.curGameState = this.GAME_STATE.DEFAULT; // Change this to "Start" when releasing finished product.
        }
        
        else if(this.curMenuState == this.MENU_STATE.GAME_OVER){
            this.curMenuState = this.MENU_STATE.MAIN;
        }
        
        else if(this.curMenuState == this.MENU_STATE.PLAYING && this.curGameState == this.GAME_STATE.DEFAULT){
            this.curGameState = this.GAME_STATE.MOVING;
            this.ball.rotationX = angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y).x * -1;
            this.ball.rotationY = angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y).y * -1;   
        }       
    },
    
    doMouseUp: function(e){
        
    },
    
    doMouseMove: function(e){
        
    },
    
    // MARK - Helper Functions
    calculateDeltaTime: function(){
        var now, fps
        now = performance.now();
        fps = 1000/ (now - this.lastTime);
        fps = clamp(fps, 12, 60); 
        this.lastTime = now;
        return 1/fps;
    },
    
    reinit: function(){
        this.block.x = this.canvas.width - 300;
        this.block.y = this.canvas.height/2 - this.block.h/2;
        this.block.type = this.OBJ_TYPE.BLOCK;
        
        this.goal.x = 25;
        this.goal.y = 25;
        this.goal.type = this.OBJ_TYPE.GOAL;
        
        
        this.ball.x = this.canvas.width/2;
        this.ball.y = this.canvas.height/2;
        this.ball.r = 10;
        this.ball.type = this.OBJ_TYPE.PLAYER;
    },
    
    moveBall: function(){
        if(this.ball.x + this.ball.r > this.canvas.width || this.ball.x - this.ball.r < 0){
            this.ball.rotationX *= -1;
        }
        
        if(this.ball.y + this.ball.r > this.canvas.height || this.ball.y - this.ball.r < 0){
            this.ball.rotationY *= -1;
        }
        
        this.C2RCollides(this.ball, this.block);
        this.C2RCollides(this.ball, this.goal);
        
        this.ball.velocityX = this.ball.speed * this.ball.rotationX;
        this.ball.velocityY = this.ball.speed * this.ball.rotationY;
        
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        
    },
    
    drawBall: function(ctx){
        ctx.save();
        ctx.fillStyle = makeColor(255,0,0,1);
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    
    C2RCollides: function(circle, rect){
        //Check Collision between two objects or bounds  
        var distX = Math.abs(circle.x + circle.velocityX - rect.x-rect.w/2);
        var distY = Math.abs(circle.y + circle.velocityY - rect.y-rect.h/2);
        var dist = Math.sqrt(distX - rect.w/2) - Math.sqrt(distY - rect.h/2);
        
        if (distX >(rect.w/2 + circle.r)){return false;}
        if(distY > (rect.h/2 + circle.r)){return false;}  
        if(distX <= (rect.w/2)){
            
            if(rect.type == this.OBJ_TYPE.GOAL){
                //Game Over Code Here
                this.curGameState = this.GAME_STATE.END;
                this.curMenuState = this.MENU_STATE.GAME_OVER;
            }
            
            else if(rect.type == this.OBJ_TYPE.BLOCK){
                this.ball.rotationX *= -1;
                this.ball.x += this.ball.speed * this.ball.rotationX;
            }
            
            //return true;
        }
        if(distY <= (rect.h/2)){
            
            if(rect.type == this.OBJ_TYPE.GOAL){
                //Game Over Code Here
                this.curGameState = this.GAME_STATE.END;
                this.curMenuState = this.MENU_STATE.GAME_OVER;
            }
            
            else if(rect.type == this.OBJ_TYPE.BLOCK){
                this.ball.rotationY *= -1;
                this.ball.y += this.ball.speed * this.ball.rotationY;
            }
            
            
            //return true;
        }

        return ((distX * distX) + (distY * distY) <= (circle.r * circle.r));
    },
    
}; // END app.main