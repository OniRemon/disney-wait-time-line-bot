/**
 * アトラクション名検索
 */
function createAttractionSearchMessage(query) {
  const normalizedQuery = normalizeSearchText(query);
  const results = [];

  Object.keys(PARKS).forEach(function (parkKey) {
    const park = PARKS[parkKey];
    const result = getParkWaitTimeData(park);

    if (!result.success) {
      return;
    }

    result.rides.forEach(function (ride) {
      const englishName = String(ride.name || '');
      const japaneseName =
        getJapaneseAttractionName(englishName);

      const normalizedEnglish =
        normalizeSearchText(englishName);

      const normalizedJapanese =
        normalizeSearchText(japaneseName);

      if (
        normalizedEnglish.indexOf(normalizedQuery) !== -1 ||
        normalizedJapanese.indexOf(normalizedQuery) !== -1
      ) {
        results.push({
          park: park,
          japaneseName: japaneseName,
          englishName: englishName,
          waitTime: Number(ride.wait_time || 0)
        });
      }
    });
  });

  results.sort(function (a, b) {
    return b.waitTime - a.waitTime;
  });

  if (results.length === 0) {
    return {
      type: 'text',
      text: [
        '「' + query + '」に一致する',
        'アトラクションが見つかりませんでした。',
        '',
        '名前の一部だけでも検索できます。',
        '例：美女、ソアリン、ピーターパン'
      ].join('\n')
    };
  }

  const lines = results
    .slice(0, 20)
    .map(function (ride) {
      return [
        '【' + ride.park.label + '】',
        ride.japaneseName,
        getWaitTimeIcon(ride.waitTime) +
          ' ' +
          ride.waitTime +
          '分'
      ].join('\n');
    });

  return {
    type: 'text',
    text: [
      '🔍 アトラクション検索',
      '検索：' + query,
      '',
      lines.join('\n\n')
    ].join('\n').slice(0, 5000)
  };
}

/**
 * 指定時間以下のアトラクションを表示
 */
function createLowWaitMessage(park, maxWaitTime) {
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

  const rides = result.rides
    .filter(function (ride) {
      const waitTime =
        Number(ride.wait_time || 0);

      return waitTime <= maxWaitTime;
    })
    .sort(function (a, b) {
      return (
        Number(a.wait_time || 0) -
        Number(b.wait_time || 0)
      );
    });

  if (rides.length === 0) {
    return {
      type: 'text',
      text: [
        '🟢 ' + park.label,
        maxWaitTime + '分以下',
        '',
        '現在、該当するアトラクションはありません。',
        '',
        '更新：' + result.updatedAt
      ].join('\n')
    };
  }

  const lines = rides.map(function (ride) {
    const japaneseName =
      getJapaneseAttractionName(ride.name);

    const waitTime =
      Number(ride.wait_time || 0);

    return (
      getWaitTimeIcon(waitTime) +
      ' ' +
      japaneseName +
      '：' +
      waitTime +
      '分'
    );
  });

  return {
    type: 'text',
    text: [
      '🟢 ' + park.label,
      maxWaitTime + '分以下のアトラクション',
      '更新：' + result.updatedAt,
      '',
      lines.join('\n'),
      '',
      'Data: Queue-Times.com'
    ].join('\n').slice(0, 5000)
  };
}

/**
 * 待ち時間が長い順にランキング表示
 */
function createPopularRankingMessage(park, limit) {
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

  const rides = result.rides
    .slice()
    .sort(function (a, b) {
      return (
        Number(b.wait_time || 0) -
        Number(a.wait_time || 0)
      );
    })
    .slice(0, limit);

  if (rides.length === 0) {
    return {
      type: 'text',
      text: [
        '🔥 ' + park.label,
        '',
        '現在、ランキングを表示できません。',
        '',
        '更新：' + result.updatedAt
      ].join('\n')
    };
  }

  const lines = rides.map(function (ride, index) {
    const japaneseName =
      getJapaneseAttractionName(ride.name);

    const waitTime =
      Number(ride.wait_time || 0);

    return [
      getRankingIcon(index),
      japaneseName,
      getWaitTimeIcon(waitTime) +
        ' ' +
        waitTime +
        '分'
    ].join(' ');
  });

  return {
    type: 'text',
    text: [
      '🔥 ' + park.label,
      '待ち時間ランキング TOP' + limit,
      '更新：' + result.updatedAt,
      '',
      lines.join('\n'),
      '',
      '※待ち時間が長い順です。',
      'Data: Queue-Times.com'
    ].join('\n').slice(0, 5000)
  };
}

/**
 * 検索用に文字列を正規化
 */
function normalizeSearchText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\s　]/g, '')
    .replace(/[・･\-ー_'’"“”「」『』（）()：:！!]/g, '');
}

/**
 * 待ち時間用アイコン
 */
function getWaitTimeIcon(waitTime) {
  if (waitTime <= 20) {
    return '🟢';
  }

  if (waitTime <= 60) {
    return '🟠';
  }

  return '🔴';
}

/**
 * ランキング用アイコン
 */
function getRankingIcon(index) {
  if (index === 0) {
    return '🥇';
  }

  if (index === 1) {
    return '🥈';
  }

  if (index === 2) {
    return '🥉';
  }

  return String(index + 1) + '.';
}