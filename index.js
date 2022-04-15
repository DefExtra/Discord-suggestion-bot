// |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
// |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
// |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|

// did you see casperMusic? chack out: https://discord.gg/ws9jA2cR5s

/**
   ⚠️ stop right there ⚠️

   did you know you are stealing my project when you remove the copyright?
   you can just contact me http://discord.com/users/933856726770413578 for publish it
   or if you are using it for your server know the no one will see the copyrights only you in the project
   so why you are removing it?, be nice and just leave it


   |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
   |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
   |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
 */

// imports
const Discord = require("discord.js");
const modals  = require("discord-modals");
const ora     = require("ora");
const chalk   = require("chalk");
const db      = require("quick.db");
const fs      = require("node:fs");

// constructors
const data    = new db.table("suggestion_def")
const client  = new Discord.Client({
   intents: 32767 
});
modals(client);

// ready event and slash commands reg
client.on("ready", () => {
    let _ = ora("Processing Clients...").start();
    setTimeout(() => _.color = "yellow", 430)
    setTimeout(() => _.succeed("Client has logged in as "+chalk.red.bold(client.user.username)),1200)
    let commands = [
        {name:"set-suggestion-channel",description:"set the suggestions channel",type:1},
        {name:"remove-suggestion-channel",description:"remove the suggestions channel",type:1},
        {name:"send-suggestion",description:"send a suggestion to suggestions channel",type:1},
        {name:"get-user-suggestions",description:"get suggestions of any user",type:1,options:[
            {name:"user",description:"the user you will get the suggestion from",required:true,type:6}
        ]},
    ];
    client.application.commands.set(commands)
}).login(fs.readFileSync(__dirname+"/token.txt", {encoding:"utf-8"}));

// interactionDetected event
client.on("interactionCreate", async(interaction) => {
    // some condetions
    if (interaction.isButton()) return await buttons(interaction);
    if (
        !interaction.isCommand()
        || 
        !interaction.guild?.id
        ||
        !interaction.user
        ||
        interaction.channel.type == "DM"
        ||
        !interaction.guild.me.permissionsIn(interaction.channel)
        .has(Discord.Permissions.FLAGS.SEND_MESSAGES)
       )
    return;
    if (interaction.commandName == "set-suggestion-channel") {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return interaction.reply(
            {content:"you need some permissions to allow you using **`"+interaction.commandName+"`** command.",ephemeral:true}
        )
        let channel = interaction.channelId;
        let  value   = {channel:channel}
        let   key   = "SuggestionsChannel_"+interaction.guild?.id;

        data.set(key, value)
        interaction.reply(
            {content:"<#"+channel+"> has set as suggestion channel on **"+interaction.guild?.name+"**.",ephemeral:true}
        )
    }
    else if (interaction.commandName == "remove-suggestion-channel") {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return interaction.reply(
            {content:"you need some permissions to allow you using **`"+interaction.commandName+"`** command.",ephemeral:true}
        )
        let key     = "SuggestionsChannel_"+interaction.guild?.id;

        data.delete(key)
        interaction.reply(
            {content:"suggestion channel has been rested.",ephemeral:true}
        )
    }
    else if (interaction.commandName == "get-user-suggestions") {
        let  userInfos  = interaction.options.getUser("user",true);
        let   userKey   = "Suggestions_"+interaction.guild.id+"_"+userInfos.id.toString()+".sugs";
        let    udata    = data.fetch(userKey);

        if (udata == null) return interaction.reply(
            {content:"<@"+userInfos.id+"> has no suggestion on **"+interaction.guild?.name+"**.",ephemeral:true}
        )
        else {
            let calSugs = await udata.map((message, index) => `${index + 1}. [go to suggestion message](${message.url})\n\`\`\`\n${message.content}\`\`\``).join("\n\n");
            interaction.reply(
                {content:calSugs,ephemeral:true}
            )
        }
    }
    else if (interaction.commandName == "send-suggestion") {
        const modal = new modals.Modal()
        .setCustomId('send')
        .setTitle('type you suggestion down blow:')
        .addComponents(
          new modals.TextInputComponent()
            .setCustomId('input')
            .setLabel('Some text Here')
            .setStyle('LONG')
            .setMinLength(3)
            .setMaxLength(1024)
            .setPlaceholder('write the suggestion here!.')
            .setRequired(true)
        );

        let modalData = await modals.showModal(modal, {
            client: client,
            interaction: interaction
        });
        modalData;
    }
});

// respond for modals
client.on('modalSubmit', async (modal) => {
    if (modal.customId == 'send') {
      let         key         = "SuggestionsChannel_"+modal.guild?.id;
      let         res         = modal.getTextInputValue('input');
      let        value        = data.fetch(key)?.channel
      let       channel       = client.channels.cache.get(value);

      if (!channel) return modal.reply(
        {content:'Soory! i can not find the suggestion channel in this server',ephemeral:true}
      );

      modal.reply(
        {content:'Done! your suggestion has been send successfully, you suggestion:```\n'+res+'```',ephemeral:true}
      );
      channel.send({
        embeds: [
            {author:{
                name: modal.user.username,
                iconURL: modal.user.avatarURL({dynamic:true})
            },color:0x2c2f33,timestamp: new Date(),footer:{
                iconURL: modal.guild?.iconURL({dynamic:true}),
                text: modal.guild?.name
            },description:res,fields:[
                {name:"👍 Up votes:",value:"```\n0```",inline:true},
                {name:"👎 Down votes:",value:"```\n0```",inline:true},
            ]}
        ],
        components: [
        new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
            .setCustomId("up")
            .setStyle("DANGER")
            .setLabel("👍 Up"),
            new Discord.MessageButton()
            .setCustomId("down")
            .setStyle("DANGER")
            .setLabel("👎 Down"),
            new Discord.MessageButton()
            .setCustomId("info")
            .setStyle("SECONDARY")
            .setLabel("❓ How Voted"),
          )
        ]
    }).then(async message => {
        
        let dataConstructor = {url:message.url.toString(),content:res}
        let     userKey     = "Suggestions_"+modal.guild?.id+"_"+modal.user.id.toString()+".sugs";
        let      udata      = data.fetch(userKey)
        let      value      = {voters: [],votersInfo: []}
        let       key       = message.id.toString()

        if (udata == null) await data.set(userKey, [dataConstructor]);
        else await data.push(userKey, dataConstructor)

        data.set(key, value);
        
      });
    }  
  });

