import './createPost.js';
import { Devvit, RedisClient, useState, useWebView } from '@devvit/public-api';
//import { useEffect } from 'react';
import type { DevvitMessage, WebViewMessage } from './message.js';
import { JishoUtil } from './util/jishoUtil.js'; // Import the JishoUtil class for fetching words
import RedisUtil from './util/redisUtil.js';
import { Word } from './util/word.js';

let redisWords: Word[][]; //[][]
console.log('Devvit is running!');
// Test fetching words for the kanji '食' (or any kanji you want)

Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

// Devvit.addSchedulerJob({
//   name: 'refreshRedisBoard',
//   onRun: async (event, context) => {
//      const leaderboard = 
//   },
// });

// Add a custom post type to Devvit

/*async function fetchKanjiData(kanji: string): Promise<void> {
  const url = `https://jisho.org/api/v1/search/words?keyword=${kanji}`;

  try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Jisho API Response:", data); // Logs the raw API response

      // Store the raw response in a variable (or in a database)
      const storedData = data; // This is where you store it for later use
  } catch (error) {
      console.error("Error fetching from Jisho API:", error);
  }
}*/

/*async function fetchKanjiWords(kanji: string, context: RedisClient) {
  try {
    // Fetch words containing the kanji
    //const words = await JishoUtil.getWordsContaining(kanji);

    //RedisUtil.setWords(context, words);
    //redisWords = await RedisUtil.getWords(context);
    //redisWords = words;
   // redisWords= new Word[][];

    // Log the results to the console for testing
    /*console.log(`Words containing "${kanji}":`);
    words.forEach((word) => {
      console.log(`English Definition: ${word.getEnglish()}`);
      console.log(`Japanese Word: ${word.getJapanese()}`);
    });
    fetchKanjiData(kanji);
  } catch (error) {
    console.error("Error fetching kanji words:", error);
  }
}*/




Devvit.addCustomPostType({
  name: 'sushisushi',
  height: 'tall',
  render: (context) => {
    redisWords=[];

      redisWords[0]= [
        new Word(['Hi', 'hello'], "こにちは")
      ];
      
      //console.log(redisWords[0][0].getEnglish()); // Output: [ 'hi', 'hello' ]
      //console.log(redisWords[0][0].getJapanese()); // Output: "こんにちは"  
    //fetchKanjiWords("食", context.redis); // You can change this to any kanji you want to test

    const [newPage, change] = useState('home.html'); // Use state for page switches

    const [leaderboard, setLeaderboard] =  useState<Array<{member: string; score: number}>>([]);

    const [username, setUsername] = useState(async () => {
      return await context.reddit.getCurrentUsername();
    });

    /*useEffect(() => {
      const fetchUsername = async () => {
        try{
        const currUsername = await context.reddit.getCurrentUsername;
        setUsername(currUsername);
        }
      catch (error){
        console.error("Failed to fetch userrname", error);
        }
      };

      fetchUsername();
    },[]);*/



    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: newPage, // URL of your web view content

      // Handle messages sent from the web view
      async onMessage(message, webView) {
        switch(message.type){
          // case 'page':
          //   webView.postMessage({
          //     type: ''
          // })
          // case 'boardPageLoaded':
          // going to make this case happen on load later
          case 'fetchLeaderboard':
            const highScore = await context.redis.zScore("leaderboard", username);
            const currRank = await context.redis.zRank("leaderboard", username, {WITHSCORE: true});
            const currLeaderboardLength = await context.redis.zCard("leaderboard");
            const currLeaderboard = await context.redis.zRange("leaderboard", currLeaderboardLength - 100, currLeaderboardLength - 1, {BY: 'SCORE', WITHSCORES: true});

            try {

              const leaderboardWithScores = await Promise.all(
                currLeaderboard.map(async (player) => ({
                  username: player.member,
                  score: player.score,
                }))
              )

              if (currRank < currLeaderboardLength - 99)
              {
                const newEntry = {
                  username: username,
                  score: highScore,
                }
                setLeaderboard([newEntry,...leaderboardWithScores]);
              }
              else
              {
                setLeaderboard(leaderboardWithScores);
              }  
                            
              webView.postMessage({
                type: 'updateLeaderboard',
                data: {leaderboard: leaderboard, rank: currLeaderboardLength - currRank},
              })

            } catch(error){
              console.log(error);
            }
            break;
            
          //going to make this case happen when player completes a game
          case 'addBoardEntry':
            for(let i = 0; i < message.data.length; i++)
            {
              await context.redis.zAdd("leaderboard", message.data[i]);
            }
            break;

          case 'removeBoardEntry':
            await context.redis.zRemByRangeByScore("leaderboard", 0, 200);
            break;
            

          case 'initialDataRequested':
            webView.postMessage({
              type: 'initialDataRecieved',
              data: {username: username, words: redisWords}, 
            })
            break;

          default:
            throw new Error('Unknown Message Type');
            break;
        }
        
      },
      onUnmount() {
        context.ui.showToast('Web view closed!');
      },
    });
    //
    // function switchPage(newPage: string) {
    //   change(newPage); // Update the state
    //   webView.mount(); // Mount the web view to load the new page
    // }

    // Function to handle page switching
      /*const handlePageSwitch = (newPage: string) => {
      setSwitchPage(newPage); // Update the state
      console.log(newPage);
      //webView.mount();
      //console.log('after' + newPage);

      //printing works correctly but not the webview its delayed
      
    };*/

    /*useEffect(()=>{
      webView.mount();
      console.log('after ' + switchPage);
    }, [switchPage]);*/

    // Render the custom post type
    return (
      <vstack height="100%" width="100%" alignment="center" gap="small" backgroundColor="#333445">
        <hstack height="25%" width="100%" alignment="top center" />

        <hstack height="30%" width="100%" alignment="top center">
          <image
            url="home.png"
            description="itadaki"
            imageHeight={30}
            imageWidth={256}
            height="100px"
            width="500px"
          />

        </hstack>

        <hstack height="20%" width="100%" alignment="top center">
          <button
           appearance='bordered'
           onPress={() => webView.mount()}>
              Play Game
            </button>
        </hstack>
    

       {/* <hstack height="42%" width="100%" alignment="top center" gap="none">
          <image
            onPress={() => handlePageSwitch('rapid.html')} // Use the handler to switch pages
            url="rapid.png"
            description="rapid"
            imageHeight={30}
            imageWidth={380}
            height="170px"
            width="280px"
          />
          <image
            onPress={() => handlePageSwitch('daily.html')} // Use the handler to switch pages
            url="daily.png"
            description="daily"
            imageHeight={30}
            imageWidth={380}
            height="170px"
            width="280px"
          />
        </hstack>

        <hstack height="12%" width="100%" alignment="top center" gap="none">
          <image
            onPress={() => handlePageSwitch('leaderboard.html')} // Use the handler to switch pages
            url="leaderboard.png"
            description="leaderboard"
            imageHeight={30}
            imageWidth={380}
            height="50px"
            width="400px"
          />
        </hstack>

        <hstack height="12%" width="100%" alignment="top center" gap="none">
          <image
            onPress={() => handlePageSwitch('howTo.html')} // Use the handler to switch pages
            url="howto.png"
            description="how to"
            imageHeight={30}
            imageWidth={380}
            height="50px"
            width="400px"
          />
        </hstack>*/}
      </vstack>
    );
  },
});

export default Devvit;
