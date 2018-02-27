var ldap = require('ldapjs');
var baseDN = 'DC=dongwhadev,DC=com';
var baseAdminID = 'ADLdap';
var baseAdminPW = '1AopenAD1!';

var client = ldap.createClient({
  url: 'ldap://172.16.0.140:389',
  baseDN: baseDN,
  bindDN: baseAdminID,
  bindCredentials: baseAdminPW
});

client.on('connect', function() {
  console.log('LDAP is connected..');

  var searchOptions = {
    scope: "sub",
    filter: '(sAMAccountName=d4001367)'
  };
  client.search(baseDN, searchOptions, function(err, res) {
    res.on('searchEntry', function(entry) {
      console.log('entry: ' + JSON.stringify(entry.object.dn));
      client.bind(entry.object.dn, 'P@4001367!!', function(err) {
        if (err == null) {
          console.log("it's true");
        } else {
          console.log("it's false");
        }
      });

    });
    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
      console.log('status: ' + result.status);
      client.unbind(function(err) {
        console.log('LDAP is disconnected..');
      });
    });
  });
});
