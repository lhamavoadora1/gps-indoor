var ctx = document.getElementById("ctx").getContext("2d");
//////////////////inicio video 12

ctx.font = '30px Arial'; //font used
var HEIGHT = 500;
var WIDTH = 500;
var miliseconds_setinterval = 40;
var timeWhenGameStarted = Date.now(); // retrun time in MS
var frameCount =0;
var upgradeList={};
var enemyList = {};
var bulletList={};
///////PLAYER
var player ={
    x:50,
    y:50,
    spdX : 40,
    spdY:11,
    name : 'P',
    hp:20,
    height:20,
    width:20,
    color:'green',
    score: 0,
    ///
    atkSpeed:5,
    atkCounter:0,
    pressingDown: false,
    pressingUp: false,
    pressingLeft: false,
    pressingRight: false,
    aimAngle:0,
    maxScore:0,
};

/////Adding upgrade

addUpgrade = function (id, x, y, spdX, spdY,  width,height,color, category){
    var upgrade ={
        x:x,
        y:y,
        spdX : spdX,
        spdY:spdY,
        name :'upgrade',
        id:id,
        width:width,
        height:height,
        color: color,

        /////
        category: category,
        
    };
  
    
    upgradeList[id] = upgrade;
}

/////Randomly generate Upgrade
ramdomlyGenerateUpgrade = function(){
    var id = Math.random() ;
     var x = Math.random()*WIDTH ;
     var y = Math.random()*HEIGHT;
     var spdX = 0;
     var spdY = 0;
     var width = 10 ; // between 10 nd 40
     var height = 10 ; // between 10 and 40
     var color;
    var category;
     //////

     if(Math.random() < 0.5){
         category = 'score';
         color = 'orange';
     }else{
         category = 'atkSpeed';
         color='purple';
     }
 
     addUpgrade(id, x, y, spdX,spdY,width,height, color, category);
    
 }
//// Add Bullets
/////A

addBullet = function (id, x, y, spdX, spdY,  width,height,color){
    var bullet ={
        x:x,
        y:y,
        spdX : spdX,
        spdY:spdY,
        name :'bullet',
        id:id,
        width:width,
        height:height,
        color: 'black',
        ////
        timer:0,
        
    };
  
    
    bulletList[id] = bullet;
} 

/////Randomly generate Bullets
ramdomlyGenerateBullet = function(actor, overwriteAngle){
    var id = Math.random() ;
     var x = actor.x ;
     var y = actor.y;
     var angle = actor.aimAngle;

     if(overwriteAngle!== undefined){
         angle=overwriteAngle;
     }

     var spdX = Math.cos((angle/180)*Math.PI)*5;
     var spdY = Math.sin((angle/180)*Math.PI)*5;
     var width = 10 ; // between 10 nd 40
     var height = 10 ; // between 10 and 40
     var color = 'black';
     
     addBullet(id, x, y, spdX,spdY,width,height, color);
    
 }
///////Add enemy to game

addEnemy = function (id, x, y, spdX, spdY, width,height,color){
    var enemy ={
        x:x,
        y:y,
        spdX : spdX,
        spdY:spdY,
        name :'enemy',
        id:id,
        width:width,
        height:height,
        color: color,
        //
        aimAngle:0,
    };
  
    
    enemyList[id] = enemy;
}



//////RAMDOMLY GENERATE ENEMY 
/// function math.random() returns a number between 0 and 1

getNewColor = function(){
    var symbols;
    var color;
    symbols = "0123456789ABCDEF";
    color = "#";
    for(var i=0; i<6;i++){
        color = color + symbols[Math.floor(Math.random()*16)];
    }
    return color;
}

ramdomlyGenerateEnemy = function(){
   var id = Math.random() ;
    var x = Math.random()*WIDTH ;
    var y = Math.random()*HEIGHT;
    var spdX = 5+ Math.random()*5;
    var spdY = 5+ Math.random()*5;
    var width = 10 + Math.random()*30; // between 10 nd 40
    var height = 10 + Math.random()*30; // between 10 and 40
    var color = getNewColor() ;

    addEnemy(id, x, y, spdX,spdY,width,height, color);
   
}


