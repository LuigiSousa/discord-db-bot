const { Client, GatewayIntentBits, DMChannel } = require('discord.js');
const User = require('./models/user');
const { EmbedBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const mongoose = require('mongoose');

config();
const token = process.env.LUIGI_TOKEN;
const channel = process.env.LUIGI_CHANNEL
const db_url = process.env.LUIGI_DB
const log = process.env.LUIGI_LOG

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
})

client.on("ready", () => {
    console.log("Luigi is ready!")
})

client.on("messageCreate", async (message) => {
    if (message.channelId !== channel) return
    if (message.author.bot) return
    
    const user = new User({
        name: message.author.username,
        message: message.content
    })

    console.log('New User: ', user)

    await user.save()
    console.log('User Saved!')

    message.reply({
        embeds: [
            new EmbedBuilder({
                title: "Your message has been added to the database ✅",
                description: "Message: " + message.content + "\n\nThank you for your contribution!",
                color: 0x00ff00
            })
        ]
    })

    const author = message.author
    author.createDM()
        .then(DMChannel => {
            DMChannel.send({
                embeds: [
                    new EmbedBuilder({
                        title: "Your message has been added to the database ✅",
                        description: "Message: " + message.content + "\n\nThank you for your contribution!",
                        color: 0x00ff00
                    })
                ]
            })
            console.log('DM Sent!')
        })
        .catch(console.error)

    const log_channel = client.channels.cache.get(log)
    log_channel.send({
        embeds: [
            new EmbedBuilder({
                title: "New Message added to the database! ✅",
                description: "User: " + message.author.username + "\nMessage: " + message.content,
                color: 0x00ff00
            })
        ]
    })
    console.log('Log Sent!')
})

client.login(token)