define(function(require, exports, module) {

  var users = {
    'sfoster@mozilla.com': {
      email: 'sfoster@mozilla.com',
      name: 'Sam (Mozilla)',
      roles: { player: 'player' }
    },
    'sam@sam-i-am.com': {
      email: 'sam@sam-i-am.com',
      name: 'Sam (Mozilla)',
      roles: { player: 'player', admin: 'admin' }
    }  
  };
    
  exports.get = function(email, callback){
    callback(null, users[email]);
  };
  
});
