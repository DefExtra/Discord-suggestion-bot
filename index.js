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
const data    = new db.QuickDB({filePath:__dirname+"/def.sqlite"})
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
        {name:"suggestion-logs",description:"add logs for any suggestion",type:1},
        {name:"send-suggestion",description:"send a suggestion to suggestions channel",type:1},
        {name:"get-user-suggestions",description:"get suggestions of any user",type:1,options:[
            {name:"user",description:"the user you will get the suggestion from",required:true,type:6}
        ]},
        {name:"my-suggestions",description:"view all your suggestions and edit them",type:1,options:[
            {name:"message_id",description:"id of the message you won't edit",required:false,type:3}
        ]}
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
            {content:"You need more permissions to use **`"+interaction.commandName+"`** command.",ephemeral:true}
        )
        let channel = interaction.channelId;
        let  value   = {channel:channel}
        let   key   = "SuggestionsChannel_"+interaction.guild?.id;

        if ((await (data.get(key)))) {
            interaction.reply(
                {content:"This is a suggestion channel.",ephemeral:true}
            )
        }

        else {
            await data.set(key, value)
            interaction.reply(
                {content:"<#"+channel+"> has set as suggestion channel on **"+interaction.guild?.name+"**.",ephemeral:true}
            )
        }
    }
    else if (interaction.commandName == "suggestion-logs") {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return interaction.reply(
            {content:"you need some permissions to allow you using **`"+interaction.commandName+"`** command.",ephemeral:true}
        )
        let channel = interaction.channelId;
        let  value   = {channel:channel}
        let   key   = "SuggestionsLogsChannel_"+interaction.guild?.id;
        
        if ((await (data.get(key)))?.channel == channel) {
            await data.delete(key)
            interaction.reply(
                {content:"Logs channel has been removed.",ephemeral:true}
            )
        }

        else {
            await data.set(key, value);
            interaction.reply(
                {content:"<#"+channel+"> has set as Logs channel on **"+interaction.guild?.name+"**.",ephemeral:true}
            )
        }
    }
    else if (interaction.commandName == "remove-suggestion-channel") {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return interaction.reply(
            {content:"you need some permissions to allow you using **`"+interaction.commandName+"`** command.",ephemeral:true}
        )
        let key     = "SuggestionsChannel_"+interaction.guild?.id;
        
        if ((await (data.get(key)))) {
            await data.delete(key)
            interaction.reply(
                {content:"Suggestion channel has been removed.",ephemeral:true}
            )
        }

        else {
            interaction.reply(
                {content:"There are no suggestion channel.",ephemeral:true}
            )
        }
    }
    else if (interaction.commandName == "get-user-suggestions") {
        let  userInfos  = interaction.options.getUser("user",true);
        let   userKey   = "Suggestions_"+interaction.guild.id+"_"+userInfos.id.toString()+".sugs";
        let    udata    = await data.get(userKey);

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
        .setTitle('type you suggestion down below:')
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
    else if (interaction.commandName == "my-suggestions") {
        let  messageId  = interaction.options.getString("message_id");
        let   userKey   = "Suggestions_"+interaction.guild.id+"_"+interaction.user.id.toString()+".sugs";
        let    udata    = await data.get(userKey);
        if (!messageId) {
            if (udata == null) return interaction.reply(
                {content:"you have no suggestion on **"+interaction.guild?.name+"**.",ephemeral:true}
            )
            else {
                let calSugs = await udata.map((message, index) => `${index + 1}. [go to suggestion message](${message.url}) (${message.url.split("https://discord.com/channels/"+interaction.guild.id+"/").join("").split("/")[1]})\n\`\`\`\n${message.content}\`\`\``).join("\n\n");
                interaction.reply(
                    {content:calSugs,ephemeral:true}
                )
            }
        }

        else {
            let key     = "SuggestionsChannel_"+interaction.guild?.id;
        
            if (await (await data.get(key))?.channel) {
                let c = interaction.guild.channels.cache.get(await (await data.get(key))?.channel);
                try {
                let m = await c.messages.fetch(messageId);

                await interaction.reply({content: "How we can help u??",components: [
                    new Discord.MessageActionRow()
                      .addComponents(
                        new Discord.MessageButton()
                        .setCustomId("delete")
                        .setStyle("DANGER")
                        .setLabel("🗑️ Remove"),
                        new Discord.MessageButton()
                        .setCustomId("edit")
                        .setStyle("SECONDARY")
                        .setLabel("🖍️ Edit")
                      )
                ],ephemeral:true});
                interaction.channel.createMessageComponentCollector({
                    componentType: "BUTTON",
                    filter: (u) => u.user.id == interaction.user.id,
                    max: 1
                }).on("collect", async(s) => {
                    interaction.editReply({content:"Thank u for chooseing us <3",components:[]})
                    if (s.customId == "delete") {
                        let u = interaction.guild.members.cache.find(o => o.user.username == m.embeds[0].author.name);

                        let     userKey     = "Suggestions_"+interaction.guild?.id+"_"+u.id+".sugs";
                        let       key2      = messageId.toString();
                        let      data32     = await data.get(userKey);
                        let       newD      = []
                        data32.forEach(async(d) => {
                        if (d.content !== m.embeds[0].description) {
                            newD.push({
                                url: d.url,
                                content: d.content
                                })
                            }
                        });
                        setTimeout(async() => {
                            await data.set(userKey, newD);
                            await data.delete(key2);
                            if (m && m.deletable) m.delete();
                        }, 6574)
                    } else {
                        
                    }
                })
                } catch (err) {
                    interaction.channel.send(`\`\`\`\n${err}\`\`\``)
                }
            } else interaction.reply("error ??: suggestion channel not here?")
        }
    }
    
});

