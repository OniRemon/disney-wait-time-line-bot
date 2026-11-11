/**
 * 日時表示
 */
function formatDate(date) {
  return Utilities.formatDate(
    date,
    'Asia/Tokyo',
    'MM/dd HH:mm'
  );
}

/**
 * 配列を指定件数ごとに分割
 */
function splitArray(array, size) {
  const result = [];

  for (
    let index = 0;
    index < array.length;
    index += size
  ) {
    result.push(
      array.slice(index, index + size)
    );
  }

  return result;
}

/**
 * 待ち時間に応じた表示色を取得
 */
function getWaitTimeStyle(waitTime) {
  if (waitTime <= 20) {
    return {
      color: '#06C755',
      icon: '🟢'
    };
  }

  if (waitTime <= 60) {
    return {
      color: '#F5A623',
      icon: '🟠'
    };
  }

  return {
    color: '#E53935',
    icon: '🔴'
  };
}