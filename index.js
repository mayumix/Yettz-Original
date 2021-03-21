const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

const ms = require("parse-ms");
const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const client = new Discord.Client(); //Criação de um novo Client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos

client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token

client.on("message", message => {
     if (message.author.bot) return;
     if (message.channel.type == "dm") return;
     if (!message.content.toLowerCase().startsWith(config.prefix)) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    console.error("Erro:" + err);
  }
});

client.on("ready", () => {
  let activities = [
      `❔ Duvidas use ${config.prefix}ajuda para saber meus comandos ❔`,
      `❤ Estou em ${client.guilds.cache.size} servidores! ❤`,
      `🐶 Sou fofinho né gente! 🐶`,
      `👮 Vendo ${client.users.cache.size} membros!👮`,
      `⛔ Algum problema ou bug? ${config.prefix}pedir |⛔`,
      `🛡 Protegendo ${client.channels.cache.size} canais! 🛡`
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "STREAMING"
      }), 1000 * 10); 
  client.user
      .setStatus("dnd")
      .catch(console.error);
console.log("Estou Online!")
});

client.on("message", message => {
if(message.author.bot) return;
if(message.content == `<@!${client.user.id}>` || message.content == `<@${client.user.id}>`) return message.channel.send(`Ola ${message.author} Estou em atualização para nova versão ${config.prefix}`)
});

client.on("guildCreate", function(guild){ 
  
  var channel = client.channels.cache.get("821408714945855531");
  const msg = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(`${client.user.username} está em um novo servidor.`)
    .setDescription(`**Nome: \`${guild.name}\`\nID: \`${guild.id}\`\nMembros: \`${guild.memberCount}\`\nTotal de servidores: \`${client.guilds.cache.size}\`**`)
    .setTimestamp()
  channel.send(msg);
});

client.on("guildDelete", function(guild){ 
  
  var channel = client.channels.cache.get("821408752669294643");
  const msg = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(`${client.user.username} saiu de um servidor.`)
    .setDescription(`**Nome: \`${guild.name}\`\nID: \`${guild.id}\`\nMembros: \`${guild.memberCount}\`\nTotal de servidores: \`${client.guilds.cache.size}\`**`)
    .setTimestamp()
  channel.send(msg);
});

const moment = require("moment");

client.on("guildMemberAdd", async member => {
  const timeAccount = moment(new Date()).diff(member.user.createdAt, "days");
  const minimumDays = 1;

  if (timeAccount < minimumDays) {
    await member.ban();
  }
});

const Enmap = require("enmap");
const fs = require("fs");

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`carregando ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.on('message', message => {

        const botprefix = 'y!'; 

    const messageArray = message.content.split(' ');
    const args = messageArray.slice(1);
    let reason = args.slice(0).join(' ');
    trimStr = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

    if (message.guild) {


        if (message.content.startsWith(`${botprefix}afk`)) {

            const nick = message.member.nickname;
            if (nick && nick.startsWith('[AFK]')) {
                message.member.setNickname(message.member.displayName.replace('[AFK]', ''))
                message.reply("Bem vindo de volta! Retirei seu afk.");
            } else {
                const newNickname = trimStr(`[AFK] ${message.author.username}`);

                message.member.setNickname(newNickname).catch(err => {
                    const errorEmbed = new Discord.MessageEmbed()
                        .setTitle(err)
                        .setDescription(`${message.author}, Não posso setar seu nome :/`)
                        .addField('Possible Reasons\n\n', `\nHierarquia - Seu cargo é maior que o meu!\nDono - Você é dono do servidor!\nSem permissão - Você não tem a permissão:\`MANAGE_NICKNAMES\`\n\n**Resolva os problemas para funcionar!** `)
                        .setColor('BLUE')

                    return message.channel.send(errorEmbed)
                });
                if (!reason) return message.reply(`Você está no modo afk agora, Motivo: **Sem motivo** | Use ${botprefix}af⁹k novamente para retirar isso!`)
                message.reply(`Você está no modo afk agora, Motivo: **${reason}** | use ${botprefix}afk novamente para retirar!`);
            }
        };
    };
});