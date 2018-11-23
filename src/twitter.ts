declare var OAuth1: any;

export class TwitterService {
  static getService(key: string, secret: string) {
    return (
      OAuth1.createService('Twitter')
        // Set the endpoint URLs.
        .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
        .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
        .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')

        // Set the consumer key and secret.
        .setConsumerKey(key)
        .setConsumerSecret(secret)

        // Set the name of the callback function in the script referenced
        // above that should be invoked to complete the OAuth flow.
        .setCallbackFunction('authCallback')

        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getUserProperties())
    );
  }

  // 認証
  static authorize(twitter: any) {
    Logger.log('authorize');
    const authorizationUrl = twitter.authorize();
    Logger.log('認証URLは下記です。\n%s', authorizationUrl);
  }

  static postUpdateStatus(twitter: any, content: string) {
    Logger.log('post update status');
    if (twitter.hasAccess()) {
      const url = 'https://api.twitter.com/1.1/statuses/update.json';
      const payload = {
        status: content
      };
      const response = twitter.fetch(url, { payload, method: 'post' });
      const result = JSON.parse(response.getContentText());
    }
  }

  // 認証解除
  static reset(twitter: any) {
    twitter.reset();
  }

  // 認証後のコールバック
  static authCallback(twitter: any, request: any) {
    const authorized = twitter.handleCallback(request);
    if (authorized) {
      return HtmlService.createHtmlOutput('Success!');
    }
    return HtmlService.createHtmlOutput('Denied');
  }
}
