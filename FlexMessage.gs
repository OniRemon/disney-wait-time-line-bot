/**
 * Flex Messageを作成
 */
function createWaitTimeFlexMessage(
  park,
  rides,
  updatedAt
) {
  if (!rides || rides.length === 0) {
    return {
      type: 'text',
      text: [
        '【' + park.label + '】',
        '現在、表示できる待ち時間がありません。'
      ].join('\n')
    };
  }

  const rideGroups = splitArray(rides, 8);

  const bubbles = rideGroups.map(
    function (rideGroup, groupIndex) {
      return createWaitTimeBubble(
        park,
        rideGroup,
        updatedAt,
        groupIndex,
        rideGroups.length
      );
    }
  );

  return {
    type: 'flex',
    altText:
      park.label + 'の待ち時間',
    contents: {
      type: 'carousel',
      contents: bubbles
    }
  };
}

/**
 * 1枚分のFlex Messageを作成
 */
function createWaitTimeBubble(
  park,
  rides,
  updatedAt,
  groupIndex,
  groupCount
) {
  const rideContents = [];

  rides.forEach(function (ride, index) {
    const waitTime =
      Number(ride.wait_time || 0);

    const style =
      getWaitTimeStyle(waitTime);

    const japaneseName =
      getJapaneseAttractionName(
        ride.name
      );

    if (index > 0) {
      rideContents.push({
        type: 'separator',
        margin: 'md',
        color: '#EEEEEE'
      });
    }

    rideContents.push({
      type: 'box',
      layout: 'horizontal',
      margin: 'md',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: japaneseName,
          size: 'sm',
          color: '#333333',
          wrap: true,
          flex: 4,
          gravity: 'center'
        },
        {
          type: 'text',
          text:
            style.icon +
            ' ' +
            waitTime +
            '分',
          size: 'sm',
          weight: 'bold',
          color: style.color,
          align: 'end',
          wrap: false,
          flex: 2,
          gravity: 'center'
        }
      ]
    });
  });

  const headerColor =
    park.id === PARKS.land.id
      ? '#367DCB'
      : '#168C91';

  return {
    type: 'bubble',
    size: 'mega',

    header: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: headerColor,
      paddingAll: '18px',
      contents: [
        {
          type: 'text',
          text: park.label,
          color: '#FFFFFF',
          weight: 'bold',
          size: 'lg',
          wrap: true
        },
        {
          type: 'text',
          text:
            '更新：' +
            updatedAt +
            '　' +
            (groupIndex + 1) +
            '/' +
            groupCount,
          color: '#FFFFFF',
          size: 'xs',
          margin: 'sm'
        }
      ]
    },

    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '16px',
      contents: rideContents
    },

    footer: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '12px',
      contents: [
        {
          type: 'text',
          text:
            '🟢 20分以下　🟠 21〜60分　🔴 61分以上',
          size: 'xxs',
          color: '#777777',
          align: 'center',
          wrap: true
        },
        {
          type: 'text',
          text: 'Data: Queue-Times.com',
          size: 'xxs',
          color: '#AAAAAA',
          align: 'center',
          margin: 'sm'
        }
      ]
    }
  };
}

