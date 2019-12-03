import { GetSingleMixerGame, GetSingleTwitchGame } from './Api';
import { StringStripper } from './StringHelpers';
export const ConsolidateGameListsV2 = async (twitchGames, mixerGames) => {
    let consolidatedGameList = [];

    // Take the top 24 games from Twitch and Mixer, and convert them into our object formats
    let customTwitchGames = CustomGameInfoBuilder(twitchGames, 'twitch');
    
    let customMixerGames = CustomGameInfoBuilder(mixerGames, 'mixer');

    // Concat them into 1 new array
    consolidatedGameList = consolidatedGameList.concat(customTwitchGames).concat(customMixerGames);

    consolidatedGameList.forEach(game => {
        // Try to match Twitch and Mixer games in the array
        if (!game.matched && game.gameOrigin === 'twitch') {
            let matches = consolidatedGameList.filter(x => {
                return x.name.toLowerCase() === game.name.toLowerCase() && x.gameOrigin === 'mixer';
            });

            if (matches.length === 0) {
                matches = consolidatedGameList.filter(x => {
                    return StringStripper(x.name.toLowerCase()) === StringStripper(game.name.toLowerCase()) && x.gameOrigin === 'mixer';
                });
            }

            if (matches.length > 0) {
                game.mixerGameId = matches[0].mixerGameId;
                matches.forEach(match => {
                    
                    game.mixerViewers += match.mixerViewers;
                    game.totalViewers += match.mixerViewers;

                    // Set the matched Mixer games status
                    match.matched = true;
                });

                // Set the matched Twitch games status
                game.matched = true;
            }
        }
    });

    let unmatchedGames = consolidatedGameList.filter(game => !game.matched);
    let twitchMatchPromises = [];
    let mixerMatchPromises = [];

    // For each remaining unmatched game, add a promise to try fetch it from an API
    for (let i = 0; i < unmatchedGames.length; i++) {
        if (unmatchedGames[i].gameOrigin === 'twitch') {
            mixerMatchPromises.push(GetSingleMixerGame(unmatchedGames[i].name));
        }

        if (unmatchedGames[i].gameOrigin === 'mixer') {
            twitchMatchPromises.push(GetSingleTwitchGame(unmatchedGames[i].name));
        }
    }

    await GetTwitchGamePromises(twitchMatchPromises, unmatchedGames, false);
    await GetMixerGamePromises(mixerMatchPromises, unmatchedGames);

    // Update the unmatched games list after doing the first round of API matches
    unmatchedGames = consolidatedGameList.filter(game => !game.matched);

    // Find any remaining unmatched games that contain colons in their names
    let unmatchedGamesPunctuation = unmatchedGames.filter(game => !game.matched && game.name.split('').includes(':'));

    twitchMatchPromises = [];

    // For each remaining unmatched game, add a promise to try fetch it from the API
    unmatchedGamesPunctuation.forEach(game => {
        twitchMatchPromises.push(GetSingleTwitchGame(game.name.replace(':', '')));
    });

    await GetTwitchGamePromises(twitchMatchPromises, unmatchedGamesPunctuation, true);

    // The list that will be returned
    const responseList = [];

    // Build up a list of unique games, favouring Twitch versions of duplicates
    consolidatedGameList.forEach(game => {
        if (consolidatedGameList.filter(x => StringStripper(x.name) === StringStripper(game.name)).length === 1) {
            responseList.push(game);
        }
        else if (consolidatedGameList.filter(x => StringStripper(x.name) === StringStripper(game.name)).length > 1 && game.gameOrigin === 'twitch') {
            responseList.push(game);
        }
    });

    // Sort list by total viewers from high to low
    responseList.sort((a, b) => (a.totalViewers < b.totalViewers) ? 1 : -1);

    return responseList;
}

