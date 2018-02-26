const ldap = require('ldapjs');
const baseDN = 'DC=dongwhadev,DC=com',
  baseAdminID = 'ADLdap',
  baseAdminPW = '1AopenAD1!';

const client = ldap.createClient({
  url: 'ldap://172.16.0.140:389',
  baseDN: baseDN,
  bindDN: baseAdminID,
  bindCredentials: baseAdminPW
});

client.on('connect', function() {
  console.log('possible connection..');
  // client.exop('1.3.6.1.4.1.4203.1.11.3', function(err, value, res) {
  //   console.log('whois: ' + res);
  //   console.log('whois: ' + value);
  // });
  // client.bind('cn='+baseAdminID,baseAdminPW,function(err){
  //   console.log(err);
  // })

  const searchOptions = {
    scope: "sub",
    filter: '(sAMAccountName=d4001367)'
  };
  client.search(baseDN, searchOptions, function(err, res) {
    res.on('searchEntry', function(entry) {
      console.log('entry: ' + JSON.stringify(entry.object));

      client.bind(entry.object.dn, 'P@4001367!!', function(err){
        if(err==null){
          console.log("it's true");
        }
        else {
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
        console.log(err);
      });

    });
  });
});
