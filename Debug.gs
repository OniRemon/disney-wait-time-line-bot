/**
 * デバッグログをスクリプトプロパティに保存
 */
function saveDebugLog(message) {
  const properties =
    PropertiesService.getScriptProperties();

  const current =
    properties.getProperty('LAST_DEBUG_LOG') ||
    '';

  const now = Utilities.formatDate(
    new Date(),
    'Asia/Tokyo',
    'yyyy/MM/dd HH:mm:ss'
  );

  const newLog =
    current +
    '[' +
    now +
    '] ' +
    message +
    '\n';

  properties.setProperty(
    'LAST_DEBUG_LOG',
    newLog.slice(-8000)
  );
}

/**
 * 保存したデバッグログを表示
 *
 * この関数はApps Script上で直接実行してOK
 */
function showLastDebugLog() {
  const log =
    PropertiesService
      .getScriptProperties()
      .getProperty('LAST_DEBUG_LOG');

  console.log(
    log || 'デバッグ情報はありません。'
  );
}


/**
 * デバッグログを削除
 */
function clearDebugLog() {
  PropertiesService
    .getScriptProperties()
    .deleteProperty('LAST_DEBUG_LOG');

  console.log('デバッグ情報を削除しました。');
}