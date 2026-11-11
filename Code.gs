/**
 * LINEからWebhookを受信
 */
function doPost(e) {
  try {
    saveDebugLog('doPost開始');

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('WebhookのPOSTデータがありません。');
    }

    saveDebugLog('受信データ: ' + e.postData.contents);

    const body = JSON.parse(e.postData.contents);
    const events = body.events || [];

    events.forEach(function (event) {
      if (
        event.type !== 'message' ||
        !event.message ||
        event.message.type !== 'text' ||
        !event.replyToken
      ) {
        return;
      }

      const command = normalizeCommand(event.message.text);
      saveDebugLog('コマンド: ' + command);

      const userId =
        event.source && event.source.userId
          ? event.source.userId
          : '';

      const messages =
        createReplyMessages(command, userId);

      saveDebugLog(
        '返信メッセージ数: ' + messages.length
      );

      replyMessages(
        event.replyToken,
        messages
      );
    });

    saveDebugLog('doPost正常終了');

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    const errorText =
      error && error.stack
        ? error.stack
        : String(error);

    saveDebugLog('エラー: ' + errorText);
    console.error(errorText);

    return ContentService
      .createTextOutput('ERROR')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * ブラウザからWebアプリURLを開いたときの確認用
 */
function doGet() {
  return ContentService
    .createTextOutput('LINE Bot is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 入力文字をコマンドへ変換
 */
function normalizeCommand(text) {
  const originalText =
    String(text || '').trim();

  const value = originalText
    .toLowerCase()
    .replace(/[\s　]+/g, ' ');

  if (
    value === 'ランド' ||
    value === 'tdl' ||
    value === 'ディズニーランド'
  ) {
    return 'land';
  }

  if (
    value === 'シー' ||
    value === 'tds' ||
    value === 'ディズニーシー'
  ) {
    return 'sea';
  }

  if (['usj', 'ｕｓｊ', 'ユニバ', 'ユニバーサル・スタジオ・ジャパン'].includes(value)) {
    return 'usj';
  }

  if (
    value === '両方' ||
    value === '待ち時間' ||
    value === 'ディズニー'
  ) {
    return 'both';
  }

  // ========================================
  // お気に入り
  // ========================================

  if (
    value === 'お気に入り' ||
    value === 'お気に入り一覧'
  ) {
    return 'favorite-list';
  }

  if (
    value.indexOf('お気に入り登録 ') === 0 ||
    value.indexOf('お気に入り追加 ') === 0
  ) {
    const query = originalText
      .replace(/^お気に入り登録[\s　]+/, '')
      .replace(/^お気に入り追加[\s　]+/, '')
      .trim();

    return 'favorite-add:' + query;
  }

  if (
    value.indexOf('お気に入り削除 ') === 0
  ) {
    const query = originalText
      .replace(/^お気に入り削除[\s　]+/, '')
      .trim();

    return 'favorite-remove:' + query;
  }

  // 空いているアトラクション
  if (
    value === '空いてる' ||
    value === 'すいてる' ||
    value === '空いている' ||
    value === '20分以下'
  ) {
    return 'low-all';
  }

  if (
    value === 'ランド 空いてる' ||
    value === 'ランド すいてる' ||
    value === 'ランド 20分以下'
  ) {
    return 'low-land';
  }

  if (
    value === 'シー 空いてる' ||
    value === 'シー すいてる' ||
    value === 'シー 20分以下'
  ) {
    return 'low-sea';
  }

  // 人気ランキング
  if (
    value === '人気' ||
    value === 'ランキング' ||
    value === '人気ランキング'
  ) {
    return 'popular-all';
  }

  if (
    value === 'ランド 人気' ||
    value === 'ランド ランキング' ||
    value === 'ランド 人気ランキング'
  ) {
    return 'popular-land';
  }

  if (
    value === 'シー 人気' ||
    value === 'シー ランキング' ||
    value === 'シー 人気ランキング'
  ) {
    return 'popular-sea';
  }

  if (value === '検索') {
    return 'search-help';
  }

  // 上記以外はアトラクション名検索
  if (originalText !== '') {
    return 'search:' + originalText;
  }

  return 'help';
}

/**
 * コマンドに応じたLINEメッセージを作成
 *
 * @param {string} command コマンド
 * @param {string} userId LINEユーザーID
 * @return {Object[]} LINEメッセージ配列
 */
function createReplyMessages(command, userId) {
  // ========================================
  // 通常の待ち時間表示
  // ========================================

  if (command === 'land') {
    return [
      createParkReplyMessage(PARKS.land)
    ];
  }

  if (command === 'sea') {
    return [
      createParkReplyMessage(PARKS.sea)
    ];
  }

  if (command === 'usj') {
    return [createParkReplyMessage(PARKS.usj)];
  }

  if (command === 'both') {
    return [
      createParkReplyMessage(PARKS.land),
      createParkReplyMessage(PARKS.sea)
    ];
  }

  // ========================================
  // お気に入り
  // ========================================

  if (command === 'favorite-list') {
    return [
      createFavoriteMessage(userId)
    ];
  }

  if (command === 'search-help') {
    return [{
      type: 'text',
      text: [
        '🔍 アトラクション検索',
        '',
        '調べたいアトラクション名を送ってください。',
        '',
        '例',
        '・美女と野獣',
        '・ソアリン',
        '・ピーターパン',
        '・アナ雪'
      ].join('\n')
    }];
  }

  if (command.indexOf('favorite-add:') === 0) {
    const query = command
      .substring('favorite-add:'.length)
      .trim();

    if (!query) {
      return [
        {
          type: 'text',
          text: [
            '登録するアトラクション名を入力してください。',
            '',
            '例：',
            'お気に入り登録 美女と野獣',
            'お気に入り登録 ソアリン'
          ].join('\n')
        }
      ];
    }

    return [
      addFavorite(userId, query)
    ];
  }

  if (command.indexOf('favorite-remove:') === 0) {
    const query = command
      .substring('favorite-remove:'.length)
      .trim();

    if (!query) {
      return [
        {
          type: 'text',
          text: [
            '削除するアトラクション名を入力してください。',
            '',
            '例：',
            'お気に入り削除 美女と野獣',
            'お気に入り削除 ソアリン'
          ].join('\n')
        }
      ];
    }

    return [
      removeFavorite(userId, query)
    ];
  }

  // ========================================
  // 20分以下
  // ========================================

  if (command === 'low-all') {
    return [
      createLowWaitMessage(PARKS.land, 20),
      createLowWaitMessage(PARKS.sea, 20)
    ];
  }

  if (command === 'low-land') {
    return [
      createLowWaitMessage(PARKS.land, 20)
    ];
  }

  if (command === 'low-sea') {
    return [
      createLowWaitMessage(PARKS.sea, 20)
    ];
  }

  // ========================================
  // 人気ランキング
  // ========================================

  if (command === 'popular-all') {
    return [
      createPopularRankingMessage(
        PARKS.land,
        10
      ),
      createPopularRankingMessage(
        PARKS.sea,
        10
      )
    ];
  }

  if (command === 'popular-land') {
    return [
      createPopularRankingMessage(
        PARKS.land,
        10
      )
    ];
  }

  if (command === 'popular-sea') {
    return [
      createPopularRankingMessage(
        PARKS.sea,
        10
      )
    ];
  }

  // ========================================
  // アトラクション名検索
  // ========================================

  if (command.indexOf('search:') === 0) {
    const query = command
      .substring('search:'.length)
      .trim();

    return [
      createAttractionSearchMessage(query)
    ];
  }

  // ========================================
  // ヘルプ
  // ========================================

  return [
    {
      type: 'text',
      text: [
        '次のように送ってください。',
        '',
        '【待ち時間】',
        '・ランド',
        '・シー',
        '・両方（ランド・シー）',
        '・USJ（ユニバ）',
        '',
        '【お気に入り】',
        '・お気に入り',
        '・お気に入り登録 美女と野獣',
        '・お気に入り削除 美女と野獣',
        '',
        '【20分以下】',
        '・空いてる',
        '・ランド 空いてる',
        '・シー 空いてる',
        '',
        '【ランキング】',
        '・人気',
        '・ランド 人気',
        '・シー 人気',
        '',
        '【アトラクション検索】',
        '・美女と野獣',
        '・ソアリン',
        '・ピーターパン'
      ].join('\n')
    }
  ];
}

/**
 * パークの待ち時間をLINEメッセージに変換
 */
function createParkReplyMessage(park) {
  const result = getParkWaitTimeData(park);

  if (!result.success) {
    return {
      type: 'text',
      text: [
        '【' + park.label + '】',
        result.message
      ].join('\n')
    };
  }

  return createWaitTimeFlexMessage(
    park,
    result.rides,
    result.updatedAt
  );
}