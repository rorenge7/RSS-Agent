export class RssSheetService {
  static insert(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
    feedUrl: string,
    title: string
  ) {
    const sheet = ss.insertSheet(title);
    const a1 = feedUrl;
    const b1 = '=A1&"?d="&C1';
    const a2 = '=importfeed(B1, "items", false, 20)';
    sheet.getRange(1, 1, 1, 2).setValues([[a1, b1]]);
    sheet.getRange(2, 1, 1, 1).setValues([[a2]]);
  }
}
