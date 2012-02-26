define(['models/Location'], function(Location){
  return new Location({
    enter: function(){
      $("#main").append("You are in the plains");
    },
    exit: function(){
      $("#main").append("You leave the plains");
    })
  }
});