////////////// Testing colision


getDistanceBetweenEntity = function  (entity1, entity2){
    //return distance number
    //pitagoras
    var vx=entity1.x -entity2.x;
    var vy = entity1.y-entity2.y;
    return Math.sqrt(vx*vx+vy*vy);
}

/// Testar colisão 

testCollisionEntity = function (entity1, entity2){
   var rect1 ={
       x:entity1.x-entity1.width/2,
       y:entity1.y-entity1.height/2,
       height:entity1.height,
       width:entity1.width,
   }
   var rect2 ={
       x:entity2.x-entity2.width/2,
       y:entity2.y-entity2.height/2,
       height:entity2.height,
       width:entity2.width,
   }
   return testCollisionRectRect(rect1,rect2);
}

// colisão entre retangulos

testCollisionRectRect = function (rect1, rect2){
    //return if colliding (True/false)
    return rect1.x <= rect2.x +rect2.width && rect2.x<= rect1.x+rect1.width && rect1.y <= rect2.y +rect2.height && rect2.y<= rect1.y+rect1.height ;
}

////////////////////////////////////////////////////
////// update player position using mouse 

document.onmousemove = function (mouse){
    var mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
    var mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;

    mouseX -= player.x;
    mouseY -= player.y;
    player.aimAngle = Math.atan2(mouseY,mouseX)/ Math.PI *180;
 }

///////////////////////////////////////////////////////////////
//////////////update player position using keyboard

document.onkeydown =function(event){
    ////asdw
    if (event.keyCode===68){
        player.pressingRight = true; ////letra D
    } else  if (event.keyCode===83){
        player.pressingDown = true; ////letra S
    } else  if (event.keyCode===65){
        player.pressingLeft = true; ////letra A
    }else  if (event.keyCode===87){
        player.pressingUp = true; ////letra W
    }

}

document.onkeyup =function(event){
    ////asdw
    if (event.keyCode===68){
        player.pressingRight = false; ////letra D
    } else  if (event.keyCode===83){
        player.pressingDown = false; ////letra S
    } else  if (event.keyCode===65){
        player.pressingLeft = false; ////letra A
    }else  if (event.keyCode===87){
        player.pressingUp = false; ////letra W
    }

}

updatePlayerPosition = function(){
    if(player.pressingRight){
        player.x+=10;
    }
    if(player.pressingLeft){
        player.x-=10;
    }
    if(player.pressingDown){
        player.y+=10;
    }
    if(player.pressingUp){
        player.y-=10;
    }



    //////checking position
    if(player.x<player.width/2){
        player.x=player.width/2;
    }
    if(player.x>WIDTH - player.width/2){
        player.x=WIDTH- player.width/2;
    }
    if(player.y<player.height/2){
        player.y=player.height/2;
    }
    if(player.y>HEIGHT-player.height/2){
        player.y=HEIGHT - player.height/2;
    }
}

/////////UPDATE ENTITY

updateEntity = function (someEntity){
  
    updatePosition(someEntity);
    drawEntity(someEntity);
}

////// DIVISÃO DE FUNÇÕES EM UPDATE POSITION E DRAW ENTITY

////// UPDATE POSITION

updatePosition = function(someEntity){
    someEntity.x += someEntity.spdX;
    someEntity.y += someEntity.spdY;
    if(someEntity.x>WIDTH || someEntity.x<0){
        // console.log(enemy_message);
        someEntity.spdX = -someEntity.spdX;
     }
     if(someEntity.y>HEIGHT || someEntity.y<0){
         //console.log(enemy_message);
         someEntity.spdY = -someEntity.spdY;
     }
}

////////DRAW ENTITY

