var dog,happyDog,sadDog,database,foodS,foodStock;
var sadDogImg,happyDogImg;
var feedButton,AddFoodButton;
var food;
var fedTime;
var readState,gameState;
var bedroomImg,gardenImg,washroomImg;
function preload()
{
  sadDogImg = loadImage("vpImages/dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
  bedroomImg = loadImage("vpImages/BedRoom.png")
  gardenImg = loadImage("vpImages/Garden.png")
  washroomImg = loadImage("vpImages/WashRoom.png")
}

function setup() {
  database = firebase.database();
  createCanvas(900,500);
  dog = createSprite(850,250,15,15);
  dog.addImage(sadDogImg);
  dog.scale = 0.25;
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  food = new Food();
  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    fedTime = data.val();
  });
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
  feedButton = createButton("Feed The Dog");
  feedButton.position(685,100);
  feedButton.mousePressed(feedDog);
  AddFoodButton = createButton("Add Food");
  AddFoodButton.position(795,100);
  AddFoodButton.mousePressed(AddFood);

}
function draw() {
  currentTime = hour();
  if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
  }else if(currentTime==(lastFed+2)){
  update("Sleeping")
  foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing")
  foodObj.washroom();
  }else{
  update("Hungry")
  foodObj.display();
  }



  background(46,139,87);  
  food.display();
  drawSprites();
  textSize(20);
  fill("white");
  text("Food Remaining: "+foodS,170,100);
  if(fedTime>=12){
fill("white");
textSize(15); 
text("Last Fed : "+ fedTime%12 + " PM", 350,30);
}
else if(fedTime==0){
fill("white");
textSize(15); 
text("Last Fed : 12 AM",350,30);
}
else
{
fill("white");
textSize(15); 
text("Last Fed : "+ fedTime + " AM", 350,30);

if(gameState!="Hungry"){
feedButton.hide();
addFood.hide();
dog.remove();
}else{
feedButton.show();
addFood.show();
dog.addImage(sadDog);
}

}
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
dog.addImage(happyDogImg);
foodS--;
database.ref('/').update({
Food : foodS
})
fedTime = hour(); 
}

function AddFood(){
dog.addImage(sadDogImg);
foodS++;
database.ref('/').update({
Food:foodS
  })
}