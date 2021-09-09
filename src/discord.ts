import { Client, DMChannel, Intents, Interaction, Message } from 'discord.js';
import { ProfitTrailer } from "./profitTrailer";

export class Discord {
    private pt: ProfitTrailer;
    private client: Client;
    private mainChannel: DMChannel;

    constructor(profitTrailer: ProfitTrailer) {
        this.pt = profitTrailer;
    }

    async start() {
        if (this.pt?.settings?.DISCORD_TOKEN_1 !== '') {
            console.info('Starting discord bot');
            this.client = new Client({
                intents: [
                    Intents.FLAGS.GUILDS,
                    Intents.FLAGS.DIRECT_MESSAGES,
                    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                    Intents.FLAGS.GUILD_MESSAGES,
                    Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
            });
            this.client.once('ready', this.handleDiscordClientReady);
            this.client.on('interactionCreate', (interaction: Interaction) => {
                console.info('interaction', interaction);
            });
            await this.client.login(this.pt.settings.DISCORD_TOKEN_1);

            this.client.on('messageCreate', this.handleMessage);
        }
    }

    handleMessage = (message: Message) => {
        if (message.author.id !== this.client.user.id) {
            switch (message.content.toLowerCase()) {
                case 'ping':
                    message.reply('pong');
                    break;
            }
        }
    }

    handleDiscordClientReady = () => {
        console.info('discord ready!');
        this.client.channels.cache.each((channel: any) => {
            if (channel.name === this.pt.settings.DISCORD_CHANNEL_1) {
                this.mainChannel = channel;
                this.mainChannel.send('hi')
            }
        });
    }
}