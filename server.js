const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  disableEveryone: true
});

const firebase = require("firebase/app");
const FieldValue = require("firebase-admin").firestore.FieldValue;
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const rbx = require('noblox.js')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

client.on("guildMemberAdd", member => {
  let channel = client.channels.get("671258373303566336");

  var role = member.guild.roles.find("name", "unverified");
  member.addRole(role).then(function(){
    console.log('added role')
  });

  const embed = new Discord.RichEmbed()
    .setColor("#2ecc71")
    .setTitle(`**Welcome**`)
    .setDescription(
      `**Welcome!** ${member} **to Vortex! We hope you have a good time here!**`
    )
    .setTimestamp()

  channel.send(embed);
});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes.js")(app, db);

var server = app.listen(3000, function() {
  console.log("Listening on port %s", server.address().port);
});

client.on("ready", () => {
  const channel = client.channels.get("671261326483390464");
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    // Yay, it worked!
    console.log("Successfully connected.");
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
});

client.on("ready", () => {
  console.log("Online!");
  client.user.setStatus("available");
  client.user.setPresence({
    game: {
      name: "buy the products now",
      type: "STREAMING",
    }
  });
  
  let myGuild = client.guilds.get('670903593737519104');
  let memberCount = myGuild.memberCount;
  let memberCountChannel = myGuild.channels.get('671261326483390464')
  memberCountChannel.setName('Members: ' + memberCount)
  .then(result => console.log(result))
  .catch(error => console.log(error));
});

client.on('guildMemberAdd', member => {
  let myGuild = client.guilds.get('670903593737519104');
  let memberCount = myGuild.memberCount;
  let memberCountChannel = myGuild.channels.get('671261326483390464')
  memberCountChannel.setName('Members: ' + memberCount)
  .then(result => console.log(result))
  .catch(error => console.log(error));
});

client.on('guildMemberRemove', member => {
  let myGuild = client.guilds.get('670903593737519104');
  let memberCount = myGuild.memberCount;
  let memberCountChannel = myGuild.channels.get('671261326483390464')
  memberCountChannel.setName('Members: ' + memberCount)
  .then(result => console.log(result))
  .catch(error => console.log(error));
});


// Collections
client.commands = new Collection();
client.aliases = new Collection();

config({
  path: __dirname + "/.env"
});

// Run the command loader
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("message", async message => {
    if (message.author.bot) return;
  const prefix = "!";

  // rankup for IFE CLIENT
    db.collection('users').where('discord','==',message.author.id).get().then(exist => {
        if (exist.empty){

        } else {
           if(!message.member.roles.find(r => r.name === "IFE Client")){
          exist.forEach(doc => {
            if (doc.data().ife){
              message.member.addRole(message.guild.roles.find(role => role.name === "IFE Client"));
              message.author.send("hello " + `**${message.author.username}**` + " thank you for buying our ife, we have given you the IFE Client role in the Vortex Server!")
            }
          })
           }
             
           
        }
      })
  
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;


  
  
  // If message.member is uncached, cache it.
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  // Get the command
  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  // If a command is finally found, run the command
  if (command) command.run(client, message, args, db);
});

// WELCOME MESSAGe

client.on("ready", () => {
  function login () {
  return rbx.cookieLogin(process.env.COOKIE);
}
login().then(function () {
client.channels.get("671571354763395072").send("i am up")
})
  .catch(function (err) {
client.channels.get("671571354763395072").send("bot error:  " + err)
  })
});

client.login(process.env.TOKEN);