export class Feed {
  constructor(public title: string, public url: string, public date: Date) {}
  static buildFromCells(row: Object[]) {
    Logger.log('build from cells');
    return new Feed(
      row[0].toString(),
      row[1].toString(),
      new Date(row[2].toString())
    );
  }
  toShortString() {
    Logger.log('to short string');
    return `${this.title}\r\n${this.url}`;
  }

  // フィードの新着チェックを行い、新着があれば配列newFeedsに追加する
  static getNewFeeds(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    Logger.log('get new feeds');
    const { feedList, lastCheckTime } = Feed.getFeedList(sheet);
    return feedList.filter(feed =>
      Feed.isNew(feed.date, lastCheckTime as Date)
    );
  }

  // 最新のフィードを取得する
  static getFeedList(
    sheet: GoogleAppsScript.Spreadsheet.Sheet
  ): { feedList: Feed[]; lastCheckTime: Date } {
    Logger.log('get feed list');
    const values = sheet.getRange(1, 1, 1, 3).getValues();
    const [url, __, lastCheckTimeObj] = values[0];
    const date = new Date(lastCheckTimeObj.toString());
    const lastCheckTime =
      date.toString() === 'Invalid Date' ? new Date(0) : date;
    const currentTime = new Date();
    sheet.getRange('C1').setValue(currentTime);
    const lastRow = sheet.getLastRow();
    const feedList = sheet
      .getRange(2, 1, lastRow - 1, 3)
      .getValues()
      .map(row => Feed.buildFromCells(row)); // 一括で範囲内全てを取得する
    return { feedList, lastCheckTime };
  }

  // 前回のチェック以降の投稿か確認
  static isNew(date: Object, lastCheckTime: Date) {
    Logger.log('is new');
    const postTime = new Date(date.toString());
    return postTime.getTime() > lastCheckTime.getTime();
  }
}
