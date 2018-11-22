declare var TwitterWebService;

export class Twitter {
  private twitter;
  private service;
  constructor(key: string, secret: string) {
    Logger.log('get instance');
    this.twitter = TwitterWebService.getInstance(
      key, // 作成したアプリケーションのConsumer Key
      secret // 作成したアプリケーションのConsumer Secret
    );
    this.authorize();
    Logger.log('get service');
    this.service = this.twitter.getService();
  }
  // 認証
  authorize() {
    Logger.log('authorize');
    this.twitter.authorize();
  }

  postUpdateStatus(content: string) {
    Logger.log('post update status');
    const response = this.service.fetch(
      'https://api.twitter.com/1.1/statuses/update.json',
      {
        method: 'post',
        payload: { status: content }
      }
    );
  }

  // 認証解除
  reset() {
    Logger.log('reset');
    this.twitter.reset();
  }

  // 認証後のコールバック
  authCallback(request) {
    Logger.log('auth callback');
    return this.twitter.authCallback(request);
  }
}
