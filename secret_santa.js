var csv = require("fast-csv");
var fs = require('fs');
var nodemailer = require('nodemailer');
var config = require('./santa_config.json')
var stream = fs.createReadStream(config.people_file);

var giving_gifts = [];
var getting_gifts = [];
var people_count = [];
  csv
   .fromStream(stream, {ignoreEmpty: true})

   .on("data", function(data){
      giving_gifts.push(data[0]);
      getting_gifts.push(data[0]);
      people_count.push(data[0]);
   })

   .on("end", function(){
     for(i=0; i < people_count.length; i++) {
       var give = giving_gifts[Math.floor(Math.random() * giving_gifts.length)];
       var get = getting_gifts[Math.floor(Math.random() * getting_gifts.length)];
       if (give !== get){
         var body = "<p>This year for Secret Santa, you will give a gift to: " + get + "</p>";
         send_email(give, body);
         remove_from_lists(get, give);
       }
       else {
         var give = giving_gifts[Math.floor(Math.random() * giving_gifts.length)];
         var get = getting_gifts[Math.floor(Math.random() * getting_gifts.length)];
         var body = "<p>This year for Secret Santa, you will give a gift to: " + get + "</p>";
         send_email(give, body);
         remove_from_lists(get, give);
       }
     }
   });

function remove_from_lists(get, give) {
  var index_get = getting_gifts.indexOf(get);
  if (index_get > -1) {
     getting_gifts.splice(index_get, 1);
  }
  var index_give = giving_gifts.indexOf(give);
  if (index_give > -1) {
     giving_gifts.splice(index_give, 1);
  }
}

function send_email(email_recipient,body) {
  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: config.sender,
          pass: config.sender_pw
      }
  });

  var mail_options = {
    from: config.sender,
    to: email_recipient,
    subject: config.subject,
    html: body
  };


  transporter.sendMail(mail_options, function (err, info) {
     if(err)
       console.log(err)
     else
       console.log(info);
  });
}
