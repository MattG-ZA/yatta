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