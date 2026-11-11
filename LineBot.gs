/**
 * LINEへ複数形式のメッセージを返信
 */
function replyMessages(
  replyToken,
  messages
) {
  const properties =
    PropertiesService.getScriptProperties();

  const accessToken =
    properties.getProperty(
      'LINE_CHANNEL_ACCESS_TOKEN'
    );

  if (!accessToken) {
    throw new Error(
      'LINE_CHANNEL_ACCESS_TOKENが設定されていません。'
    );
  }

  if (
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    throw new Error(
      '返信メッセージがありません。'
    );
  }

  const payload = {
    replyToken: replyToken,
    messages: messages.slice(0, 5)
  };

  const response = UrlFetchApp.fetch(
    LINE_REPLY_API,
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization:
          'Bearer ' + accessToken
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
  );

  const statusCode =
    response.getResponseCode();

  const responseText =
    response.getContentText();

  saveDebugLog(
    'LINE返信結果: ' +
    statusCode +
    ' / ' +
    responseText
  );

  if (
    statusCode < 200 ||
    statusCode >= 300
  ) {
    throw new Error(
      'LINE返信失敗: ' +
      statusCode +
      ' ' +
      responseText
    );
  }
}