import { Twitter } from './twitter';
import { Feed } from './feed';

const twitterKey = 'E0IHMTTkUWw3JQSQ1otgcufXa';
const twitterSecret = '2WVmWT4gLQgGew918Lm75xmqvCEKZuQBIGb4MrlLnGBI1Vzrru';

const sheetKey = '1iduaoQnAKvlUsN9tquJ8PGvD8B9eqhXR3tuWMO-f8kY';

const twitter = new Twitter(twitterKey, twitterSecret);

declare var global: any;

global.index = () => {
  Logger.log('start index');
  try {
    Logger.log('get sheets');
    const sheets = SpreadsheetApp.openById(sheetKey).getSheets();
    Logger.log('get new feeds');
    const feedsList = sheets.map(sheet => Feed.getNewFeeds(sheet));
    feedsList.forEach(feeds =>
      feeds.forEach(feed => twitter.postUpdateStatus(feed.toShortString()))
    );
  } catch (e) {
    Logger.log(e);
  }
};

global.auth=()=>{
    Logger.log('auth');
}

global.authCallback = request => {
  Logger.log('auth callback');
  twitter.authCallback(request);
};
