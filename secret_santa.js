var csv = require("fast-csv");
var fs = require('fs');
var nodemailer = require('nodemailer');
var config = require('./santa_config.json')
var stream = fs.createReadStream(config.file);

csv
 .fromStream(stream, {ignoreEmpty: true})

 .on("data", function(data){
    var email_recipient = data[1];
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
      html: config.body
    };


    transporter.sendMail(mail_options, function (err, info) {
       if(err)
         console.log(err)
       else
         console.log(info);
    });

 })

 .on("end", function(){
     console.log("done");
 });
