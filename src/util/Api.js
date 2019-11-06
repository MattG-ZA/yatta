// ----- Twitch API's -----

// Get top 20 Twitch streams
export const GetTwitchStreams = () => {
    return fetch('https://api.twitch.tv/kraken/streams?limit=20', {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'qxrshse6o00vgsl28hjlkyvlu28r89',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then((json) => {
            // console.log('Twitch Streams: ', json);
            return json.streams;
        });
}

// Get top 24 Twitch games
export const GetTwitchGames = () => {
    return fetch('https://api.twitch.tv/kraken/games/top?limit=25', {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'qxrshse6o00vgsl28hjlkyvlu28r89',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then((json) => {
            // console.log('Twitch Games: ', json);
            return json.top;
        });
}

// Get a single Twitch game based on game name
export const GetSingleTwitchGame = (gameName) => {
    return fetch(`https://api.twitch.tv/kraken/search/games?query=${gameName}`, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'qxrshse6o00vgsl28hjlkyvlu28r89',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then((json) => {
            // console.log('Single Twitch Game: ', gameName, json);
            return json;
        });
}

// ----- Mixer API's -----

// Get top Mixer streams
export const GetMixerStreams = () => {
    return fetch('https://mixer.com/api/v1/channels')
        .then(response => response.json())
        .then((json) => {
            // console.log('Mixer Streams: ', json);
            return json;
        });
}

// Get top 24 Mixer games
export const GetMixerGames = () => {
    return fetch('https://mixer.com/api/v1/types?order=viewersCurrent:DESC&limit=24')
        .then(response => response.json())
        .then((json) => {
            // console.log('Mixer Games: ', json);
            return json;
        });
}

// Get a single Mixer game based on game name
export const GetSingleMixerGame = (gameName) => {
    return fetch(`https://mixer.com/api/v1/types?where=name:eq:${gameName}`)
        .then(response => response.json())
        .then((json) => {
            // console.log('Single Mixer Game: ', gameName, json);
            return json;
        });
}