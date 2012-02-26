define(['$'], function($){
  function enter(player, game){
    $('main').html("you enter the world");
  }
  function exit(player, game){
    $('main').html("you leave the world");
  }
  
  return {
    enter: enter, 
    exit: exit
  };
});