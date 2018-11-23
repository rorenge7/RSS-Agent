export function sendHttpPost(url: string, message: string) {
  const payload = {
    text: message || '_'
  };
  const method: 'post' = 'post';
  const options = {
    method,
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, options);
}