drawEntity = function(someEntity){

    ctx.save();
    ctx.fillStyle = someEntity.color;
    ctx.fillRect(someEntity.x-someEntity.width/2,someEntity.y-someEntity.height/2,someEntity.width,someEntity.height);
    
   
   
    ctx.restore();
}


///// starting a new game 

startNewGame = function(){

    var timeSurvived = Date.now() - timeWhenGameStarted;
    console.log('Player lost! but you survived '+ timeSurvived + 'ms.');
    console.log('Total points '+ player.score);
    timeWhenGameStarted = Date.now();
    player.hp = 20;
    frameCount = 0;
    
    enemyList = {};
    upgradeList ={};
    bulletList = {};
    player.atkCounter=0;
    player.atkSpeed = 1;
    if(player.maxScore < player.score){
        player.maxScore = player.score
    }
    player.score =0;
    ramdomlyGenerateEnemy();
    ramdomlyGenerateEnemy();
    ramdomlyGenerateEnemy();
    ramdomlyGenerateEnemy();
   
}

/// Start a new game
startNewGame();


////////on mouse click

document.onclick = function(){
     /// bullet every second
     if(player.atkCounter>25){
        ramdomlyGenerateBullet(player);
        player.atkCounter =0;
    }
}
///// on right click 

document.oncontextmenu=function(mouse){
    if(player.atkCounter>200){

        for(var angle=0; angle<360; angle++){
            ramdomlyGenerateBullet(player,angle);
        }
       
        player.atkCounter =0;
    }
    mouse.preventDefault();
}
//////////UPDATING SCREEEN
update = function (){
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    frameCount++;
    player.score++;
    player.atkCounter += player.atkSpeed;
    // call something every 4 seconds
    
    if(frameCount % 100 === 0){
        ramdomlyGenerateEnemy();
    }
/// generates upgrade 3 seconds
    if(frameCount % 75 === 0){
        ramdomlyGenerateUpgrade();
    }
   

/// iteration for bullets
    for(var key in bulletList){
     updateEntity(bulletList[key]);
        bulletList[key].timer++;
        if(bulletList[key].timer>50){
            delete bulletList[key];
        }else{
            for(var nkey in enemyList){
                var  collides = testCollisionEntity(bulletList[key],enemyList[nkey]);
                if(collides){
                    delete bulletList[key];
                    delete enemyList[nkey];
                    break;
                }
            }
        }
        
    }

   /// iteration for upgrade
   for(var key in upgradeList){
    updateEntity(upgradeList[key]);
    var isColliding = testCollisionEntity(player,upgradeList[key] )
         if(isColliding){
             if(upgradeList[key].category ==='score'){
                console.log('Player is Colliding with'+ upgradeList[key].name + ' category '+ upgradeList[key].category);
                player.score = player.score +1000;
             }else if(upgradeList[key].category ==='atkSpeed'){
                console.log('Player is Colliding with'+ upgradeList[key].name + ' category '+ upgradeList[key].category);
                player.atkSpeed = player.atkSpeed +1;
             }
            
             delete upgradeList[key];
         }
    }

    //iteration for enemy
     for(var key in enemyList){
         updateEntity(enemyList[key]);
         var isColliding = testCollisionEntity(player,enemyList[key] )
         if(isColliding){
             console.log('Player is Colliding with'+ enemyList[key].name);
             player.hp = player.hp -1;
             
         }
     }

    

     ////iteration for player 

     if(player.hp <= 0){
        
        startNewGame();
       
    }
    //player
    updatePlayerPosition();
     drawEntity(player);
     ctx.fillText('Hp: '+ player.hp,0,30);
     ctx.fillText('Score: '+ player.score,90,30);
     if(player.maxScore < player.score){
        ctx.fillText('MaxScore: '+ player.score,250,30);
     }else{
        ctx.fillText('MaxScore: '+ player.maxScore,250,30);
     }
}

setInterval(update,miliseconds_setinterval);

//===========================================================================================================
////////end of video 12
