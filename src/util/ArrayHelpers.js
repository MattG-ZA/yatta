import { GetSingleMixerGame, GetSingleTwitchGame } from './Api';
import { StringStripper } from './StringHelpers';

// Consolidate the game objects returned from different API's
export const ConsolidateGameLists = async (twitchGames, mixerGames, limit) => {
    let consolidatedGameList = [];

    for (let i = 0; i < twitchGames.length; i++) {
        let customGameInfo = {
            name: twitchGames[i].game.name,
            image: twitchGames[i].game.box.large,
            twitchViewers: twitchGames[i].game.popularity,
            mixerViewers: 0,
            totalViewers: 0,
            usingTwitchImage: true,
        };

        // Find a Mixer game from the fetched Mixer games list that matches the current Twitch game
        let mixerMatch = mixerGames.filter(game => game.name === customGameInfo.name);

        // If no matching game was found, strip strings and try again
        if (mixerMatch.length === 0) {
            mixerMatch = mixerGames.filter(game => StringStripper(game.name) === StringStripper(customGameInfo.name));
        }

        // If the game was still not found in the fetched list
        if (mixerMatch.length === 0) {
            // Call the API to get the info for the specific game
            mixerMatch = await GetSingleMixerGame(customGameInfo.name);
        }

        if (mixerMatch.length > 0) {
            // Total the viewers from all matching games
            mixerMatch.forEach(game => {
                if (game.name === customGameInfo.name || StringStripper(game.name) === StringStripper(customGameInfo.name)) {
                    customGameInfo.mixerViewers += game.viewersCurrent;
                }
            });
        }

        customGameInfo.totalViewers = customGameInfo.twitchViewers + customGameInfo.mixerViewers;

        consolidatedGameList.push(customGameInfo);
    };

    // Loop through Mixer games to look for any games not included in top Twitch games
    for (let i = 0; i < mixerGames.length; i++) {
        if (!consolidatedGameList.find(game => game.name === mixerGames[i].name)) {
            // Call the API to get the info for the specific game from Twitch
            const twitchGameData = await GetSingleTwitchGame(mixerGames[i].name);

            let twitchViewers = 0;
            let twitchImage = null;

            // If the game was found, check that the name matches exactly
            if (twitchGameData.games) {
                if (twitchGameData.games[0].name === mixerGames[i].name) {
                    twitchViewers = twitchGameData.games[0].popularity;
                    twitchImage = twitchGameData.games[0].box.large;
                }
            }

            consolidatedGameList.push({
                name: mixerGames[i].name,
                image: twitchImage ? twitchImage : mixerGames[i].coverUrl,
                twitchViewers,
                mixerViewers: mixerGames[i].viewersCurrent,
                totalViewers: mixerGames[i].viewersCurrent + twitchViewers,
                usingTwitchImage: twitchImage ? true : false,
            });
        }
    }

    // Sort the array by total viewers, then get the top games from the consolidated list
    consolidatedGameList.sort((a, b) => (a.totalViewers < b.totalViewers) ? 1 : -1);
    consolidatedGameList = consolidatedGameList.slice(0, limit);

    return consolidatedGameList;
}

export const ConsolidateGameListsV2 = async (twitchGames, mixerGames, limit) => {
    let consolidatedGameList = [];

    let customTwitchGames = CustomGameInfoBuilder(twitchGames, 'twitch');
    let customMixerGames = CustomGameInfoBuilder(mixerGames, 'mixer');

    consolidatedGameList = consolidatedGameList.concat(customTwitchGames).concat(customMixerGames);

    consolidatedGameList.forEach(game => {
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
                matches.forEach(match => {
                    game.mixerViewers += match.mixerViewers;
                    game.totalViewers += match.mixerViewers;

                    match.matched = true;
                });

                game.matched = true;
            }
        }
    });

    let unmatchedGames = consolidatedGameList.filter(game => !game.matched);
    let twitchMatchPromises = [];
    let mixerMatchPromises = [];

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

    let unmatchedGamesPunctuation = consolidatedGameList.filter(game => !game.matched && game.name.split('').includes(':'));

    twitchMatchPromises = [];

    unmatchedGamesPunctuation.forEach(game => {
        twitchMatchPromises.push(GetSingleTwitchGame(game.name.replace(':', '')));
    });

    await GetTwitchGamePromises(twitchMatchPromises, unmatchedGamesPunctuation, true);

    const matchedGames = consolidatedGameList.filter(game => game.matched);
    unmatchedGames = consolidatedGameList.filter(game => !game.matched);
  
    console.log('matchedGames ', matchedGames);
    console.log('unmatchedGames ', unmatchedGames);
    console.log('consolidatedGameList ', consolidatedGameList);
    console.log('-----');

    return consolidatedGameList;
}

const CustomGameInfoBuilder = (gameList, type) => {
    const customGameInfoList = [];

    gameList.forEach(game => {
        let customGameInfo = {
            name: '',
            image: '',
            twitchViewers: 0,
            mixerViewers: 0,
            totalViewers: 0,
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
        }

        customGameInfoList.push(customGameInfo);
    });

    return customGameInfoList;
}

const GetTwitchGamePromises = async (twitchMatchPromises, unmatchedGames, colonCheck) => {
    await Promise.all(twitchMatchPromises).then((res) => {
        res.forEach(game => {
            if (game.games) {
                let match = unmatchedGames.find(x => x.name.toLowerCase() === game.games[0].name.toLowerCase());

                if (colonCheck) {
                    match = unmatchedGames.find(x => x.name.replace(':', '').toLowerCase() === game.games[0].name.replace(':', '').toLowerCase());
                }

                if (match) {
                    match.twitchViewers += game.games[0].popularity;
                    match.totalViewers += game.games[0].popularity;
                    match.matched = true;
                }
            }
        });
    });
}

const GetMixerGamePromises = async (mixerMatchPromises, unmatchedGames) => {
    await Promise.all(mixerMatchPromises).then((res) => {
        res.forEach(game => {
            if (game.length > 0) {
                let match = unmatchedGames.find(x => x.name.toLowerCase() === game[0].name.toLowerCase());

                if (match) {
                    match.mixerViewers += game[0].viewersCurrent;
                    match.totalViewers += game[0].viewersCurrent;
                    match.matched = true;
                }
            }
        });
    });
}