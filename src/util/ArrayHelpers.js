import { GetSingleMixerGame, GetSingleTwitchGame, GetTwitchStreamsV2 } from './Api';
import { StringStripper } from './StringHelpers';

export const ConsolidateGameListsV2 = async (twitchGames, mixerGames) => {
    // The list that will be returned
    const responseList = [];

    if (twitchGames && mixerGames) {
        // Take the top 24 games from Twitch and Mixer, and convert them into our object formats
        let customTwitchGames = CustomGameInfoBuilder(twitchGames, 'twitch');
        let customMixerGames = CustomGameInfoBuilder(mixerGames, 'mixer');

        let consolidatedGameList = [];

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

        const gamesWithoutTwitchViewers = consolidatedGameList.filter(game => game.twitchViewers === 0 && game.twitchGameId !== '');
        let twitchStreamsForGamePromises = [];

        // Build a list of promises to send and get top 100 streams for all the games without Twitch viewer numbers
        gamesWithoutTwitchViewers.forEach(game => {
            twitchStreamsForGamePromises.push(GetTwitchStreamsV2(game.twitchGameId));
        });

        const twitchStreamsForGame = await Promise.all(twitchStreamsForGamePromises);

         // Go through each game without Twitch viewers, get its top streams, then total viewers from those streams
        twitchStreamsForGame.forEach(game => {
            // If the game has at least 1 Twitch stream, try match a promise result with a game missing Twitch viewers
            if (game && game[0]) {
                let matchedGame = gamesWithoutTwitchViewers.find(gameWithoutViewers => gameWithoutViewers.twitchGameId.toString() === game[0].game_id);

                if (matchedGame) {
                    // Total up the viewers from all the streams returned
                    const totalTwitchViewers = GetTotalTwitchViewersFromStreams(game);

                    matchedGame.twitchViewers = totalTwitchViewers;
                    matchedGame.totalViewers += totalTwitchViewers;
                }
            }
        });

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
    }

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
            usingTwitchImage: false,
            twitchGameId: '',
            mixerGameId: '',
            gameOrigin: type,
            matched: false,
        };

        if (type === 'twitch') {
            // This is to deal with the different format of games from search
            const gameOrigin = game.game ? game.game : game;

            customGameInfo.name = gameOrigin.name;
            customGameInfo.image = gameOrigin.box.large;
            customGameInfo.twitchViewers = game.viewers ? game.viewers : 0;
            customGameInfo.totalViewers = game.viewers ? game.viewers : 0;
            customGameInfo.usingTwitchImage = true;
            customGameInfo.twitchGameId = gameOrigin._id;
        }

        if (type === 'mixer') {
            customGameInfo.name = game.name;
            customGameInfo.image = game.coverUrl;
            customGameInfo.mixerViewers = game.viewersCurrent;
            customGameInfo.totalViewers = game.viewersCurrent;
            customGameInfo.mixerGameId = game.id;
        }

        // Only add games with viewers
        if (customGameInfo.totalViewers > -1) {
            customGameInfoList.push(customGameInfo);
        }
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
                    match.twitchGameId = responseItem.games[0]._id;
                    match.usingTwitchImage = true;
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
        name: '',
        logo: '',
        image: '',
        viewers: 0,
        type: '',
    }

    for (let i = 0; i < twitchStreams.length; i++) {
        streamObj = {};
        streamObj = {
            name: twitchStreams[i].channel.display_name,
            logo: twitchStreams[i].channel.logo,
            image: twitchStreams[i].preview.template.replace('{width}', '640').replace('{height}', '360'),
            url: twitchStreams[i].channel.url,
            viewers: twitchStreams[i].viewers,
            type: 'twitch',
        }

        consolidatedStreamList.push(streamObj);
    };

    for (let i = 0; i < mixerStreams.length; i++) {
        streamObj = {};
        streamObj = {
            name: mixerStreams[i].user.username,
            logo: mixerStreams[i].user.avatarUrl,
            image: 'https://thumbs.mixer.com/channel/' + mixerStreams[i].id + '.small.jpg',
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

// Use the top 100 Twitch streams for the game to estimate total viewers
const GetTotalTwitchViewersFromStreams = (streams) => {
    if (!streams) {
        return 0;
    }

    let totalViewers = 0;

    streams.forEach(stream => {
        totalViewers += stream.viewer_count;
    });

    return totalViewers;
}