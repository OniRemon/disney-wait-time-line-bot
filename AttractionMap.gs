const ATTRACTION_NAME_MAP = {
  // 東京ディズニーランド
  "Beauty and the Beast 'Enchanted Tale'":
    "美女と野獣“魔法のものがたり”",
  "The Happy Ride with Baymax":
    "ベイマックスのハッピーライド",
  "Pooh's Hunny Hunt":
    "プーさんのハニーハント",
  "Big Thunder Mountain":
    "ビッグサンダー・マウンテン",
  "Big Thunder Mountain Railroad":
    "ビッグサンダー・マウンテン",
  "Splash Mountain":
    "スプラッシュ・マウンテン",
  "Haunted Mansion":
    "ホーンテッドマンション",
  "Pirates of the Caribbean":
    "カリブの海賊",
  "Jungle Cruise: Wildlife Expeditions":
    "ジャングルクルーズ：ワイルドライフ・エクスペディション",
  "Western River Railroad":
    "ウエスタンリバー鉄道",
  "Star Tours: The Adventures Continue":
    "スター・ツアーズ：ザ・アドベンチャーズ・コンティニュー",
  "Monsters, Inc. Ride & Go Seek!":
    "モンスターズ・インク“ライド＆ゴーシーク！”",
  "Buzz Lightyear's Astro Blasters":
    "バズ・ライトイヤーのアストロブラスター",
  "Roger Rabbit's Car Toon Spin":
    "ロジャーラビットのカートゥーンスピン",
  "Peter Pan's Flight":
    "ピーターパン空の旅",
  "Pinocchio's Daring Journey":
    "ピノキオの冒険旅行",
  "Snow White's Adventures":
    "白雪姫と七人のこびと",
  "Dumbo the Flying Elephant":
    "空飛ぶダンボ",
  "Alice's Tea Party":
    "アリスのティーパーティー",
  "It's a Small World":
    "イッツ・ア・スモールワールド",
  "Enchanted Tale of Beauty and the Beast":
  "美女と野獣“魔法のものがたり”",

"Country Bear Theater":
  "カントリーベア・シアター",

"Gadget's Go Coaster":
  "ガジェットのゴーコースター",

"Goofy's Paint 'n' Play House":
  "グーフィーのペイント＆プレイハウス",

"Stitch Encounter":
  "スティッチ・エンカウンター",

"The Enchanted Tiki Room: Stitch Presents “Aloha E Komo Mai!”":
  "魅惑のチキルーム：スティッチ・プレゼンツ“アロハ・エ・コモ・マイ！”",

"Castle Carrousel":
  "キャッスルカルーセル",

"Chip 'n Dale's Treehouse":
  "チップとデールのツリーハウス",

"Cinderella's Fairy Tale Hall":
  "シンデレラのフェアリーテイル・ホール",

"Donald's Boat":
  "ドナルドのボート",

"Mark Twain Riverboat":
  "蒸気船マークトウェイン号",

"Mickey's PhilharMagic":
  "ミッキーのフィルハーマジック",

"Minnie's House":
  "ミニーの家",

"Westernland Shootin' Gallery":
  "ウエスタンランド・シューティングギャラリー",

"Penny Arcade":
  "ペニーアーケード",

"Toon Park":
  "トゥーンパーク",

  // 東京ディズニーシー
  "Soaring: Fantastic Flight":
    "ソアリン：ファンタスティック・フライト",
  "Journey to the Center of the Earth":
    "センター・オブ・ジ・アース",
  "Tower of Terror":
    "タワー・オブ・テラー",
  "Toy Story Mania!":
    "トイ・ストーリー・マニア！",
  "Indiana Jones Adventure: Temple of the Crystal Skull":
    "インディ・ジョーンズ・アドベンチャー：クリスタルスカルの魔宮",
  "Raging Spirits":
    "レイジングスピリッツ",
  "20,000 Leagues Under the Sea":
    "海底2万マイル",
  "Nemo & Friends SeaRider":
    "ニモ＆フレンズ・シーライダー",
  "Aquatopia":
    "アクアトピア",
  "The Magic Lamp Theater":
    "マジックランプシアター",
  "Sinbad's Storybook Voyage":
    "シンドバッド・ストーリーブック・ヴォヤッジ",
  "Flounder's Flying Fish Coaster":
    "フランダーのフライングフィッシュコースター",
  "Scuttle's Scooters":
    "スカットルのスクーター",
  "Jumpin' Jellyfish":
    "ジャンピン・ジェリーフィッシュ",
  "Blowfish Balloon Race":
    "ブローフィッシュ・バルーンレース",
  "The Whirlpool":
    "ワールプール",
  "DisneySea Electric Railway":
    "ディズニーシー・エレクトリックレールウェイ",
  "DisneySea Transit Steamer Line":
    "ディズニーシー・トランジットスチーマーライン",
  "Anna and Elsa's Frozen Journey":
  "アナとエルサのフローズンジャーニー",

"Rapunzel's Lantern Festival":
  "ラプンツェルのランタンフェスティバル",

"Peter Pan's Never Land Adventure":
  "ピーターパンのネバーランドアドベンチャー",

"Fairy Tinker Bell's Busy Buggies":
  "フェアリー・ティンカーベルのビジーバギー",

"Turtle Talk":
  "タートル・トーク",

"Caravan Carousel":
  "キャラバンカルーセル",

"Ariel's Playground":
  "アリエルのプレイグラウンド",

"Fortress Explorations":
  "フォートレス・エクスプロレーション",

// ユニバーサル・スタジオ・ジャパン
"Mario Kart: Koopa's Challenge": "マリオカート ～クッパの挑戦状～",
"Yoshi's Adventure": "ヨッシー・アドベンチャー",
"Mine Cart Madness": "ドンキーコングのクレイジー・トロッコ",
"The Flying Dinosaur": "ザ・フライング・ダイナソー",
"Harry Potter and the Forbidden Journey": "ハリー・ポッター・アンド・ザ・フォービドゥン・ジャーニー",
"Flight of the Hippogriff": "フライト・オブ・ザ・ヒッポグリフ",
"Despicable Me Minion Mayhem": "ミニオン・ハチャメチャ・ライド",
"Hollywood Dream -The Ride - Backdrop-": "ハリウッド・ドリーム・ザ・ライド ～バックドロップ～",
"Detective Conan: The World": "名探偵コナン・ザ・ワールド",
"Freeze Ray Sliders": "ミニオン・ハチャメチャ・アイス",
"Hello Kitty's Cupcake Dream": "ハローキティのカップケーキ・ドリーム",
"Hello Kitty's Ribbon Collection": "ハローキティのリボン・コレクション",
"Hollywood Dream - The Ride": "ハリウッド・ドリーム・ザ・ライド",
"Illumination's Villain-con Minion Blast": "ミニオン・ハチャメチャ・ミッション ～大悪党への道～",
"JAWS": "ジョーズ",
"Jurassic Park - The Ride in the Dark": "ジュラシック・パーク・ザ・ライド ～イン・ザ・ダーク～",
"Jurassic Park – The Ride": "ジュラシック・パーク・ザ・ライド",
"Ollivanders": "オリバンダーの店",
"Playing with Curious George": "プレイング・ウィズおさるのジョージ",
"Sadako's Curse: Dark Horror Ride": "貞子の呪い ～ダーク・ホラー・ライド～",
"Sesame Street 4-D Movie Magic": "セサミストリート 4-D ムービーマジック",
"Shrek’s 4-D Adventure": "シュレック 4-D アドベンチャー",
"Shrek's 4-D Adventure": "シュレック 4-D アドベンチャー",
"SING ON TOUR": "シング・オン・ツアー",
"Snoopy's Flying Ace Adventure": "スヌーピーのフライング・エース・アドベンチャー",
"Space Fantasy – The Ride": "スペース・ファンタジー・ザ・ライド",
"The Flying Snoopy": "フライング・スヌーピー"
};

function getJapaneseAttractionName(englishName) {
  // 完全一致
  if (ATTRACTION_NAME_MAP[englishName]) {
    return ATTRACTION_NAME_MAP[englishName];
  }

  // 前方一致
  for (const key in ATTRACTION_NAME_MAP) {
    if (englishName.startsWith(key)) {
      return ATTRACTION_NAME_MAP[key];
    }
  }

  return englishName;
}
