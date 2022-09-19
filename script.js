const follows = document.getElementById("follows");
const views = document.getElementById("views");
const total = document.getElementById("total");
const partners = document.getElementById("partners");
const modlookup = document.getElementById("channels");

function format(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

fetch("https://modlookup.3v.fi/api/user-totals/spikelk7").then(response => response.json()).then(data => {
    follows.innerText = format(data.follows);
    views.innerText = format(data.views);
    total.innerText = format(data.total);
    partners.innerText = format(data.partners);
});

fetch("https://modlookup.3v.fi/api/user-v3/spikelk7").then(response => response.json()).then(data => {
    let channels = data.channels.map(res => res);
    let channelsList = "?login=spikelk7";
    for (const channel of channels) {
        if (channel.followers > 400) {
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
                modlookup.innerHTML += `<p><img style="vertical-align: middle; border-radius: 25px; position: relative; right: 4px;" src="${channel.logo}" width="28" height="28">${badges} <span style="vertical-align: middle"><a style="color: ${channel.chatColor};" href="https://www.twitch.tv/${encodeURIComponent(channel.login)}/"target="_blank">${channel.displayName ? channel.displayName : channel.login}</a> ~ ${format(channel.followers)} Follower<sa> Views ~  ${format(channel.profileViewCount)}</sa><br>${islive}</p>`;
              
            }
        }
    })
});