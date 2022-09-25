const follows = document.getElementById("follows");
const views = document.getElementById("views");
const total = document.getElementById("total");
const partners = document.getElementById("partners");
const modChannels = document.getElementById("modChannels");

function format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

fetch("https://modlookup.3v.fi/api/user-totals/spikelk7").then(response => response.json()).then(data => {
    modlookup.innerHTML =
    `
    <div class="modlookup main">
        <table>
        <tr>
            <td>Follow total: <a>${format(data.follows)}</a></td>
            <td>Views total: <a>${format(data.views)}</a></td>
        </tr>
        <tr>
            <td>Channels: <a>${format(data.total)}</a></td>
            <td>Partners: <a>${format(data.partners)}</a></td>
        </tr>
        </table>
    </div>
    `;
});

fetch("https://modlookup.3v.fi/api/user-v3/spikelk7").then(response => response.json()).then(data => {
    let channels = data.channels.map(res => res);
    let channelsList = "?login=spikelk7";
    for (const channel of channels) {
        if (channel.followers > 500) {
            channelsList += `%2C${channel.name}`;
        }
    }
    fetch(`https://api.ivr.fi/v2/twitch/user${channelsList}`).then(response => response.json()).then(request => {
        let data = request.sort((x, y) => Number(y.followers) - Number(x.followers));
        for (const channel of data) {
            if (channel.login && channel.login !== "spikelk7") {
                let islive = ``;
                if (channel.stream) {
                    islive = `<br><a style="padding-top: 10px; color: #FA6E02;" href="https://www.twitch.tv/directory/game/${encodeURIComponent(channel.stream.game.displayName)}/"target="_blank">${channel.stream.game.displayName}</a> - <i style="color: ${channel.chatColor};">${format(channel.stream.viewersCount)}</i> - <i>${channel.stream.title}</i>`;
                }
                let badges = ``;
                if (channel.roles.isPartner) {
                    badges = `<img style="vertical-align: middle; border-radius: 5px;" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3" width="19" height="19"> `
                }
                modChannels.innerHTML += 
                `
                    <div class="line">
                    <img class="logo" src="${channel.logo}">
                    ${badges}
                    <a style="color: ${channel.chatColor ? channel.chatColor : "#123456"};" href="https://www.twitch.tv/${encodeURIComponent(channel.login)}/" target="_blank" rel="noopener noreferrer">
                    <text class="channel-name">${channel.displayName ? channel.displayName : channel.login}</text>
                    </a>
                    <i class="followers"> ~${format(channel.followers)}</i>
                    ${islive}
                    </div>
                `;
              
            }
        }
    })
});