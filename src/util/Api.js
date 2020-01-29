// ----- Twitch API's -----

// Get top 20 Twitch streams
export const GetTwitchStreams = (gameName) => {
    return fetch(`https://api.twitch.tv/kraken/streams?game=${gameName}&limit=25`, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'qxrshse6o00vgsl28hjlkyvlu28r89',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then((json) => {
            console.log('API - Twitch Streams: ', json);
            return json.streams;
        });
}

// Get top Twitch games
export const GetTwitchGames = (limit, offset, firstLoad) => {
    return fetch(`https://api.twitch.tv/kraken/games/top?limit=${firstLoad ? limit + 1 : limit}&offset=${offset}`, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'qxrshse6o00vgsl28hjlkyvlu28r89',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then((json) => {
            // console.log('API - Twitch Games: ', json);
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
            // console.log('API - Single Twitch Game: ', gameName, json);
            return json;
        });
}

// ----- Mixer API's -----

// Get top Mixer streams
export const GetMixerStreams = (gameId) => {
    console.log('gameName',gameId);
    const url = `https://mixer.com/api/v1/channels?where=typeId:eq:${gameId}&order=viewersCurrent:DESC&limit=24`;
    console.log('call made => ', url);
    return fetch(url)
        .then(response => response.json())
        .then((json) => {
            // console.log('API - Mixer Streams: ', json);
            return json;
        });
}

// Get top Mixer games
export const GetMixerGames = (limit, page) => {
    return fetch(`https://mixer.com/api/v1/types?order=viewersCurrent:DESC&limit=${limit}&page=${page}`)
        .then(response => response.json())
        .then((json) => {
            // console.log('API - Mixer Games: ', json);
            return json;
        });
}

// Get a single Mixer game based on game name
export const GetSingleMixerGame = (gameName) => {
    return fetch(`https://mixer.com/api/v1/types?where=name:eq:${gameName}`)
        .then(response => response.json())
        .then((json) => {
            // console.log('API - Single Mixer Game: ', gameName, json);
            return json;
        });
}

// Get Mixer games from list based on game names separated by semi-solons
export const GetMixerGamesByName = (gameNameList) => {
    return fetch(`https://mixer.com/api/v1/types?where=name:in:${gameNameList}`)
        .then(response => response.json())
        .then((json) => {
            // console.log('API - Mixer Games By Name: ', gameNameList, json);
            return json;
        });
}