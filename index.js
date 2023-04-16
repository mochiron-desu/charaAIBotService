const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const CharacterAI = require('node_characterai');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds]
});

const characterAI = new CharacterAI();
const characterID = process.env['CHARA_ID']

async function sendMessage(characterAI, characterAI, query) {
    await characterAI.authenticateWithToken(process.env['CHARA_TOKEN'])
    const chat = await characterAI.createOrContinueChat(characterID);
    const response = await chat.sendAndAwaitResponse(query, true)
    console.table(response);
    return response.text
}

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    (async () => {
        if(!characterAI.isAuthenticated()){
            await characterAI.authenticateWithToken(process.env['CHARA_TOKEN'])
        }
        
        const chat = await characterAI.createOrContinueChat(characterID);
        const response = await chat.sendAndAwaitResponse(message.content, true)
        console.table(response);
        message.reply(response.text)
    })();


})
client.login(process.env['DISCORD_TOKEN']);