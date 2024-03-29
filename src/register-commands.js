require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: "ping",
        description: "ping",
    },
    {
        name: 'about',
        description: 'about Biliki AI',
    },
    {
        name: 'sustainability',
        description: 'sustainability',
    },
    {
        name: "getroute",
        description: "gives biliki AI route",
        options: [
            {
                name: "destination",
                description: "destinaton",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "interests",
                description: "interests (seperated by spaces)",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "from",
                description: "start date (YYYY-MM-DD)",
                type: ApplicationCommandOptionType.String,
                required: true,

            },
            {
                name: "to",
                description: "end date (YYYY-MM-DD)",
                type: ApplicationCommandOptionType.String,
                required: true,

            },
            {
                name: "budget",
                description: "Budget ($)",
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const guildIds = [process.env.GUILD_ID, process.env.GUILD_ID2];

(async () => {
    console.log("registering");
    try {
        for (const guildId of guildIds) {
            console.log(`Registering commands for guild: ${guildId}`);
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands },
            );
        }
        console.log("done!");
    } catch (error) {
        console.log("err:", error);
    }
})();