// message event
client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    if (!msg.guild?.id) return;

    let          key        = "SuggestionsChannel_"+msg.guild?.id;
    let         guild       = msg.guild
    let        channel      = msg.channel;
    let       msgAuthor     = msg.author;
    let      rawEContent    = msg["content"]
    let data2 = data.fetch(key);
    if (data2 == null) return;

    if (msg.channelId !== data2.channel) return;
    if (msg.deletable) msg.delete();
    
    channel.send({
        embeds: [
            {author:{
                name: msgAuthor.username,
                iconURL: msgAuthor.avatarURL({dynamic:true})
            },color:0x2c2f33,timestamp: new Date(),footer:{
                iconURL: guild.iconURL({dynamic:true}),
                text: guild.name
            },description:rawEContent,fields:[
                {name:"👍 Up votes:",value:"```\n0```",inline:true},
                {name:"👎 Down votes:",value:"```\n0```",inline:true},
            ]}
        ],
        components: [
        new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
            .setCustomId("up")
            .setStyle("DANGER")
            .setLabel("👍 Up"),
            new Discord.MessageButton()
            .setCustomId("down")
            .setStyle("DANGER")
            .setLabel("👎 Down"),
            new Discord.MessageButton()
            .setCustomId("info")
            .setStyle("SECONDARY")
            .setLabel("❓ How Voted"),
          )
        ]
    }).then(async message => {
        
        let dataConstructor = {url:message.url.toString(),content:rawEContent}
        let     userKey     = "Suggestions_"+msg.guild.id+"_"+msg.author.id.toString()+".sugs";
        let      udata      = data.fetch(userKey)
        let      value      = {voters: [],votersInfo: []}
        let       key       = message.id.toString()

        if (udata == null) await data.set(userKey, [dataConstructor]);
        else await data.push(userKey, dataConstructor)

        data.set(key, value);
        
    });
})
/**
 * 
 * @param {Discord.ButtonInteraction} interaction 
 */
async function buttons(interaction) {
    await interaction.deferUpdate().catch(() => {})
    switch (interaction.customId) {
        case "up": {
            let   message   = interaction.message;
            let    embed    = message.embeds[0];
            let    dater    = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDay()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
            let     key     = message.id.toString()+".voters";
            let     ke2     = message.id.toString()+".votersInfo";
            let    value    = {user:interaction.user,date: dater}
            let  newNumber  = Number(embed.fields[0].value.split("```\n")[1].split("```")[0]) + 1;
            let    voter   = data.fetch(message.id.toString()).voters;
            if (voter.includes(interaction.user.id)) return interaction.followUp({content:"you has voted for this suggestion befor.", ephemeral:true});
            let editedEmbed = {author:embed.author,color:embed.color,timestamp: embed.timestamp,footer:embed.footer,
                description:embed.description,fields:[
                {name:"👍 Up votes:",value:`\`\`\`\n${newNumber}\`\`\``,inline:true},
                embed.fields[1],
            ]}
            await data.push(key, interaction.user.id);
            await data.push(ke2, value)
            message.edit({components: message.components,embeds: [editedEmbed]})
        }
        break;

        case "down": {
            let   message   = interaction.message;
            let    embed    = message.embeds[0];
            let    dater    = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDay()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
            let     key     = message.id.toString()+".voters";
            let     ke2     = message.id.toString()+".votersInfo";
            let    value    = {user:interaction.user,date: dater}
            let  newNumber  = Number(embed.fields[1].value.split("```\n")[1].split("```")[0]) + 1;
            let    voter   = data.fetch(message.id.toString()).voters;
            if (voter.includes(interaction.user.id)) return interaction.followUp({content:"you has voted for this suggestion befor.", ephemeral:true});
            let editedEmbed = {author:embed.author,color:embed.color,timestamp: embed.timestamp,footer:embed.footer,
                description:embed.description,fields:[
                embed.fields[0],
                {name:"👎 Down votes:",value:`\`\`\`\n${newNumber}\`\`\``,inline:true},
            ]}
            await data.push(key, interaction.user.id);
            await data.push(ke2, value)
            message.edit({components: message.components,embeds: [editedEmbed]})
        }
        break;
    
        case "info": {
            let   voters   = data.fetch(interaction.message.id.toString()).votersInfo;
            let    raws    = voters.map((voter, index) => `${index + 1}. ${voter.user.username} - ${voter.date}`).join("\n")

            if (voters == []) return interaction.followUp({content:"there is no voters", ephemeral:true}); 

            interaction.followUp({content:raws, ephemeral:true}); 
        }
        break;
        default:
            break;
    }
}

/**
   ⚠️ stop right there ⚠️

   did you know you are stealing my project when you remove the copyright?
   you can just contact me http://discord.com/users/933856726770413578 for publish it
   or if you are using it for your server know the no one will see the copyrights only you in the project
   so why you are removing it?, be nice and just leave it


   |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
   |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
   |****  ⚠️ ALL COPYRIGHTS GOSE TO DEF(http://discord.com/users/933856726770413578) ⚠️  ****|
 */