// respond for modals
client.on('modalSubmit', async (modal) => {
    if (modal.customId == 'send') {
      let         key         = "SuggestionsChannel_"+modal.guild?.id;
      let         res         = modal.getTextInputValue('input');
      let        value        = await data.get(key)?.channel
      let       channel       = client.channels.cache.get(value);

      if (!channel) return modal.reply(
        {content:'Sorry! I can not find the suggestion channel in this server',ephemeral:true}
      );

      modal.reply(
        {content:'Done! Your suggestion has been sent successfully, suggestion:```\n'+res+'```',ephemeral:true}
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
            .setLabel("❓ Who Voted"),
          )
        ]
    }).then(async message => {
        
        let dataConstructor = {url:message.url.toString(),content:res}
        let     userKey     = "Suggestions_"+modal.guild?.id+"_"+modal.user.id.toString()+".sugs";
        let      udata      = await data.get(userKey)
        let      value      = {voters: [],votersInfo: []}
        let       key       = message.id.toString()

        if (udata == null) await data.set(userKey, [dataConstructor]);
        else await data.push(userKey, dataConstructor)

        await data.set(key, value);
        
      });
    }  
  });

// message event
client.on("messageCreate", async(msg) => {
    if (msg.author.bot) {
        if (msg.components[0]?.components[0]?.customId !== "up") return;

        let   key   = "SuggestionsLogsChannel_"+msg.guild?.id;
        let  data2  = await data.get(key);

        let channel = msg.guild.channels.cache.get(data2?.channel);
        if (!channel) return;

        if (channel.isText()) channel.send({
            content: "new **Suggestion** here: "+msg.url,
            embeds: [
                {
                    color: "YELLOW",
                    description: `**\`\`\`\n${msg.embeds[0].description}\`\`\`**\nBy: @${msg.embeds[0].author.name}`,
                    footer: {text:"At:"},
                    timestamp: msg.embeds[0].timestamp,
                }
            ],
            components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("remove_"+msg.id)
                .setStyle("DANGER")
                .setLabel("🗑️ Remove"),
            )
            ]
        })
    }
    else {
        if (!msg.guild?.id) return;

        let          key        = "SuggestionsChannel_"+msg.guild?.id;
        let         guild       = msg.guild
        let        channel      = msg.channel;
        let       msgAuthor     = msg.author;
        let      rawEContent    = msg["content"]
        let data2 = await data.get(key);
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
                .setLabel("❓ Who Voted"),
            )
            ]
        }).then(async message => {
            
            let dataConstructor = {url:message.url.toString(),content:rawEContent}
            let     userKey     = "Suggestions_"+msg.guild.id+"_"+msg.author.id.toString()+".sugs";
            let      udata      = await data.get(userKey)
            let      value      = {voters: [],votersInfo: []}
            let       key       = message.id.toString()

            if (udata == null) await data.set(userKey, [dataConstructor]);
            else await data.push(userKey, dataConstructor)

            await data.set(key, value);
            
        });
    }
})
/**
 * 
 * @param {Discord.ButtonInteraction} interaction 
 */
