// Discord bot needs
const Discord = require('discord.js');
const client = new Discord.Client();

// Filesystem needs
const fs = require('fs');
const util = require('util');
const date = new Date();

/* --- Token --- */

// Super secret token!
const token = "Your token here!";

/* --- Logging --- */

// Disable logging to a file here
const log_to_file = false;

const datetime = "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
const log_file = fs.createWriteStream(__dirname + '/log' +  datetime + '.log', {flags : 'w'});

// Override log to also write to file
console.log = function(msg) {
  if ( log_to_file ) { log_file.write(util.format(msg) + '\n'); }
  process.stdout.write(util.format(msg) + '\n');
};

/* --- Content Pairs --- */

// Dict of trigger : response pairs
// This can be anything, from specific text, to video links, to emojis, to whatever.
const contentPairs = {
    "cat picture": "http://2.bp.blogspot.com/-NjcEMP9xXjo/UKdb6ponuuI/AAAAAAAABUo/vw2RmDKYwx0/s1600/Birman-Cat_Picture.jpg",
    "linux": "I'd just like to interject for moment. What you're refering to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called Linux, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine's resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called Linux distributions are really distributions of GNU/Linux! ",
}

/* --- Help message setup --- */

// Length of help output for responses
const responseLen = 40;

// Help message loaded on start
var helpMsg = "";

// This is the command the user must enter to get the help message from the bot
var helpCommand = "!bot.help";

/* --- Ready up --- */

// Ready message
// From the docs:
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on('ready', () => {

    // Load the help message
    // This creates a specfic message to send to users who request to see the
    // bot features.
    console.log('[*] Loading help...');
    for (var key in contentPairs) {
        helpMsg += (key + " => " + contentPairs[key].substring(0, responseLen) + "...\n")
    }

    // Set the bot's status. Can be anything, but it is a user friendly
    // idea to set it to the command used to get help
    client.user.setStatus('online', helpCommand);

    console.log('[*] Logged in & monitoring');
});

/* --- Main event listener --- */

// Event listener for messages
client.on('message', message => {
    console.log('[:] Msg found...');

    // Ignore messages from bots. Serves to not create endless loops if responds to self for example.
    if (message.author.bot) {
        console.log('[:] Ignorng found as it is a bot msg...');

    } else {
        // Iterate through dict, look for triggers
        console.log('[:] Searching for match...');

        // Search for a match
        for (var key in contentPairs) {
            // If a trigger is found, put response into channel
            if (message.content.indexOf(key) !== -1) {
                console.log("[!] Message found!")
                message.channel.sendMessage(contentPairs[key]);
            }
        }

        if (message.content.indexOf(helpCommand) !== -1) {
            console.log("[:] Help requested.")
            message.channel.sendMessage(message.author + " I PM'd you a list of my commands");
            console.log("[:] Help sent.")
            message.author.sendMessage(helpMsg).catch(error=>{});
        }

        // Alterative methods may be used as well
        // for example, if a message is just 'RMS' it'll respond with the GNU/Linux interjection
        if (message.content === "RMS") {
            console.log("[!] Alternative message found!")
            // As you can see, we can just send out contentPairs with a key to get the message
            message.channel.sendMessage(contentPairs["linux"]);
        }

    }
});

// Login
client.login(token);
