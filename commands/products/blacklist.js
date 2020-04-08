const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client()
const roblox = require('noblox.js');

let FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
  name: "blacklist",
  category: "products",
  description: "To verify another player",
  run: async(client,message,args,db) => {
    if (message.author.bot) return;
    var args = message.content.split(/[ ]+/)
if (message.member.roles.some(role => role.name === 'Owner')){
  
  var username = message.mentions.members.first()
  
  if (!username){
        var docRef = db.collection("users").doc(args[1]);
    docRef.get().then(function(doc) {
    if (doc.exists) {
      db.collection('users').doc(`${args[1]}`).set({blacklisted: "by: "+ message.author.id + " alias: " + message.author.tag},{merge: true});

            return message.channel.send(new Discord.RichEmbed().setTitle("Blacklisted").setDescription(`**BLACKLISTED** `  + args[1]).setFooter("Product System").setColor("#2ecc71"))
      }

})
  }

  
  
}
  }   
    
}