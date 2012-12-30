define(['compose', 'models/Location'], function(Compose, Location){
  
  var after = Compose.after, 
      before = Compose.before;
  // a type of location

  return Compose(Location, {
    enter: before(function(){
      $("#main").append("<p>You are in the plains</p>");
    }),
    exit: after(function(){
      $("#main").append("<p>You leave the plains</p>");
    })
  });
});