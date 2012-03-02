define(['models/Location'], function(Location){
  return new Location({
    enter: function(){
      $("#main").append("<p>You are in the plains</p>");
    },
    exit: function(){
      $("#main").append("<p>You leave the plains</p>");
    }
  });
});