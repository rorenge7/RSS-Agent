import { TwitterService } from './twitter';
import { Feed } from './feed';
import { RssSheetService } from './rss-sheet';
import { sendHttpPost } from './request';

const props = PropertiesService.getScriptProperties();
const twitterKey = props.getProperty('TWITTER_KEY');
const twitterSecret = props.getProperty('TWITTER_SECRET');
const sheetKey = props.getProperty('SHEET_KEY');
const logUrl = props.getProperty('LOG_URL');

declare var global: any;

global.index = () => {
  Logger.log('start index');
  try {
    if (!twitterKey || !twitterSecret) {
      throw new Error('twitter key or secret is null');
    }
    if (!sheetKey) {
      throw new Error('sheet key is null');
    }
    const twitter = TwitterService.getService(twitterKey, twitterSecret);
    Logger.log('get sheets');
    const sheets = SpreadsheetApp.openById(sheetKey).getSheets();
    Logger.log('get new feeds');
    const feedsList = sheets.map(sheet => Feed.getNewFeeds(sheet));
    feedsList.forEach(feeds =>
      feeds.forEach(feed => {
        try {
          Logger.log(feed);
          TwitterService.postUpdateStatus(twitter, feed.toShortString());
        } catch (e) {
          Logger.log(e);
        }
      })
    );
  } catch (e) {
    Logger.log(e);
  }
  if (logUrl) {
    sendHttpPost(logUrl, Logger.getLog());
  }
};

global.doPost = (e: any) => {
  try {
    if (!sheetKey) {
      throw new Error('sheet key is null');
    }
    const params = e.parameter;
    const [feedUrl, title] = params.text.split(' ');
    const ss = SpreadsheetApp.openById(sheetKey);
    RssSheetService.insert(ss, feedUrl, title);
    const response = { text: `${params} completed` };
    if (logUrl) {
      sendHttpPost(logUrl, Logger.getLog());
    }
    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    if (logUrl) {
      sendHttpPost(logUrl, Logger.getLog());
    }
    return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(
      ContentService.MimeType.JSON
    );
  }
};

global.auth = () => {
  Logger.log('auth');
  if (!twitterKey || !twitterSecret) {
    throw new Error('twitter key or secret is null');
  }
  const twitter = TwitterService.getService(twitterKey, twitterSecret);
  TwitterService.authorize(twitter);
  if (logUrl) {
    sendHttpPost(logUrl, Logger.getLog());
  }
};

// tslint:disable-next-line
global.authCallback = (request: any) => {
  Logger.log('auth callback');
  if (!twitterKey || !twitterSecret) {
    throw new Error('twitter key or secret is null');
  }
  const twitter = TwitterService.getService(twitterKey, twitterSecret);
  TwitterService.authCallback(twitter, request);
  if (logUrl) {
    sendHttpPost(logUrl, Logger.getLog());
  }
};
