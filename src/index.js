require('dotenv').config();

const { Client, IntentsBitField, EmbedBuilder, GuildMember } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});


client.on("ready", (client) => {
    console.log(`${client.user.username} is ready for work? ✅`)
})



const ActionTypes = {
    AutoModerationAction: 24,
    Call: 3,
    ChannelFollowAdd: 12,
    ChannelIconChange: 5,
    ChannelNameChange: 4,
    ChannelPinnedMessage: 6,
    ChatInputCommand: 20,
    ContextMenuCommand: 23,
    Default: 0,
    GuildApplicationPremiumSubscription: 32,
    GuildBoost: 8,
    GuildBoostTier1: 9,
    GuildBoostTier2: 10,
    GuildBoostTier3: 11,
    GuildDiscoveryDisqualified: 14,
    GuildDiscoveryGracePeriodFinalWarning: 17,
    GuildDiscoveryGracePeriodInitialWarning: 16,
    GuildDiscoveryRequalified: 15,
    GuildInviteReminder: 22,
    InteractionPremiumUpsell: 26,
    RecipientAdd: 1,
    RecipientRemove: 2,
    Reply: 19,
    RoleSubscriptionPurchase: 25,
    StageEnd: 28,
    StageRaiseHand: 30,
    StageSpeaker: 29,
    StageStart: 27,
    StageTopic: 31,
    ThreadCreated: 18,
    ThreadStarterMessage: 21,
    UserJoin: 7,
};


var channelNameIncludes;
var desiredChannel;
client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const guild = message.guild;
    // console.log(message.type, message.content, message.author)
    switch (message.type) {
        case ActionTypes.UserJoin:
            // channelNameIncludes = 'welcome';
            // desiredChannel = guild.channels.cache.find((channel) =>
            //     channel.name.toLowerCase().includes(channelNameIncludes)
            // );
            // console.log(message.author.globalName)
            // desiredChannel.send({ embeds: [getWelcomeResponse(message)] })
            break;
        case ActionTypes.Default:
            if (message.content == "testWelcomeEmbed") {
                channelNameIncludes = 'welcome';
                desiredChannel = guild.channels.cache.find((channel) =>
                    channel.name.toLowerCase().includes(channelNameIncludes)
                );
                console.log(message.author.globalName)
                desiredChannel.send({ embeds: [getWelcomeResponse(message)] })
            } else if (message.content == "testBotInfoAsClient") {
                console.log(client)

            }

            break;

    }


})



client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction.commandName)
    switch (interaction.commandName) {
        case 'ping':
            interaction.reply(`🏓pong! ${Math.abs(Date.now() - interaction.createdTimestamp)}ms`);
            break;
        case 'about':
            interaction.reply({ embeds: [getAboutResponse()], files: ['./src/assets/about-thumbnail.png', './src/assets/logo.png'] })
            break;
        case 'sustainability':
            interaction.reply({ embeds: [getSustainabilityResponse()], files: ['./src/assets/sustainability.png', './src/assets/logo.png'] })
            break;
        case 'getroute':
            let destination = interaction.options.get("destination").value;
            let from = interaction.options.get("from").value;
            let to = interaction.options.get("to").value;
            let budget = interaction.options.get("budget").value;
            let interests = interaction.options.get("interests").value;

            interaction.reply({ embeds: [getRouteResponse(destination, budget, from, to, interests)] })
            break;

    }

});

client.on('guildMemberAdd', (member) => {

    const guild = member.guild;

    channelNameIncludes = 'welcome';
    desiredChannel = guild.channels.cache.find((channel) =>
        channel.name.toLowerCase().includes(channelNameIncludes)
    );
    console.log(`${member.user.globalName} Just joined`)
    desiredChannel.send({ embeds: [getWelcomeResponse(member)] })
});

client.on('guildMemberRemove', (member) => {
    console.log("leave\n\n\n\n", member)

    const guild = member.guild;

    channelNameIncludes = 'welcome';
    desiredChannel = guild.channels.cache.find((channel) =>
        channel.name.toLowerCase().includes(channelNameIncludes)
    );
    console.log(`${member.user.globalName} Just left`)
    desiredChannel.send({ embeds: [getLeaveResponse(member)] })

})

function getRouteResponse(destination, cost, from, to, interests) {
    let embed = new EmbedBuilder()
        .setTitle(`${destination} Tour Details`)
        .setDescription(`Experience the beauty and excitement of ${destination}!`)
        .setColor("#1dff00")
        .addFields(
            {
                name: "Cost",
                value: `$${cost}`,
            },
            {
                name: "Date",
                value: `${from} to ${to}`,
            },
            {
                name: "Interests",
                value: `${interests}`,
            },
        )
    return embed
}

function getWelcomeResponse(member) {
    const embed = new EmbedBuilder()
        .setTitle(`Greetings, ${member.user.globalName}!\nWelcome to ${member.guild.name}.`)
        .setDescription(`You are the ${member.guild.memberCount}th member!\nI'm Biliki AI, here to assist you in the exciting journey of trip planning.`)
        .setColor('#1dff00')
        .setThumbnail(member.user.displayAvatarURL())

    return embed
}

function getLeaveResponse(member) {

    const embed = new EmbedBuilder()
        .setTitle(`Farewell, ${member.user.globalName}!`)
        .setDescription(`We'll miss you at ${member.guild.name}. If your travels bring you back, we'll be here. Safe journey!`)
        .setColor('#FF2D00')
        .setThumbnail(member.user.displayAvatarURL())

    return embed


}

function getAboutResponse() {
    const bilikiAITitle = `**Embark on a Transformative Journey with Biliki.AI!** 🌍`
    const bilikiAIDescription = `Discover the world effortlessly with our AI-powered travel planner, designed to simplify your travel dreams.\n🌿 Personalized itineraries and eco-conscious recommendations await you!\n\n**Key Features:**\n- Personalized Itineraries 🗺️\n- Eco-Conscious Travel Recommendations 🌿\n- Unforgettable Adventures Guaranteed! 🌟\n\n🌐 - [Plan your trip now](https://biliki.ai/)\n\nJoin us in making a positive impact on the environment while creating lasting travel memories. 🌎 **#SustainableTravel** **#BilikiAI**`;


    const embed = new EmbedBuilder()
        .setTitle(bilikiAITitle)
        .setDescription(bilikiAIDescription)
        .setColor('#1dff00')
        .setImage('attachment://about-thumbnail.png')
        .setThumbnail('attachment://logo.png')

    return embed
}

function getSustainabilityResponse() {
    const bilikiAITitle = `**Eco-Conscious Explorers: Journeying Towards Sustainable Travel 🌱**`
    const bilikiAIDescription = `**Mission:** 
    Empowering travelers to make sustainable choices at every step of their journey.
    
    **What We Offer:**

    🗺 **Destination Insights:** Discover eco-friendly destinations for mindful exploration.

    🌍 **Carbon Footprint Tips:** Learn how to minimize your travel impact on the environment.

    🌱 **Sustainable Discussions:** Engage in conversations about eco-conscious accommodations, transportation, and more.

    🤝 **Connect & Collaborate:** Join fellow travelers who are passionate about responsible exploration.

    
    Embark on a journey with us towards a more sustainable and harmonious world. Every traveler can make a difference!`;


    const embed = new EmbedBuilder()
        .setTitle(bilikiAITitle)
        .setDescription(bilikiAIDescription)
        .setColor('#1dff00')
        .setImage('attachment://sustainability.png')
        .setThumbnail('attachment://logo.png')

    return embed
}







client.login(process.env.TOKEN);