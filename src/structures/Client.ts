import '../lib/setup';
import { SapphireClient, LogLevel } from '@sapphire/framework';
import { LavalinkHandler } from './Music/LavalinkHandler';
import { Queue } from './Music/Queue';
import { SlashCommandStore } from './SlashCommands/SlashCommandStore';

export class MusicBotClient extends SapphireClient {
	lavalink: LavalinkHandler;
	queue: Queue;
	constructor() {
		super({
			defaultPrefix: process.env.PREFIX,
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Debug
			},
			shards: 'auto',
			intents: [
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_VOICE_STATES',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS'
			]
		});

		this.validate();

		this.lavalink = new LavalinkHandler(this);
		this.queue = new Queue(this);
		this.stores.register(new SlashCommandStore());
	}

	private validate() {
		if (!process.env.DISCORD_TOKEN) {
			throw new Error('A Valid Discord bot token must be provided!');
		}

		if (!process.env.PREFIX) {
			throw new Error('A prefix for the bot must be provided!');
		}

		if (!process.env.OWNERS) {
			throw new Error('A owner/s ID must be specified!');
		}

		if (!process.env.LAVALINK_HOST) {
			throw new Error("A Lavalink node's host must be specified!");
		}

		if (!process.env.LAVALINK_PORT) {
			throw new Error("A Lavalink node's port must be specified!");
		}

		if (!process.env.LAVALINK_PASSWD) {
			throw new Error("A Lavalink node's password must be specified!");
		}
	}

	public async main() {
		try {
			this.logger.info('Logging in...');

			await this.login();
			this.logger.info('Logged in!');
		} catch (error) {
			this.logger.fatal(error);
			this.destroy();
			process.exit(1);
		}
	}
}
