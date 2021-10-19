//Modules
const Eris = require('eris');
require('pluris')(Eris);
const fs = require('fs');
const phin = require('phin');

//Config
const configFile = fs.readFileSync('config.json');
const config = JSON.parse(configFile);

//Variables
var token = config.token;
var prefix = config.prefix;

//Client
const client = new Eris.Client(token);
client.connect();

//On Connect
client.on('connect', async () => {
    console.clear()
    console.log(`Simple selfbot by windex.js online!`);
    console.log(`Commands: ${prefix}clap <args>, ${prefix}avatar <user>, ${prefix}ping`)
});

//Nitro Sniper
client.on('messageCreate', async (message) => {
    var start = new Date()

    function getDateTime() {

        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;


        return hour + ":" + min + ":" + sec;

    }
    if (message.content.includes('discord.gift') || message.content.includes('discordapp.com/gifts/')) {
        var gift = /(discord\.(gift)|discordapp\.com\/gift)\/.+[a-z]/
        var url = gift.exec(message.content);
        if (!url) {
            return;
        }
        var gcode = link[0].split('/')[1];
        var time = new Date() - start;
        phin({
            method: 'POST',
            url: `https://discordapp.com/api/v6/entitlements/gift-codes/${gcode}/redeem`,
            headers: {
                'Authorization': token
            }
        }).then(
            () => {
                console.log(`[${getDateTime()}] | Claimed Nitro from ${message.author.tag} in ${ct} | ${time}`);
            }
        ).catch(ex => console.log(`[${getDateTime()}] | Unknown code from ${message.author.tag} in ${ct} | ${time}ms`));
    }
})

//Commands
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.author.id != client.user.id) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.delete();
        message.channel.createMessage('Pong');
    } else if (command === 'clap') {
        message.delete();
        if (!args[0]) {
            message.channel.createMessage(`Usage: ${config.prefix}heart <text>`);
        } else {
            let Message = args.join(" 👏 ");
            message.channel.createMessage(Message);
        }
    } else if (command === 'avatar') { //yes
        message.delete();
        let mmember = message.mentions[0];
        if (!mmember) mmember = client.user;
        const avatar = mmember.avatarURL;
        console.log(command + ` was used on user: ${mmember}!`);
        if (client.code_blocks.active) {
            message.channel.createMessage(avatar);
        } else {
            const embed = new Eris.RichEmbed()
                .setTitle(mmember.username + "'s Avatar")
                .setImage(avatar)
                .setFooter(`Simple Selfbot - Windex.js`)

            message.channel.createMessage({
                embed: embed
            }).then(async x => {
                await delay(Embedtime);
                return x.delete();
            })
        }
    }
});

//Stop Crashing
process.on("unhandledRejection", (err) => {
    return logger.warning(`Got an unhandled Rejection: ${err}`)
});
process.on("uncaughtException", (err) => {
    return logger.warning(`Got an unhandled Exception: ${err}`)
});