async function buttons(interaction) {
    await interaction.deferUpdate().catch(() => {})
    if (interaction.customId.startsWith("remove_")) {
        let id      = interaction.customId.split("remove_").join("");
        let key     = "SuggestionsChannel_"+interaction.guild?.id;
        
        if (await (await data.get(key))?.channel) {
            
            let c = interaction.guild.channels.cache.get(await (await data.get(key))?.channel);
            if (c.isText()) {
                interaction.message.edit({content:"Suggestion has removed.",embeds:[],components:[]})
                try {
                let m = await c.messages.fetch(id);
                
                // trying to get the user
                let u = interaction.guild.members.cache.find(o => o.user.username == m.embeds[0].author.name);
                if (u) u.send({
                    content: "your suggestion in **"+interaction.guild.name+"** has removed by admins..."
                }).catch(() => {});
  
                let     userKey     = "Suggestions_"+interaction.guild?.id+"_"+u.id+".sugs";
                let       key2      = id.toString();
                let      data32     = await data.get(userKey);
                let       newD      = []
                data32.forEach(async(d) => {
                if (d.content !== m.embeds[0].description) {
                    newD.push({
                        url: d.url,
                        content: d.content
                        })
                    }
                });
                setTimeout(async() => {
                    await data.set(userKey, newD);
                    await data.delete(key2);
                    if (m && m.deletable) m.delete();
                }, 6574)
              } catch {}
            }
        }
    }

    else {
        switch (interaction.customId) {
            case "up": {
                let   message   = interaction.message;
                let    embed    = message.embeds[0];
                let    dater    = new Date().getTime(); //`${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDay()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                let     key     = message.id.toString()+".voters";
                let     ke2     = message.id.toString()+".votersInfo";
                let    value    = {user:interaction.user,date: dater}
                let  newNumber  = Number(embed.fields[0].value.split("```\n")[1].split("```")[0]) + 1;
                let    voter    = await data.get(message.id.toString()).voters;
                if (voter.includes(interaction.user.id)) return interaction.followUp({content:"You have voted for this suggestion before.", ephemeral:true});
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
                let    dater    = new Date().getTime(); //`${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDay()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                let     key     = message.id.toString()+".voters";
                let     ke2     = message.id.toString()+".votersInfo";
                let    value    = {user:interaction.user,date: dater}
                let  newNumber  = Number(embed.fields[1].value.split("```\n")[1].split("```")[0]) + 1;
                let    voter    = await data.get(message.id.toString()).voters;
                if (voter.includes(interaction.user.id)) return interaction.followUp({content:"You have voted for this suggestion before.", ephemeral:true});
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
                let   voters   = await data.get(interaction.message.id.toString()).votersInfo;
                let    raws    = voters.map((voter, index) => `${index + 1}. ${voter.user.username} - <t:${
                    require("moment")(voter.date).unix()}:R>`).join("\n")

                if (!raws) return interaction.followUp({content:"There are no voters", ephemeral:true}); 

                interaction.followUp({content:raws, ephemeral:true}); 
            }
            break;
            default:
                break;
        }
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