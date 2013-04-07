var users = {
  'sfoster@mozilla.com': {
    email: 'sfoster@mozilla.com',
    name: 'Sam (Mozilla)',
    roles: { player: 'player' }
  },
  'aidan.foster_green@me.com': {
    email: 'aidan.foster_green@me.com',
    name: 'Aidan',
    roles: { player: 'player', admin: 'admin' }
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

