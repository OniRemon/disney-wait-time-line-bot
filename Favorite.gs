function getFavoriteKey(userId) {
  return 'favorite:' + userId;
}

/**
 * ユーザーのお気に入りを取得
 */
function getFavorites(userId) {
  if (!userId) {
    return [];
  }

  const properties =
    PropertiesService.getScriptProperties();

  const value =
    properties.getProperty(getFavoriteKey(userId));

  if (!value) {
    return [];
  }

  try {
    const favorites = JSON.parse(value);

    return Array.isArray(favorites)
      ? favorites
      : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * お気に入りを保存
 */
function saveFavorites(userId, favorites) {
  if (!userId) {
    return;
  }

  PropertiesService
    .getScriptProperties()
    .setProperty(
      getFavoriteKey(userId),
      JSON.stringify(favorites)
    );
}

/**
 * お気に入りを登録
 */
function addFavorite(userId, query) {
  const ride = findAttractionByQuery(query);

  if (!ride) {
    return {
      type: 'text',
      text:
        '「' + query + '」に一致するアトラクションが見つかりませんでした。'
    };
  }

  const favorites = getFavorites(userId);

  if (favorites.indexOf(ride.englishName) !== -1) {
    return {
      type: 'text',
      text:
        '「' + ride.japaneseName + '」はすでに登録されています。'
    };
  }

  favorites.push(ride.englishName);
  saveFavorites(userId, favorites);

  return {
    type: 'text',
    text: [
      '⭐ お気に入りに登録しました',
      '',
      ride.japaneseName
    ].join('\n')
  };
}

/**
 * お気に入りを削除
 */
function removeFavorite(userId, query) {
  const normalizedQuery =
    normalizeSearchText(query);

  const favorites = getFavorites(userId);

  const target = favorites.find(function (englishName) {
    const japaneseName =
      getJapaneseAttractionName(englishName);

    return (
      normalizeSearchText(englishName)
        .indexOf(normalizedQuery) !== -1 ||
      normalizeSearchText(japaneseName)
        .indexOf(normalizedQuery) !== -1
    );
  });

  if (!target) {
    return {
      type: 'text',
      text:
        '「' + query + '」はお気に入りに登録されていません。'
    };
  }

  const updatedFavorites = favorites.filter(
    function (englishName) {
      return englishName !== target;
    }
  );

  saveFavorites(userId, updatedFavorites);

  return {
    type: 'text',
    text: [
      'お気に入りから削除しました',
      '',
      getJapaneseAttractionName(target)
    ].join('\n')
  };
}

/**
 * お気に入り一覧と現在の待ち時間を表示
 */
function createFavoriteMessage(userId) {
  const favorites = getFavorites(userId);

  if (favorites.length === 0) {
    return {
      type: 'text',
      text: [
        '⭐ お気に入り',
        '',
        'まだ登録されていません。',
        '',
        '次のように送ってください。',
        'お気に入り登録 美女と野獣'
      ].join('\n')
    };
  }

  const allRides = getAllParkRides();

  const lines = favorites.map(function (englishName) {
    const ride = allRides.find(function (item) {
      return item.englishName === englishName;
    });

    const japaneseName =
      getJapaneseAttractionName(englishName);

    if (!ride) {
      return [
        japaneseName,
        '現在の情報を取得できません'
      ].join('\n');
    }

    return [
      japaneseName,
      getWaitTimeIcon(ride.waitTime) +
        ' ' +
        ride.waitTime +
        '分'
    ].join('\n');
  });

  return {
    type: 'text',
    text: [
      '⭐ お気に入り',
      '',
      lines.join('\n\n')
    ].join('\n').slice(0, 5000)
  };
}

/**
 * ランド・シーの全アトラクションを取得
 */
function getAllParkRides() {
  const rides = [];

  Object.keys(PARKS).forEach(function (parkKey) {
    const park = PARKS[parkKey];
    const result = getParkWaitTimeData(park);

    if (!result.success) {
      return;
    }

    result.rides.forEach(function (ride) {
      rides.push({
        park: park,
        englishName: String(ride.name || ''),
        japaneseName:
          getJapaneseAttractionName(ride.name),
        waitTime:
          Number(ride.wait_time || 0)
      });
    });
  });

  return rides;
}

/**
 * 名前からアトラクションを1件検索
 */
function findAttractionByQuery(query) {
  const normalizedQuery =
    normalizeSearchText(query);

  const rides = getAllParkRides();

  return rides.find(function (ride) {
    return (
      normalizeSearchText(ride.englishName)
        .indexOf(normalizedQuery) !== -1 ||
      normalizeSearchText(ride.japaneseName)
        .indexOf(normalizedQuery) !== -1
    );
  }) || null;
}