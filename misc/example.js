const { Intents, Client } = require('discord.js')
const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice')
const play = require('play-dl')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES],
    partials: ['CHANNEL', 'MESSAGE']
})
const token = "OTM4MDgxNTExOTcyOTI5NTc3.YflGfQ.w5362OR8hNlgWDrbPLRXxPsDtZ8";

client.on('messageCreate', async message => {
    
    if (message.content.startsWith('!play')) {
        
        // if (!message.member.voice?.channel) return message.channel.send('Connect to a Voice Channel')
        
        const connection = joinVoiceChannel({
            channelId: "938100003677810729",
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })

        
        let args = message.content.split('play')[1]

        let yt_info = await play.search(args, {
            limit: 1
        })

        console.log(yt_info[0].thumbnails.url);
        console.log(yt_info[0].thumbnails[0].url);
        
        let stream = await play.stream(yt_info[0].url)
        
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })

        player.play(resource)

        connection.subscribe(player)
    }
})

client.on('ready', () => {
    console.log(`We have logged in as ${client.user.tag}!`)
})

client.login(token);