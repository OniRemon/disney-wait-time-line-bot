/**
 * Queue-Times APIから待ち時間データを取得
 */
function getParkWaitTimeData(park) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'wait-times-data-' + park.id;
  const cached = cache.get(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      saveDebugLog(
        'キャッシュ解析失敗: ' + error
      );
    }
  }

  const url =
    'https://queue-times.com/parks/' +
    park.id +
    '/queue_times.json';

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });

  const statusCode = response.getResponseCode();
  const responseText = response.getContentText();

  saveDebugLog(
    'Queue-Times結果: ' +
    park.label +
    ' / ' +
    statusCode
  );

  if (statusCode !== 200) {
    saveDebugLog(
      'Queue-Timesエラー内容: ' +
      responseText
    );

    return {
      success: false,
      message:
        '待ち時間を取得できませんでした。'
    };
  }

  const data = JSON.parse(responseText);
  const rides = extractRides(data);

  const openRides = rides
    .filter(function (ride) {
      return ride.is_open === true;
    })
    .map(function (ride) {
      return {
        name: String(ride.name || ''),
        wait_time:
          Number(ride.wait_time || 0),
        is_open: true
      };
    })
    .sort(function (a, b) {
      return b.wait_time - a.wait_time;
    });

  const result = {
    success: true,
    updatedAt: formatDate(new Date()),
    rides: openRides
  };

  cache.put(
    cacheKey,
    JSON.stringify(result),
    600
  );

  return result;
}


/**
 * APIレスポンスからアトラクション一覧を取り出す
 */
/**
 * APIレスポンスからアトラクション一覧を取り出す
 */
function extractRides(data) {
  const rides = [];

  // ridesが直下にある形式
  if (Array.isArray(data.rides)) {
    data.rides.forEach(function (ride) {
      rides.push(ride);
    });
  }

  // lands配下にridesがある形式
  if (Array.isArray(data.lands)) {
    data.lands.forEach(function (land) {
      if (Array.isArray(land.rides)) {
        land.rides.forEach(function (ride) {
          rides.push(ride);
        });
      }
    });
  }

  return rides;
}


function clearWaitTimeCache() {
  const cache =
    CacheService.getScriptCache();

  cache.remove('wait-times-data-274');
  cache.remove('wait-times-data-275');

  cache.remove('wait-times-274');
  cache.remove('wait-times-275');

  console.log(
    '待ち時間キャッシュを削除しました。'
  );
}