// Takes Twitch and Mixer games arrays and converts them into our custom game objects
const CustomGameInfoBuilder = (gameList, type) => {
    const customGameInfoList = [];

    gameList.forEach(game => {
        let customGameInfo = {
            name: '',
            image: '',
            twitchViewers: 0,
            mixerViewers: 0,
            totalViewers: 0,
            usingTwitchImage: true,
            mixerGameId: '',
            gameOrigin: type,
            matched: false,
        };

        if (type === 'twitch') {
            customGameInfo.name = game.game.name;
            customGameInfo.image = game.game.box.large;
            customGameInfo.twitchViewers = game.game.popularity;
            customGameInfo.totalViewers = game.game.popularity;
        }

        if (type === 'mixer') {
            customGameInfo.name = game.name;
            customGameInfo.image = game.coverUrl;
            customGameInfo.mixerViewers = game.viewersCurrent;
            customGameInfo.totalViewers = game.viewersCurrent;
            customGameInfo.mixerGameId = game.id;
        }
        customGameInfoList.push(customGameInfo);
    });

    return customGameInfoList;
}

const GetTwitchGamePromises = async (twitchMatchPromises, unmatchedGames, colonCheck) => {
    await Promise.all(twitchMatchPromises).then((res) => {
        res.forEach(responseItem => {
            // If a Twitch game with a matching name was returned from the API
            if (responseItem.games) {
                let match = null;

                // Find an unmatched game with a name equal to the name of the first game returned
                if (colonCheck) {
                    match = unmatchedGames.find(x => x.name.replace(':', '').toLowerCase() === responseItem.games[0].name.replace(':', '').toLowerCase());
                }
                else {
                    match = unmatchedGames.find(x => x.name.toLowerCase() === responseItem.games[0].name.toLowerCase());
                }

                // If a match was found, update the values of the unmatched game, which also updates consolidatedGameList
                if (match) {
                    match.image = responseItem.games[0].box.large;
                    match.twitchViewers += responseItem.games[0].popularity;
                    match.totalViewers += responseItem.games[0].popularity;
                    match.matched = true;
                }
            }
        });
    });
}

const GetMixerGamePromises = async (mixerMatchPromises, unmatchedGames) => {
    await Promise.all(mixerMatchPromises).then((res) => {
        res.forEach(responseItem => {
            // If a Mixer game with a matching name was returned from the API
            if (responseItem.length > 0) {
                // Find an unmatched game with a name equal to the name of the first game returned
                let match = unmatchedGames.find(x => x.name.toLowerCase() === responseItem[0].name.toLowerCase());

                if (match) {
                    match.mixerGameId = responseItem[0].id;
                    match.mixerViewers += responseItem[0].viewersCurrent;
                    match.totalViewers += responseItem[0].viewersCurrent;
                    match.matched = true;
                }
            }
        });
    });
}


// Consolidate the game objects returned from different API's
export const ConsolidateStreamLists = async (twitchStreams, mixerStreams) => {
    let consolidatedStreamList = [];
    let streamObj = {
        name: 'N/A',
        image: '',
        viewers: 0,
        type: '',
    }

    for (let i = 0; i < twitchStreams.length; i++) {
        streamObj = {};
        streamObj = {
            name: twitchStreams[i].channel.name,
            image: twitchStreams[i].preview.template.replace('{width}','380').replace('{height}','200'),
            url: twitchStreams[i].channel.url,
            viewers: twitchStreams[i].viewers,
            type: 'twitch',
        }
        consolidatedStreamList.push(streamObj);
    };

    // Loop through Mixer games to look for any games not included in top Twitch games
    for (let i = 0; i < mixerStreams.length; i++) {
        streamObj = {};
        streamObj = {
            name: mixerStreams[i].name,
            image: 'https://thumbs.mixer.com/channel/'+ mixerStreams[i].id+'.small.jpg',
            url: 'https://mixer.com/' + mixerStreams[i].id,
            viewers: mixerStreams[i].viewersCurrent,
            type: 'mixer',
            streamerName: mixerStreams[i].token
        }
        mixerStreams[i].viewers = mixerStreams[i].viewersCurrent;
        consolidatedStreamList.push(streamObj);
    }
    

    // Sort the array by total viewers, then get the top 24 games from the consolidated list
    consolidatedStreamList.sort((a, b) => (a.viewers < b.viewers) ? 1 : -1);
    consolidatedStreamList = consolidatedStreamList.slice(0, 24);
    return consolidatedStreamList;
}