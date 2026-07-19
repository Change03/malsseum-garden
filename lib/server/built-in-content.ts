export type BuiltInVariantSeed = {
  dayId: string;
  kind: "bible" | "commentary";
  key: string;
  label: string;
  sourceName: string;
  sourceUrl: string;
  translationKey: string | null;
  commentaryKey: string | null;
  rightsBasis: "public_domain" | "owned";
  rightsNotice: string;
  rightsUrl: string;
  body: {
    rights: {
      basis: "public_domain" | "owned";
      notice: string;
      url: string;
    };
    heading?: string;
    verses?: {
      number: string;
      reference: string;
      text: string;
      sourceUrl: string;
    }[];
    paragraphs?: string[];
  };
  copyAllowed: boolean;
  maxCopyVerses: number;
};

export const BUILT_IN_VARIANT_SEEDS: BuiltInVariantSeed[] = [
  {
    "dayId": "d1",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.8.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "9:8",
          "reference": "이사야 9:8",
          "text": "주께서 야곱에게 말씀을 보내시며 그것을 이스라엘에게 임하게 하셨은즉",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.8.KRV"
        },
        {
          "number": "9:9",
          "reference": "이사야 9:9",
          "text": "모든 백성 곧 에브라임과 사마리아 거민이 알 것이어늘 그들이 교만하고 완악한 마음으로 말하기를",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.9.KRV"
        },
        {
          "number": "9:10",
          "reference": "이사야 9:10",
          "text": "벽돌이 무너졌으나 우리는 다듬은 돌로 쌓고 뽕나무들이 찍혔으나 우리는 백향목으로 그것을 대신하리라 하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.10.KRV"
        },
        {
          "number": "9:11",
          "reference": "이사야 9:11",
          "text": "그러므로 여호와께서 르신의 대적을 일으켜 그를 치게 하시며 그 원수들을 격동시키시리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.11.KRV"
        },
        {
          "number": "9:12",
          "reference": "이사야 9:12",
          "text": "앞에는 아람 사람이요 뒤에는 블레셋 사람이라 그들이 그 입을 벌려 이스라엘을 삼키리라 그럴지라도 여호와의 노가 쉬지 아니하며 그 손이 여전히 펴지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.12.KRV"
        },
        {
          "number": "9:13",
          "reference": "이사야 9:13",
          "text": "이 백성이 오히려 자기들을 치시는 자에게로 돌아오지 아니하며 만군의 여호와를 찾지 아니하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.13.KRV"
        },
        {
          "number": "9:14",
          "reference": "이사야 9:14",
          "text": "이러므로 여호와께서 하루 사이에 이스라엘 중에서 머리와 꼬리며 종려가지와 갈대를 끊으시리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.14.KRV"
        },
        {
          "number": "9:15",
          "reference": "이사야 9:15",
          "text": "머리는 곧 장로와 존귀한 자요 꼬리는 곧 거짓말을 가르치는 선지자라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.15.KRV"
        },
        {
          "number": "9:16",
          "reference": "이사야 9:16",
          "text": "백성을 인도하는 자가 그들로 미혹케 하니 인도를 받는 자가 멸망을 당하는도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.16.KRV"
        },
        {
          "number": "9:17",
          "reference": "이사야 9:17",
          "text": "이 백성이 각기 설만하며 악을 행하며 입으로 망령되이 말하니 그러므로 주께서 그 장정을 기뻐 아니하시며 그 고아와 과부를 긍휼히 여기지 아니하시리라 그럴지라도 여호와의 노가 쉬지 아니하며 그 손이 여전히 펴지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.17.KRV"
        },
        {
          "number": "9:18",
          "reference": "이사야 9:18",
          "text": "대저 악행은 불 태우는 것 같으니 곧 질려와 형극을 삼키며 빽빽한 수풀을 살라서 연기로 위로 올라가게 함과 같은 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.18.KRV"
        },
        {
          "number": "9:19",
          "reference": "이사야 9:19",
          "text": "만군의 여호와의 진노로 인하여 이 땅이 소화되리니 백성은 불에 타는 섶나무와 같을 것이라 사람이 그 형제를 아끼지 아니하며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.19.KRV"
        },
        {
          "number": "9:20",
          "reference": "이사야 9:20",
          "text": "우편으로 움킬지라도 주리고 좌편으로 먹을지라도 배부르지 못하여 각각 자기 팔의 고기를 먹을 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.20.KRV"
        },
        {
          "number": "9:21",
          "reference": "이사야 9:21",
          "text": "므낫세는 에브라임을, 에브라임은 므낫세를 먹을 것이요 또 그들이 합하여 유다를 치리라 그럴지라도 여호와의 노가 쉬지 아니하며 그 손이 여전히 펴지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.9.21.KRV"
        },
        {
          "number": "10:1",
          "reference": "이사야 10:1",
          "text": "불의한 법령을 발포하며 불의한 말을 기록하며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.1.KRV"
        },
        {
          "number": "10:2",
          "reference": "이사야 10:2",
          "text": "빈핍한 자를 불공평하게 판결하여 내 백성의 가련한 자의 권리를 박탈하며 과부에게 토색하고 고아의 것을 약탈하는 자는 화 있을진저",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.2.KRV"
        },
        {
          "number": "10:3",
          "reference": "이사야 10:3",
          "text": "너희에게 벌하시는 날에와 멀리서 오는 환난 때에 너희가 어떻게 하려느냐 누구에게로 도망하여 도움을 구하겠으며 너희 영화를 어느 곳에 두려느냐",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.3.KRV"
        },
        {
          "number": "10:4",
          "reference": "이사야 10:4",
          "text": "포로 된 자의 아래에 구푸리며 죽임을 당한 자의 아래에 엎드러질 따름이니라 그럴지라도 여호와의 노가 쉬지 아니하며 그 손이 여전히 펴지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.4.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d1",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-07-27",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "돌아오기를 기다리시는 손",
      "paragraphs": [
        "맥락과 뜻 — 북이스라엘은 무너진 것을 더 크고 화려하게 다시 세우겠다며 교만하게 말하지만, 하나님께 돌아오지는 않습니다. 거짓된 지도력과 서로를 삼키는 폭력, 가난한 이의 권리를 빼앗는 법이 공동체를 태웁니다. 반복되는 ‘그 손이 여전히 펴지셨다’는 선언은 죄를 가볍게 넘기지 않으시는 하나님의 단호함을 보여 줍니다.",
        "마음에 비추기 — 실패 뒤에 더 강해지는 것만으로는 새로워질 수 없습니다. 내 마음과 관계가 하나님께로 돌아오지 않으면, 겉으로 복구한 성공 아래에 같은 교만과 불공정이 남습니다. 하나님은 특히 힘없는 사람을 희생시키는 말과 제도를 살피십니다.",
        "오늘의 한 걸음 — 내가 요즘 합리화하는 잘못 한 가지를 적고, 변명 대신 돌이키는 행동을 하나 정해 보세요. 내 선택 때문에 불편하거나 손해 본 사람이 있다면 오늘 먼저 사과하거나 바로잡아 봅시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d2",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.5.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "10:5",
          "reference": "이사야 10:5",
          "text": "화 있을진저 앗수르 사람이여 그는 나의 진노의 막대기요 그 손의 몽둥이는 나의 분한이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.5.KRV"
        },
        {
          "number": "10:6",
          "reference": "이사야 10:6",
          "text": "내가 그를 보내어 한 나라를 치게 하며 내가 그에게 명하여 나의 노한 백성을 쳐서 탈취하며 노략하게 하며 또 그들을 가로상의 진흙 같이 짓밟게 하려 하거늘",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.6.KRV"
        },
        {
          "number": "10:7",
          "reference": "이사야 10:7",
          "text": "그의 뜻은 이같지 아니하며 그 마음의 생각도 이같지 아니하고 오직 그 마음에 허다한 나라를 파괴하며 멸절하려 하여",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.7.KRV"
        },
        {
          "number": "10:8",
          "reference": "이사야 10:8",
          "text": "이르기를 나의 방백들은 다 왕이 아니냐",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.8.KRV"
        },
        {
          "number": "10:9",
          "reference": "이사야 10:9",
          "text": "갈로는 갈그미스와 같지 아니하며 하맛은 아르밧과 같지 아니하며 사마리아는 다메섹과 같지 아니하냐",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.9.KRV"
        },
        {
          "number": "10:10",
          "reference": "이사야 10:10",
          "text": "내 손이 이미 신상을 섬기는 나라에 미쳤나니 그 조각한 신상이 예루살렘과 사마리아의 신상보다 우승하였느니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.10.KRV"
        },
        {
          "number": "10:11",
          "reference": "이사야 10:11",
          "text": "내가 사마리아와 그 신상에게 행함 같이 예루살렘과 그 신상에게 행치 못하겠느냐 하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.11.KRV"
        },
        {
          "number": "10:12",
          "reference": "이사야 10:12",
          "text": "이러므로 주 내가 나의 일을 시온산과 예루살렘에 다 행한 후에 앗수르 왕의 완악한 마음의 열매와 높은 눈의 자랑을 벌하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.12.KRV"
        },
        {
          "number": "10:13",
          "reference": "이사야 10:13",
          "text": "그의 말에 나는 내 손의 힘과 내 지혜로 이 일을 행하였나니 나는 총명한 자라 열국의 경계를 옮겼고 그 재물을 약탈하였으며 또 용감한 자 같이 위에 거한 자를 낮추었으며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.13.KRV"
        },
        {
          "number": "10:14",
          "reference": "이사야 10:14",
          "text": "나의 손으로 열국의 재물을 얻은 것은 새의 보금자리를 얻음 같고 온 세계를 얻은 것은 내어버린 알을 주움 같았으나 날개를 치거나 입을 벌리거나 지저귀는 것이 하나도 없었다 하는도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.14.KRV"
        },
        {
          "number": "10:15",
          "reference": "이사야 10:15",
          "text": "도끼가 어찌 찍는 자에게 스스로 자랑하겠으며 톱이 어찌 켜는 자에게 스스로 큰 체 하겠느냐 이는 막대기가 자기를 드는 자를 움직이려 하며 몽둥이가 나무 아닌 사람을 들려 함과 일반이로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.15.KRV"
        },
        {
          "number": "10:16",
          "reference": "이사야 10:16",
          "text": "그러므로 주 만군의 여호와께서 살찐 자로 파리하게 하시며 그 영화의 아래에 불이 붙는 것 같이 맹렬히 타게 하실 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.16.KRV"
        },
        {
          "number": "10:17",
          "reference": "이사야 10:17",
          "text": "이스라엘의 빛은 불이요 그 거룩한 자는 불꽃이라 하루 사이에 그의 형극과 질려가 소멸되며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.17.KRV"
        },
        {
          "number": "10:18",
          "reference": "이사야 10:18",
          "text": "그 삼림과 기름진 밭의 영광이 전부 소멸되리니 병인이 점점 쇠약하여감 같을 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.18.KRV"
        },
        {
          "number": "10:19",
          "reference": "이사야 10:19",
          "text": "그 삼림에 남은 나무의 수가 희소하여 아이라도 능히 계산할 수 있으리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.19.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d2",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-07-28",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "도구가 주인인 듯 자랑할 때",
      "paragraphs": [
        "맥락과 뜻 — 앗수르는 하나님의 심판을 수행하는 막대기로 쓰이지만, 스스로 모든 나라를 삼키려 하고 자기 힘을 자랑합니다. 도끼가 자기를 드는 사람보다 높을 수 없듯, 도구인 제국이 주인인 듯 행할 수는 없습니다. 하나님은 앗수르의 오만을 꺾어 그 화려한 힘을 쇠하게 하십니다.",
        "마음에 비추기 — 좋은 결과가 나왔다고 해서 내 동기와 방식까지 모두 옳았다는 뜻은 아닙니다. 능력과 기회는 내가 우월하다는 증거가 아니라 맡겨진 도구입니다. 하나님은 성취보다 그 힘을 누구를 위해, 어떤 태도로 사용했는지 물으십니다.",
        "오늘의 한 걸음 — 최근 잘된 일 하나를 떠올리고 도움을 준 사람과 환경을 구체적으로 적어 감사해 보세요. 오늘 가진 영향력 하나는 나를 드러내기보다 약한 사람을 보호하는 데 사용합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d3",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.20.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "10:20",
          "reference": "이사야 10:20",
          "text": "그 날에 이스라엘의 남은 자와 야곱 족속의 피난한 자들이 다시 자기를 친 자를 의뢰치 아니하고 이스라엘의 거룩하신 자 여호와를 진실히 의뢰하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.20.KRV"
        },
        {
          "number": "10:21",
          "reference": "이사야 10:21",
          "text": "남은 자 곧 야곱의 남은 자가 능하신 하나님께로 돌아올 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.21.KRV"
        },
        {
          "number": "10:22",
          "reference": "이사야 10:22",
          "text": "이스라엘이여 네 백성이 바다의 모래 같을지라도 남은 자만 돌아오리니 넘치는 공의로 훼멸이 작정되었음이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.22.KRV"
        },
        {
          "number": "10:23",
          "reference": "이사야 10:23",
          "text": "이미 작정되었은즉 주 만군의 여호와께서 온 세계 중에 끝까지 행하시리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.23.KRV"
        },
        {
          "number": "10:24",
          "reference": "이사야 10:24",
          "text": "주 만군의 여호와께서 가라사대 시온에 거한 나의 백성들아 앗수르 사람이 애굽을 본받아 막대기로 너를 때리며 몽둥이를 들어 너를 칠지라도 그를 두려워 말라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.24.KRV"
        },
        {
          "number": "10:25",
          "reference": "이사야 10:25",
          "text": "내가 불구에 네게는 분을 그치고 노를 옮겨 그들을 멸하리라 하시도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.25.KRV"
        },
        {
          "number": "10:26",
          "reference": "이사야 10:26",
          "text": "만군의 여호와께서 채찍을 들어 그를 치시되 오렙 반석에서 미디안 사람을 쳐 죽이신 것 같이 하실 것이며 막대기를 드시되 바다를 향하여 애굽에 드신 것 같이 하실 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.26.KRV"
        },
        {
          "number": "10:27",
          "reference": "이사야 10:27",
          "text": "그 날에 그의 무거운 짐이 네 어깨에서 떠나고 그의 멍에가 네 목에서 벗어지되 기름진 까닭에 멍에가 부러지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.27.KRV"
        },
        {
          "number": "10:28",
          "reference": "이사야 10:28",
          "text": "앗수르 왕이 아얏에 이르러 미그론을 지나 믹마스에 치중을 머무르고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.28.KRV"
        },
        {
          "number": "10:29",
          "reference": "이사야 10:29",
          "text": "영을 넘어 게바에서 유숙하매 라마는 떨고 사울의 기브아 사람은 도망하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.29.KRV"
        },
        {
          "number": "10:30",
          "reference": "이사야 10:30",
          "text": "딸 갈림아 큰 소리로 외칠지어다 라이사야 자세히 들을지어다 가련하다 너 아나돗이여",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.30.KRV"
        },
        {
          "number": "10:31",
          "reference": "이사야 10:31",
          "text": "맛메나 사람은 피난하며 게빔 거민은 도망하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.31.KRV"
        },
        {
          "number": "10:32",
          "reference": "이사야 10:32",
          "text": "이 날에 그가 놉에서 쉬고 딸 시온 산 곧 예루살렘 산을 향하여 그 손을 흔들리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.32.KRV"
        },
        {
          "number": "10:33",
          "reference": "이사야 10:33",
          "text": "주 만군의 여호와께서 혁혁한 위력으로 그 가지를 꺾으시리니 그 장대한 자가 찍힐 것이요 높은 자가 낮아질 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.33.KRV"
        },
        {
          "number": "10:34",
          "reference": "이사야 10:34",
          "text": "철로 그 빽빽한 삼림을 베시리니 레바논이 권능 있는 자에게 작벌을 당하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.10.34.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d3",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-07-29",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "남은 자가 돌아오는 길",
      "paragraphs": [
        "맥락과 뜻 — 심판을 지나 남은 이들은 더는 자신을 때린 강대국을 의지하지 않고 하나님께 진실하게 돌아옵니다. 앗수르 군대가 예루살렘 가까이 밀려오는 듯하지만, 하나님은 시온에게 두려워하지 말라고 하시며 그 멍에를 벗기겠다고 약속하십니다. 높이 솟은 숲 같은 권세도 주 앞에서는 베임을 당합니다.",
        "마음에 비추기 — 두려울수록 우리는 힘 있어 보이는 대상에 기대기 쉽지만, 그 대상이 오히려 우리를 얽맬 수 있습니다. 믿음은 위험이 없다고 우기는 것이 아니라, 위험보다 크신 하나님께 의지할 곳을 옮기는 일입니다. 하나님은 화려한 다수가 아니라 진실하게 돌아오는 남은 사람을 통해 새 길을 여십니다.",
        "오늘의 한 걸음 — 지금 가장 두려운 일을 한 문장으로 적고, 그것을 통제하려고 붙든 잘못된 의지가 없는지 살펴보세요. 걱정을 반복하는 대신 오늘 할 수 있는 정직하고 충실한 한 행동을 실천합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d4",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "11:1",
          "reference": "이사야 11:1",
          "text": "이새의 줄기에서 한 싹이 나며 그 뿌리에서 한 가지가 나서 결실할 것이요",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.1.KRV"
        },
        {
          "number": "11:2",
          "reference": "이사야 11:2",
          "text": "여호와의 신 곧 지혜와 총명의 신이요 모략과 재능의 신이요 지식과 여호와를 경외하는 신이 그 위에 강림하시리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.2.KRV"
        },
        {
          "number": "11:3",
          "reference": "이사야 11:3",
          "text": "그가 여호와를 경외함으로 즐거움을 삼을 것이며 그 눈에 보이는 대로 심판치 아니하며 귀에 들리는 대로 판단치 아니하며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.3.KRV"
        },
        {
          "number": "11:4",
          "reference": "이사야 11:4",
          "text": "공의로 빈핍한 자를 심판하며 정직으로 세상의 겸손한 자를 판단할 것이며 그 입의 막대기로 세상을 치며 입술의 기운으로 악인을 죽일 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.4.KRV"
        },
        {
          "number": "11:5",
          "reference": "이사야 11:5",
          "text": "공의로 그 허리띠를 삼으며 성실로 몸의 띠를 삼으리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.5.KRV"
        },
        {
          "number": "11:6",
          "reference": "이사야 11:6",
          "text": "그 때에 이리가 어린 양과 함께 거하며 표범이 어린 염소와 함께 누우며 송아지와 어린 사자와 살찐 짐승이 함께 있어 어린 아이에게 끌리며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.6.KRV"
        },
        {
          "number": "11:7",
          "reference": "이사야 11:7",
          "text": "암소와 곰이 함께 먹으며 그것들의 새끼가 함께 엎드리며 사자가 소처럼 풀을 먹을 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.7.KRV"
        },
        {
          "number": "11:8",
          "reference": "이사야 11:8",
          "text": "젖먹는 아이가 독사의 구멍에서 장난하며 젖뗀 어린 아이가 독사의 굴에 손을 넣을 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.8.KRV"
        },
        {
          "number": "11:9",
          "reference": "이사야 11:9",
          "text": "나의 거룩한 산 모든 곳에서 해됨도 없고 상함도 없을 것이니 이는 물이 바다를 덮음 같이 여호와를 아는 지식이 세상에 충만할 것임이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.9.KRV"
        },
        {
          "number": "11:10",
          "reference": "이사야 11:10",
          "text": "그 날에 이새의 뿌리에서 한 싹이 나서 만민의 기호로 설 것이요 열방이 그에게로 돌아오리니 그 거한 곳이 영화로우리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.10.KRV"
        },
        {
          "number": "11:11",
          "reference": "이사야 11:11",
          "text": "그 날에 주께서 다시 손을 펴사 그 남은 백성을 앗수르와 애굽과 바드로스와 구스와 엘람과 시날과 하맛과 바다 섬들에서 돌아오게 하실 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.11.KRV"
        },
        {
          "number": "11:12",
          "reference": "이사야 11:12",
          "text": "여호와께서 열방을 향하여 기호를 세우시고 이스라엘의 쫓긴 자를 모으시며 땅 사방에서 유다의 이산한 자를 모으시리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.12.KRV"
        },
        {
          "number": "11:13",
          "reference": "이사야 11:13",
          "text": "에브라임의 투기는 없어지고 유다를 괴롭게 하던 자는 끊어지며 에브라임은 유다를 투기하지 아니하며 유다는 에브라임을 괴롭게 하지 아니할 것이요",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.13.KRV"
        },
        {
          "number": "11:14",
          "reference": "이사야 11:14",
          "text": "그들이 서으로 블레셋 사람의 어깨에 날아 앉고 함께 동방 백성을 노략하며 에돔과 모압에 손을 대며 암몬 자손을 자기에게 복종시키리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.14.KRV"
        },
        {
          "number": "11:15",
          "reference": "이사야 11:15",
          "text": "여호와께서 애굽 해고를 말리우시고 손을 유브라데 하수 위에 흔들어 뜨거운 바람을 일으켜서 그 하수를 쳐서 일곱 갈래로 나눠 신 신고 건너가게 하실 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.15.KRV"
        },
        {
          "number": "11:16",
          "reference": "이사야 11:16",
          "text": "그의 남아 있는 백성을 위하여 앗수르에서부터 돌아오는 대로가 있게 하시되 이스라엘이 애굽 땅에서 나오던 날과 같게 하시리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.11.16.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d4",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-07-30",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "이새의 줄기에서 피는 평화",
      "paragraphs": [
        "맥락과 뜻 — 베인 그루터기처럼 보이는 다윗 왕조에서 새싹이 나고, 여호와의 영이 그 왕 위에 머뭅니다. 그는 겉모습이나 소문이 아니라 공의로 가난한 사람을 판단하며, 해치는 일이 사라지고 하나님을 아는 지식이 땅에 가득한 평화를 이룹니다. 흩어진 백성과 갈라진 형제도 다시 모여 새 출애굽의 길을 걷습니다.",
        "마음에 비추기 — 하나님이 이루시는 회복은 단순히 과거의 영광을 되찾는 일이 아니라, 약자가 안전하고 원수였던 이들이 함께 사는 새로운 질서입니다. 성령이 주시는 지혜는 사람을 빨리 단정하기보다 공정하게 듣고 살리는 데 나타납니다. 작은 화해의 싹도 하나님 나라의 평화를 미리 보여 줍니다.",
        "오늘의 한 걸음 — 내가 소문이나 첫인상으로 판단한 사람이 있다면 한 번 더 공정하게 바라보세요. 갈라진 관계 하나에 먼저 안부를 묻거나, 편견 때문에 멀리했던 사람의 말을 차분히 들어 봅시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d5",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "12:1",
          "reference": "이사야 12:1",
          "text": "그 날에 네가 말하기를 여호와여 주께서 전에는 내게 노하셨사오나 이제는 그 노가 쉬었고 또 나를 안위하시오니 내가 주께 감사겠나이다 할 것이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.1.KRV"
        },
        {
          "number": "12:2",
          "reference": "이사야 12:2",
          "text": "보라 하나님은 나의 구원이시라 내가 의뢰하고 두려움이 없으리니 주 여호와는 나의 힘이시며 나의 노래시며 나의 구원이심이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.2.KRV"
        },
        {
          "number": "12:3",
          "reference": "이사야 12:3",
          "text": "그러므로 너희가 기쁨으로 구원의 우물들에서 물을 길으리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.3.KRV"
        },
        {
          "number": "12:4",
          "reference": "이사야 12:4",
          "text": "그 날에 너희가 또 말하기를 여호와께 감사하라 그 이름을 부르며 그 행하심을 만국 중에 선포하며 그 이름이 높다 하라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.4.KRV"
        },
        {
          "number": "12:5",
          "reference": "이사야 12:5",
          "text": "여호와를 찬송할 것은 극히 아름다운 일을 하셨음이니 온 세계에 알게 할지어다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.5.KRV"
        },
        {
          "number": "12:6",
          "reference": "이사야 12:6",
          "text": "시온의 거민아 소리를 높여 부르라 이스라엘의 거룩하신 자가 너희 중에서 크심이니라 할 것이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.12.6.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d5",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-07-31",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "구원의 우물에서 길은 기쁨",
      "paragraphs": [
        "맥락과 뜻 — 심판의 경고 뒤에 구원받은 공동체의 노래가 울립니다. 하나님의 진노가 돌이켜 위로가 되고, 두려움 대신 신뢰가 자리 잡으며, 백성은 기쁨으로 구원의 우물에서 물을 긷습니다. 받은 은혜는 개인의 안도에 머물지 않고 모든 민족에게 하나님의 행하심을 알리는 찬양으로 퍼집니다.",
        "마음에 비추기 — 구원은 내 힘으로 버텨 낸 결과가 아니라 하나님이 가까이 계셔서 주시는 물과 같습니다. 감사는 현실의 어려움을 지우지 않지만, 두려움만 말하던 입에 새로운 이야기를 줍니다. 하나님이 하신 일을 기억할수록 마음은 다시 신뢰를 배웁니다.",
        "오늘의 한 걸음 — 오늘 감사할 일 세 가지를 짧게 적고, 그중 하나는 가까운 사람에게 나눠 보세요. 막연한 낙관 대신 하나님이 실제로 도우셨던 한 장면을 떠올리며 감사합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d6",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "13:1",
          "reference": "이사야 13:1",
          "text": "아모스의 아들 이사야가 바벨론에 대하여 받은 경고라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.1.KRV"
        },
        {
          "number": "13:2",
          "reference": "이사야 13:2",
          "text": "너희는 자산 위에 기호를 세우고 소리를 높여 그들을 부르며 손을 흔들어 그들로 존귀한 자의 문에 들어가게 하라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.2.KRV"
        },
        {
          "number": "13:3",
          "reference": "이사야 13:3",
          "text": "내가 나의 거룩히 구별한 자에게 명하고 나의 위엄을 기뻐하는 용사들을 불러 나의 노를 풀게 하였느니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.3.KRV"
        },
        {
          "number": "13:4",
          "reference": "이사야 13:4",
          "text": "산에서 무리의 소리가 남이여 많은 백성의 소리 같으니 곧 열국 민족이 함께 모여 떠드는 소리라 만군의 여호와께서 싸움을 위하여 군대를 검열하심이로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.4.KRV"
        },
        {
          "number": "13:5",
          "reference": "이사야 13:5",
          "text": "무리가 먼 나라에서, 하늘 가에서 왔음이여 곧 여호와와 그 진노의 병기라 온 땅을 멸하려 함이로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.5.KRV"
        },
        {
          "number": "13:6",
          "reference": "이사야 13:6",
          "text": "너희는 애곡할지어다 여호와의 날이 가까웠으니 전능자에게서 멸망이 임할 것임이로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.6.KRV"
        },
        {
          "number": "13:7",
          "reference": "이사야 13:7",
          "text": "그러므로 모든 손이 피곤하며 각 사람의 마음이 녹을 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.7.KRV"
        },
        {
          "number": "13:8",
          "reference": "이사야 13:8",
          "text": "그들이 놀라며 괴로움과 슬픔에 잡혀서 임산한 여자 같이 고통하며 서로 보고 놀라며 얼굴은 불꽃 같으리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.8.KRV"
        },
        {
          "number": "13:9",
          "reference": "이사야 13:9",
          "text": "여호와의 날 곧 잔혹히 분냄과 맹렬히 노하는 날이 임하여 땅을 황무케 하며 그 중에서 죄인을 멸하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.9.KRV"
        },
        {
          "number": "13:10",
          "reference": "이사야 13:10",
          "text": "하늘의 별들과 별 떨기가 그 빛을 내지 아니하며 해가 돋아도 어두우며 달이 그 빛을 비취지 아니할 것이로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.10.KRV"
        },
        {
          "number": "13:11",
          "reference": "이사야 13:11",
          "text": "내가 세상의 악과 악인의 죄를 벌하며 교만한 자의 오만을 끊으며 강포한 자의 거만을 낮출 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.11.KRV"
        },
        {
          "number": "13:12",
          "reference": "이사야 13:12",
          "text": "내가 사람을 정금보다 희소케 하며 오빌의 순금보다 희귀케 하리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.12.KRV"
        },
        {
          "number": "13:13",
          "reference": "이사야 13:13",
          "text": "나 만군의 여호와가 분하여 맹렬히 노하는 날에 하늘을 진동시키며 땅을 흔들어 그 자리에서 떠나게 하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.13.KRV"
        },
        {
          "number": "13:14",
          "reference": "이사야 13:14",
          "text": "그들이 쫓긴 노루나 모으는 자 없는 양 같이 각기 동족에게로 돌아가며 본향으로 도망할 것이나",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.14.KRV"
        },
        {
          "number": "13:15",
          "reference": "이사야 13:15",
          "text": "만나는 자는 창에 찔리겠고 잡히는 자는 칼에 엎드러지겠고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.15.KRV"
        },
        {
          "number": "13:16",
          "reference": "이사야 13:16",
          "text": "그들의 어린 아이들은 그 목전에 메어침을 입겠고 그 집은 노략을 당하겠고 그 아내는 욕을 당하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.16.KRV"
        },
        {
          "number": "13:17",
          "reference": "이사야 13:17",
          "text": "보라 은을 돌아보지 아니하며 금을 기뻐하지 아니하는 메대 사람을 내가 격동시켜 그들을 치게 하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.17.KRV"
        },
        {
          "number": "13:18",
          "reference": "이사야 13:18",
          "text": "메대 사람이 활로 청년을 쏘아 죽이며 태의 열매를 긍휼히 여기지 아니하며 아이를 가석히 보지 아니하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.18.KRV"
        },
        {
          "number": "13:19",
          "reference": "이사야 13:19",
          "text": "열국의 영광이요 갈대아 사람의 자랑하는 노리개가 된 바벨론이 하나님께 멸망 당한 소돔과 고모라 같이 되리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.19.KRV"
        },
        {
          "number": "13:20",
          "reference": "이사야 13:20",
          "text": "그곳에 처할 자가 없겠고 거할 사람이 대대에 없을 것이며 아라비아 사람도 거기 장막을 치지 아니하며 목자들도 그곳에 그 양떼를 쉬게 하지 아니할 것이요",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.20.KRV"
        },
        {
          "number": "13:21",
          "reference": "이사야 13:21",
          "text": "오직 들짐승들이 거기 엎드리고 부르짖는 짐승이 그 가옥에 충만하며 타조가 거기 깃들이며 들 양이 거기서 뛸 것이요",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.21.KRV"
        },
        {
          "number": "13:22",
          "reference": "이사야 13:22",
          "text": "그 궁성에는 시랑이 부르짖을 것이요 화려한 전에는 들개가 울 것이라 그의 때가 가까우며 그의 날이 오래지 아니하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.13.22.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d6",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-01",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "교만한 제국의 끝",
      "paragraphs": [
        "맥락과 뜻 — 하나님은 바벨론을 치는 군대를 부르시고, ‘여호와의 날’에 인간의 교만과 잔혹한 권세를 낮추십니다. 하늘과 땅이 흔들리는 이미지와 황폐해진 도시는 가장 강해 보이는 제국도 영원하지 않음을 드러냅니다. 심판의 장면은 폭력을 즐기라는 말이 아니라, 폭력으로 세운 세계의 끝을 엄중히 보여 줍니다.",
        "마음에 비추기 — 규모와 성공이 크다고 해서 그 안의 불의가 사라지는 것은 아닙니다. 하나님은 아무도 멈출 수 없어 보이는 권력도 책임을 묻고, 억눌린 이들의 고통을 잊지 않으십니다. 그러므로 우리는 강한 편에 서는 것보다 옳은 편에 서는 일을 선택해야 합니다.",
        "오늘의 한 걸음 — 내가 편리함 때문에 눈감은 불공정 한 가지를 찾아보세요. 작은 이익을 포기하더라도 해를 키우는 선택에서 물러나고, 피해를 입는 사람을 위해 기도하거나 실제 도움을 보냅시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d7",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "14:1",
          "reference": "이사야 14:1",
          "text": "여호와께서 야곱을 긍휼히 여기시며 이스라엘을 다시 택하여 자기 고토에 두시리니 나그네 된 자가 야곱 족속에게 가입되어 그들과 연합할 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.1.KRV"
        },
        {
          "number": "14:2",
          "reference": "이사야 14:2",
          "text": "민족들이 그들을 데리고 그들의 본토에 돌아오리니 이스라엘 족속이 어호와의 땅에서 그들을 얻어 노비를 삼겠고 전에 자기를 사로잡던 자를 사로잡고 자기를 압제하던 자를 주관하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.2.KRV"
        },
        {
          "number": "14:3",
          "reference": "이사야 14:3",
          "text": "여호와께서 너를 슬픔과 곤고와 및 너의 수고하는 고역에서 놓으시고 안식을 주시는 날에",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.3.KRV"
        },
        {
          "number": "14:4",
          "reference": "이사야 14:4",
          "text": "너는 바벨론 왕에 대하여 이 노래를 지어 이르기를 학대하던 자가 어찌 그리 그쳤으며 강포한 성이 어찌 그리 폐하였는고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.4.KRV"
        },
        {
          "number": "14:5",
          "reference": "이사야 14:5",
          "text": "여호와께서 악인의 몽둥이와 패권자의 홀을 꺾으셨도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.5.KRV"
        },
        {
          "number": "14:6",
          "reference": "이사야 14:6",
          "text": "그들이 분내어 여러 민족을 치되 치기를 마지 아니하였고 노하여 열방을 억압하여도 그 억압을 막을 자 없었더니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.6.KRV"
        },
        {
          "number": "14:7",
          "reference": "이사야 14:7",
          "text": "이제는 온 땅이 평안하고 정온하니 무리가 소리질러 노래하는도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.7.KRV"
        },
        {
          "number": "14:8",
          "reference": "이사야 14:8",
          "text": "향나무와 레바논 백향목도 너로 인하여 기뻐하여 이르기를 네가 넘어뜨리웠은즉 올라와서 우리를 작벌할 자 없다 하는도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.8.KRV"
        },
        {
          "number": "14:9",
          "reference": "이사야 14:9",
          "text": "아래의 음부가 너로 인하여 소동하여 너의 옴을 영접하되 그것이 세상에서의 모든 영웅을 너로 인하여 동하게 하며 열방의 모든 왕으로 그 보좌에서 일어서게 하므로",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.9.KRV"
        },
        {
          "number": "14:10",
          "reference": "이사야 14:10",
          "text": "그들은 다 네게 말하여 이르기를 너도 우리 같이 연약하게 되었느냐 너도 우리 같이 되었느냐 하리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.10.KRV"
        },
        {
          "number": "14:11",
          "reference": "이사야 14:11",
          "text": "네 영화가 음부에 떨어졌음이여 너의 비파 소리까지로다 구더기가 네 아래 깔림이여 지렁이가 너를 덮었도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.11.KRV"
        },
        {
          "number": "14:12",
          "reference": "이사야 14:12",
          "text": "너 아침의 아들 계명성이여 어찌 그리 하늘에서 떨어졌으며 너 열국을 엎은 자여 어찌 그리 땅에 찍혔는고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.12.KRV"
        },
        {
          "number": "14:13",
          "reference": "이사야 14:13",
          "text": "네가 네 마음에 이르기를 내가 하늘에 올라 하나님의 뭇별 위에 나의 보좌를 높이리라 내가 북극 집회의 산 위에 좌정하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.13.KRV"
        },
        {
          "number": "14:14",
          "reference": "이사야 14:14",
          "text": "가장 높은 구름에 올라 지극히 높은 자와 비기리라 하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.14.KRV"
        },
        {
          "number": "14:15",
          "reference": "이사야 14:15",
          "text": "그러나 이제 네가 음부 곧 구덩이의 맨 밑에 빠치우리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.15.KRV"
        },
        {
          "number": "14:16",
          "reference": "이사야 14:16",
          "text": "너를 보는 자가 주목하여 너를 자세히 살펴 보며 말하기를 이 사람이 땅을 진동시키며 열국을 경동시키며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.16.KRV"
        },
        {
          "number": "14:17",
          "reference": "이사야 14:17",
          "text": "세계를 황무케 하며 성읍을 파괴하며 사로잡힌 자를 그 집으로 놓아 보내지 않던 자가 아니뇨 하리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.17.KRV"
        },
        {
          "number": "14:18",
          "reference": "이사야 14:18",
          "text": "열방의 왕들은 모두 각각 자기 집에서 영광 중에 자건마는",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.18.KRV"
        },
        {
          "number": "14:19",
          "reference": "이사야 14:19",
          "text": "오직 너는 자기 무덤에서 내어쫓겼으니 가증한 나무가지 같고 칼에 찔려 돌구덩이에 빠진 주검에 둘러싸였으니 밟힌 시체와 같도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.19.KRV"
        },
        {
          "number": "14:20",
          "reference": "이사야 14:20",
          "text": "네가 자기 땅을 망케 하였고 자기 백성을 죽였으므로 그들과 일반으로 안장함을 얻지 못하나니 악을 행하는 자의 후손은 영영히 이름이 나지 못하리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.20.KRV"
        },
        {
          "number": "14:21",
          "reference": "이사야 14:21",
          "text": "너희는 그들의 열조의 죄악을 인하여 그 자손 도륙하기를 예비하여 그들로 일어나 땅을 취하여 세상에 성읍을 충만케 하지 못하게 하라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.21.KRV"
        },
        {
          "number": "14:22",
          "reference": "이사야 14:22",
          "text": "만군의 여호와께서 말씀하시되 내가 일어나 그들을 쳐서 그 이름과 남은 자와 아들과 후손을 바벨론에서 끊으리라 나 여호와의 말이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.22.KRV"
        },
        {
          "number": "14:23",
          "reference": "이사야 14:23",
          "text": "내가 또 그것으로 고슴도치의 굴혈과 물웅덩이가 되게 하고 또 멸망의 비로 소제하리라 나 만군의 여호와의 말이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.23.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d7",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-02",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "높아지려던 왕의 추락",
      "paragraphs": [
        "맥락과 뜻 — 하나님은 야곱을 불쌍히 여기시고 포로 생활에서 쉬게 하신 뒤, 압제하던 바벨론 왕을 향한 노래를 부르게 하십니다. 하늘까지 올라 보좌를 높이겠다는 왕의 야망은 죽음 앞에서 무너지고, 남을 폐허로 만든 통치자는 자신의 이름과 왕조도 지키지 못합니다. 하나님은 바벨론을 쓸어 버려 교만한 억압의 반복을 끊으십니다.",
        "마음에 비추기 — ‘내가 올라가겠다’는 마음은 다른 사람을 디딤돌로 만들기 쉽습니다. 지위와 명성은 죽음을 넘어 우리를 지켜 주지 못하지만, 하나님은 짓눌린 사람에게 쉼을 주십니다. 참된 높아짐은 자리를 차지하는 데 있지 않고, 맡은 자리에서 사람을 살리는 데 있습니다.",
        "오늘의 한 걸음 — 오늘 계획 속 ‘내가 인정받아야 한다’는 욕심을 한 가지 내려놓아 보세요. 내 성과를 위해 밀어붙였던 사람이 있다면 그의 수고를 인정하고, 먼저 섬기거나 사과합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d8",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.24.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "14:24",
          "reference": "이사야 14:24",
          "text": "만군의 여호와께서 맹세하여 가라사대 나의 생각한 것이 반드시 되며 나의 경영한 것이 반드시 이루리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.24.KRV"
        },
        {
          "number": "14:25",
          "reference": "이사야 14:25",
          "text": "내가 앗수르 사람을 나의 땅에서 파하며 나의 산에서 발아래 밟으리니 그 때에 그의 멍에가 이스라엘에게서 떠나고 그의 짐이 그들의 어깨에서 벗어질 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.25.KRV"
        },
        {
          "number": "14:26",
          "reference": "이사야 14:26",
          "text": "이것이 온 세계를 향하여 정한 경영이며 이것이 열방을 향하여 편 손이라 하셨나니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.26.KRV"
        },
        {
          "number": "14:27",
          "reference": "이사야 14:27",
          "text": "만군의 여호와께서 경영하셨은즉 누가 능히 그것을 폐하며 그 손을 펴셨은즉 누가 능히 그것을 돌이키랴",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.27.KRV"
        },
        {
          "number": "14:28",
          "reference": "이사야 14:28",
          "text": "아하스 왕의 죽던 해에 받은 경고라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.28.KRV"
        },
        {
          "number": "14:29",
          "reference": "이사야 14:29",
          "text": "블레셋 온 땅이여 너를 치던 막대기가 부러졌다고 기뻐하지 말라 뱀의 뿌리에서는 독사가 나겠고 그 열매는 나는 불뱀이 되리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.29.KRV"
        },
        {
          "number": "14:30",
          "reference": "이사야 14:30",
          "text": "가난한 자의 장자는 먹겠고 빈핍한 자는 평안히 누우려니와 내가 너의 뿌리를 기근으로 죽일 것이요 너의 남은 자는 살륙을 당하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.30.KRV"
        },
        {
          "number": "14:31",
          "reference": "이사야 14:31",
          "text": "성문이여 슬피 울지어다 성읍이여 부르짖을지어다 너 블레셋이여 다 소멸되게 되었도다 대저 연기가 북방에서 오는데 그 항오를 떨어져 행하는 자 없느니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.31.KRV"
        },
        {
          "number": "14:32",
          "reference": "이사야 14:32",
          "text": "그 나라 사신들에게 어떻게 대답하겠느냐 여호와께서 시온을 세우셨으니 그의 백성의 곤고한 자들이 그 안에서 피난하리라 할 것이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.14.32.KRV"
        },
        {
          "number": "15:1",
          "reference": "이사야 15:1",
          "text": "모압에 관한 경고라 하루 밤에 모압 알이 망하여 황폐할 것이며 하루 밤에 모압 길이 망하여 황폐할 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.1.KRV"
        },
        {
          "number": "15:2",
          "reference": "이사야 15:2",
          "text": "그들은 바잇과 디본 산당에 올라가서 울며 모압은 느보와 메드바를 위하여 통곡하도다 그들이 각각 머리털을 없이 하였고 수염을 깎았으며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.2.KRV"
        },
        {
          "number": "15:3",
          "reference": "이사야 15:3",
          "text": "거리에서는 굵은 베로 몸을 동였으며 지붕과 넓은 곳에서는 각기 애통하여 심히 울며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.3.KRV"
        },
        {
          "number": "15:4",
          "reference": "이사야 15:4",
          "text": "헤스본과 엘르알레는 부르짖으며 그 소리는 야하스까지 들리니 그러므로 모압의 전사가 크게 부르짖으며 그 혼이 속에서 떨도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.4.KRV"
        },
        {
          "number": "15:5",
          "reference": "이사야 15:5",
          "text": "내 마음이 모압을 위하여 부르짖는도다 그 귀인들은 소알과 에글랏 슬리시야로 도망하여 울며 루힛 비탈길로 올라가며 호로나임 길에서 패망을 부르짖으니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.5.KRV"
        },
        {
          "number": "15:6",
          "reference": "이사야 15:6",
          "text": "니므림 물이 마르고 풀이 시들었으며 연한 풀이 말라 청청한 것이 없음이로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.6.KRV"
        },
        {
          "number": "15:7",
          "reference": "이사야 15:7",
          "text": "그러므로 그들이 얻은 재물과 쌓았던 것을 가지고 버드나무 시내를 건너리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.7.KRV"
        },
        {
          "number": "15:8",
          "reference": "이사야 15:8",
          "text": "이는 곡성이 모압 사방에 둘렸고 슬피 부르짖음이 에글라임에 이르며 부르짖음이 브엘엘림에 미치며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.8.KRV"
        },
        {
          "number": "15:9",
          "reference": "이사야 15:9",
          "text": "디몬 물에는 피가 가득함이로다 그럴지라도 내가 디몬에 재앙을 더 내리되 모압에 도피한 자와 그 땅의 남은 자에게 사자를 보내리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.15.9.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d8",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-03",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "심판 가운데 들리는 울음",
      "paragraphs": [
        "맥락과 뜻 — 하나님은 앗수르를 꺾겠다는 뜻이 반드시 이루어진다고 선언하시고, 블레셋에게 한 압제자의 죽음을 성급히 기뻐하지 말라고 경고하십니다. 반면 시온은 가난한 이들의 피난처가 됩니다. 이어지는 모압의 노래에서는 여러 성읍이 무너지고 피난민의 울음이 땅을 채우며, 예언자도 그 슬픔을 외면하지 않습니다.",
        "마음에 비추기 — 하나님의 정의를 믿는 것은 미워하는 사람의 고통을 즐기는 것과 다릅니다. 악은 심판받아야 하지만, 무너짐 속에서 울고 떠도는 사람의 아픔도 보아야 합니다. 하나님 편에 선 공동체는 승리를 자랑하는 곳보다 가난한 이가 피할 수 있는 곳에 가깝습니다.",
        "오늘의 한 걸음 — 마음이 불편한 사람이나 집단의 어려움도 한 번 진심으로 위해 기도해 보세요. 주변의 외롭거나 밀려난 사람에게 자리와 시간을 내어 주어 작은 피난처가 되어 줍시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d9",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "16:1",
          "reference": "이사야 16:1",
          "text": "너희는 이 땅 치리자에게 어린 양들을 드리되 셀라에서부터 광야를 지나 딸 시온 산으로 보낼지니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.1.KRV"
        },
        {
          "number": "16:2",
          "reference": "이사야 16:2",
          "text": "모압의 여자들은 아르논 나루에서 떠다니는 새 같고 보금자리에서 흩어진 새 새끼 같을 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.2.KRV"
        },
        {
          "number": "16:3",
          "reference": "이사야 16:3",
          "text": "너는 모략을 베풀며 공의로 판결하며 오정 때에 밤 같이 그늘을 짓고 쫓겨난 자를 숨기며 도망한 자를 발각시키지 말며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.3.KRV"
        },
        {
          "number": "16:4",
          "reference": "이사야 16:4",
          "text": "나의 쫓겨난 자들로 너와 함께 있게 하되 너 모압은 멸절하는 자 앞에서 그 피할 곳이 되라 대저 토색하는 자가 망하였고 멸절하는 자가 그쳤고 압제하는 자가 이 땅에서 멸절하였으며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.4.KRV"
        },
        {
          "number": "16:5",
          "reference": "이사야 16:5",
          "text": "다윗의 장막에 왕위는 인자함으로 굳게 설 것이요 그 위에 앉을 자는 충실함으로 판결하며 공평을 구하며 의를 신속히 행하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.5.KRV"
        },
        {
          "number": "16:6",
          "reference": "이사야 16:6",
          "text": "우리가 모압의 교만을 들었나니 심히 교만하도다 그의 거만하며 교만하며 분노함도 들었거니와 그 과장이 헛되도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.6.KRV"
        },
        {
          "number": "16:7",
          "reference": "이사야 16:7",
          "text": "그러므로 모압이 모압을 위하여 통곡하되 다 통곡하며 길하레셋 건포도 떡을 위하여 그들이 슬퍼하며 심히 근심하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.7.KRV"
        },
        {
          "number": "16:8",
          "reference": "이사야 16:8",
          "text": "이는 헤스본의 밭과 십마의 포도나무가 말랐음이라 전에는 그 가지가 야셀에 미쳐 광야에 이르고 그 싹이 자라서 바다를 건넜더니 이제 열국 주권자들이 그 좋은 가지를 꺾었도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.8.KRV"
        },
        {
          "number": "16:9",
          "reference": "이사야 16:9",
          "text": "그러므로 내가 야셀의 울음처럼 십마의 포도나무를 위하여 울리라 헤스본이여 엘르알레여 나의 눈물로 너를 적시리니 너의 여름 실과, 너의 농작물에 떠드는 소리가 일어남이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.9.KRV"
        },
        {
          "number": "16:10",
          "reference": "이사야 16:10",
          "text": "즐거움과 기쁨이 기름진 밭에서 떠났고 포도원에는 노래와 즐거운 소리가 없어지겠고 틀에는 포도를 밟을 사람이 없으리니 이는 내가 그 소리를 그치게 하였음이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.10.KRV"
        },
        {
          "number": "16:11",
          "reference": "이사야 16:11",
          "text": "이러므로 나의 마음이 모압을 위하여 수금 같이 소리를 발하며 나의 창자가 길하레셋을 위하여 그러하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.11.KRV"
        },
        {
          "number": "16:12",
          "reference": "이사야 16:12",
          "text": "모압 사람이 그 산당에서 피곤하도록 봉사하며 자기 성소에 나아가서 기도할지라도 무효하리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.12.KRV"
        },
        {
          "number": "16:13",
          "reference": "이사야 16:13",
          "text": "이는 여호와께서 전에 모압을 들어 하신 말씀이어니와",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.13.KRV"
        },
        {
          "number": "16:14",
          "reference": "이사야 16:14",
          "text": "이제 여호와께서 말씀하여 가라사대 품군의 정한 해와 같이 삼 년내에 모압의 영화와 그 큰 무리가 능욕을 당할지라 그 남은 수가 심히 적어 소용이 없이 되리라 하시도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.16.14.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d9",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-04",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "피난처를 세우는 정의",
      "paragraphs": [
        "맥락과 뜻 — 위기에 놓인 모압은 예루살렘에 예물을 보내고, 떠도는 피난민을 숨겨 달라고 요청합니다. 인애와 성실로 굳게 서서 정의를 행하는 다윗의 보좌가 소망으로 제시되지만, 모압의 큰 교만은 결국 꺾입니다. 예언자는 포도밭과 수확의 기쁨이 사라지는 모습을 보며 함께 눈물 흘리고, 정해진 때에 모압의 영화가 쇠할 것을 알립니다.",
        "마음에 비추기 — 정의로운 통치는 위험한 사람을 몰아내는 데서 끝나지 않고, 쫓겨난 이에게 숨을 곳을 마련합니다. 동시에 도움을 구하면서도 교만을 붙들면 진실한 회복에 이르기 어렵습니다. 성경은 잘못을 분명히 말하면서도 그 사람이 겪는 상실을 함께 슬퍼하는 마음을 보여 줍니다.",
        "오늘의 한 걸음 — 도움을 청하기 어려워하는 사람 한 명에게 먼저 구체적인 도움을 제안해 보세요. 나 역시 인정하기 싫었던 약함이나 교만 한 가지를 하나님 앞에 솔직히 내려놓읍시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d10",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "17:1",
          "reference": "이사야 17:1",
          "text": "다메섹에 관한 경고라 보라 다메섹이 장차 성읍 모양을 이루지 못하고 무너진 무더기가 될 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.1.KRV"
        },
        {
          "number": "17:2",
          "reference": "이사야 17:2",
          "text": "아로엘의 성읍들이 버림을 당하리니 양 무리를 치는 곳이 되어 양이 눕되 놀라게 할 자가 없을 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.2.KRV"
        },
        {
          "number": "17:3",
          "reference": "이사야 17:3",
          "text": "에브라임의 요새와 다메섹 나라와 아람의 남은 백성이 멸절하여 이스라엘 자손의 영광 같이 되리라 만군의 여호와의 말씀이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.3.KRV"
        },
        {
          "number": "17:4",
          "reference": "이사야 17:4",
          "text": "그 날에 야곱의 영광이 쇠하고 그 살찐 몸이 파리하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.4.KRV"
        },
        {
          "number": "17:5",
          "reference": "이사야 17:5",
          "text": "마치 추수하는 자가 곡식을 거두어 가지고 그 손으로 이삭을 벤 것 같고 르바임 골짜기에서 이삭을 주운 것 같으리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.5.KRV"
        },
        {
          "number": "17:6",
          "reference": "이사야 17:6",
          "text": "그러나 오히려 주울 것이 남으리니 감람나무를 흔들 때에 가장 높은 가지 꼭대기에 실과 이 삼 개가 남음 같겠고 무성한 나무의 가장 먼 가지에 사 오 개가 남음 같으리라 이스라엘의 하나님 여호와의 말씀이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.6.KRV"
        },
        {
          "number": "17:7",
          "reference": "이사야 17:7",
          "text": "그 날에 사람이 자기를 지으신 자를 쳐다보겠으며 그 눈이 이스라엘의 거룩하신 자를 바라보겠고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.7.KRV"
        },
        {
          "number": "17:8",
          "reference": "이사야 17:8",
          "text": "자기 손으로 만든 단을 쳐다보지 아니하며 자기 손가락으로 지은 아세라나 태양상을 바라보지 아니할 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.8.KRV"
        },
        {
          "number": "17:9",
          "reference": "이사야 17:9",
          "text": "그 날에 그 견고한 성읍들이 옛적에 이스라엘 자손 앞에서 버린바 된 수풀 속의 처소와 작은 산꼭대기의 처소 같아서 황폐하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.9.KRV"
        },
        {
          "number": "17:10",
          "reference": "이사야 17:10",
          "text": "이는 네가 자기의 구원의 하나님을 잊어버리며 자기의 능력의 반석을 마음에 두지 않은 까닭이라 그러므로 네가 기뻐하는 식물을 심으며 이방의 가지도 이종하고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.10.KRV"
        },
        {
          "number": "17:11",
          "reference": "이사야 17:11",
          "text": "네가 심는 날에 울타리로 두르고 아침에 너의 씨로 잘 발육하도록 하였으나 근심과 심한 슬픔의 날에 농작물이 없어지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.11.KRV"
        },
        {
          "number": "17:12",
          "reference": "이사야 17:12",
          "text": "슬프다 많은 민족이 소동하였으되 바다 파도의 뛰노는 소리 같이 그들이 소동하였고 열방이 충돌하였으되 큰 물의 몰려옴 같이 그들도 충돌하였도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.12.KRV"
        },
        {
          "number": "17:13",
          "reference": "이사야 17:13",
          "text": "열방이 충돌하기를 많은 물의 몰려옴과 같이 하나 주께서 그들을 꾸짖으시리니 그들이 멀리 도망함이 산에 겨가 바람 앞에 흩어짐 같겠고 폭풍 앞에 떠도는 티끌 같을 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.13.KRV"
        },
        {
          "number": "17:14",
          "reference": "이사야 17:14",
          "text": "보라 저녁에 두려움을 당하고 아침 전에 그들이 없어졌나니 이는 우리를 노략한 자의 분깃이요 우리를 강탈한 자의 보응이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.17.14.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d10",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-05",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "만드신 이를 다시 바라보다",
      "paragraphs": [
        "맥락과 뜻 — 다메섹과 북이스라엘의 영광은 수확 뒤 남은 이삭처럼 줄어들지만, 완전히 사라지지 않은 남은 자가 있습니다. 그날 사람들은 손으로 만든 제단과 우상을 바라보지 않고 자신을 지으신 하나님을 다시 바라봅니다. 바다처럼 요란한 민족들의 위협도 하나님의 꾸짖음 앞에서는 바람에 날리는 겨처럼 사라집니다.",
        "마음에 비추기 — 익숙한 의지처가 흔들릴 때, 우리는 무엇을 하나님보다 크게 여기고 있었는지 발견합니다. 내가 만든 성과와 관계, 계획은 소중하지만 나를 만든 분을 대신할 수 없습니다. 소음이 크다고 최종 권한까지 가진 것은 아니기에, 믿음은 가장 시끄러운 목소리보다 하나님을 바라봅니다.",
        "오늘의 한 걸음 — 불안할 때 가장 먼저 찾는 대상이나 습관을 하나 적어 보세요. 오늘 10분만 그 의존을 멈추고 말씀과 기도로 시선을 하나님께 돌린 뒤, 꼭 필요한 행동을 차분히 시작합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d11",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "18:1",
          "reference": "이사야 18:1",
          "text": "슬프다 구스의 강 건너편 날개치는 소리 나는 땅이여",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.1.KRV"
        },
        {
          "number": "18:2",
          "reference": "이사야 18:2",
          "text": "갈대 배를 물에 띄우고 그 사자를 수로로 보내며 이르기를 너희 경첩한 사자들아 너희는 강들이 흘러 나누인 나라로 가되 장대하고 준수한 백성 곧 시초부터 두려움이 되며 강성하여 대적을 밟는 백성에게로 가라 하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.2.KRV"
        },
        {
          "number": "18:3",
          "reference": "이사야 18:3",
          "text": "세상의 모든 거민, 지상에 거하는 너희여 산들 위에 기호를 세우거든 너희는 보고 나팔을 불거든 너희는 들을지니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.3.KRV"
        },
        {
          "number": "18:4",
          "reference": "이사야 18:4",
          "text": "여호와께서 내게 이르시되 내가 나의 처소에서 종용히 감찰함이 쬐이는 일광 같고 가을 더위에 운무 같도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.4.KRV"
        },
        {
          "number": "18:5",
          "reference": "이사야 18:5",
          "text": "추수하기 전에 꽃이 떨어지고 포도가 맺혀 익어 갈 때에 내가 낫으로 그 연한 가지를 베며 퍼진 가지를 찍어버려서",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.5.KRV"
        },
        {
          "number": "18:6",
          "reference": "이사야 18:6",
          "text": "산의 독수리들에게와 땅의 들짐승들에게 끼쳐주리니 산의 독수리들이 그것으로 과하하며 땅의 들짐승들이 다 그것으로 과동하리라 하셨음이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.6.KRV"
        },
        {
          "number": "18:7",
          "reference": "이사야 18:7",
          "text": "그 때에 강들이 흘러 나누인 나라의 장대하고 준수하며 시초부터 두려움이 되며 강성하여 대적을 밟는 백성에게서 만군의 여호와께 드릴 예물을 가지고 만군의 여호와의 이름을 두신 곳 시온 산에 이르리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.18.7.KRV"
        },
        {
          "number": "19:1",
          "reference": "이사야 19:1",
          "text": "애굽에 관한 경고라 보라 여호와께서 빠른 구름을 타고 애굽에 임하시리니 애굽의 우상들이 그 앞에서 떨겠고 애굽인의 마음이 그 속에서 녹으리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.1.KRV"
        },
        {
          "number": "19:2",
          "reference": "이사야 19:2",
          "text": "그가 애굽인을 격동하사 애굽인을 치게 하시리니 그들이 각기 형제를 치며 각기 이웃을 칠 것이요 성읍이 성읍을 치며 나라가 나라를 칠 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.2.KRV"
        },
        {
          "number": "19:3",
          "reference": "이사야 19:3",
          "text": "애굽인의 정신이 그 속에서 쇠약할 것이요 그 도모는 그의 파하신 바가 되리니 그들이 우상과 마술사와 신접한 자와 요술객에게 물으리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.3.KRV"
        },
        {
          "number": "19:4",
          "reference": "이사야 19:4",
          "text": "그가 애굽인을 잔인한 군주의 손에 붙이시리니 포학한 왕이 그들을 치리하리라 주 만군의 여호와의 말씀이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.4.KRV"
        },
        {
          "number": "19:5",
          "reference": "이사야 19:5",
          "text": "바닷물이 없어지겠고 강이 잦아서 마르겠고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.5.KRV"
        },
        {
          "number": "19:6",
          "reference": "이사야 19:6",
          "text": "강들에서는 악취가 나겠고 애굽 시냇물은 줄어들고 마르므로 달과 같이 시들겠으며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.6.KRV"
        },
        {
          "number": "19:7",
          "reference": "이사야 19:7",
          "text": "나일 가까운 곳 나일 언덕의 초장과 나일강 가까운 곡식 밭이 다 말라서 날아 없어질 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.7.KRV"
        },
        {
          "number": "19:8",
          "reference": "이사야 19:8",
          "text": "어부들은 탄식하며 무릇 나일강에 낚시를 던지는 자는 슬퍼하며 물에 그물을 치는 자는 피곤할 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.8.KRV"
        },
        {
          "number": "19:9",
          "reference": "이사야 19:9",
          "text": "세마포를 만드는 자와 백목을 짜는 자들이 수치를 당할 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.9.KRV"
        },
        {
          "number": "19:10",
          "reference": "이사야 19:10",
          "text": "애굽의 기둥이 부숴지고 품꾼들이 다 마음에 근심하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.10.KRV"
        },
        {
          "number": "19:11",
          "reference": "이사야 19:11",
          "text": "소안의 방백은 지극히 어리석었고 바로의 가장 지혜로운 모사의 모략은 우준하여졌으니 너희가 어떻게 바로에게 이르기를 나는 지혜로운 자들의 자손이라는 옛 왕들의 후예라 할 수 있으랴",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.11.KRV"
        },
        {
          "number": "19:12",
          "reference": "이사야 19:12",
          "text": "너의 지혜로운 자가 어디 있느냐 그들이 만군의 여호와께서 애굽에 대하여 정하신 뜻을 알 것이요 곧 네게 고할 것이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.12.KRV"
        },
        {
          "number": "19:13",
          "reference": "이사야 19:13",
          "text": "소안의 방백들은 어리석었고 놉의 방백들은 미혹되었도다 그들은 애굽 지파들의 모퉁이 돌이어늘 애굽으로 그릇가게 하였도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.13.KRV"
        },
        {
          "number": "19:14",
          "reference": "이사야 19:14",
          "text": "여호와께서 그 가운데 사특한 마음을 섞으셨으므로 그들이 애굽으로 매사에 잘못 가게 함이 취한 자가 토하면서 비틀거림 같게 하였으니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.14.KRV"
        },
        {
          "number": "19:15",
          "reference": "이사야 19:15",
          "text": "애굽에서 머리나 꼬리나 종려나무 가지나 갈대나 아무 할 일이 없으리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.15.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d11",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-06",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "멀리 있는 나라들도 주 앞에",
      "paragraphs": [
        "맥락과 뜻 — 구스의 사절들이 분주히 오갈 때 하나님은 조용히 지켜보다가 추수 전에 가지를 베시고, 마침내 그 땅의 예물을 시온에서 받으십니다. 이집트에서는 우상이 떨고 내분과 압제가 일어나며, 나일강이 마르자 경제와 일터도 함께 무너집니다. 지혜롭다고 자랑하던 조언자들은 하나님의 뜻을 알지 못해 나라를 비틀거리게 합니다.",
        "마음에 비추기 — 하나님이 조용하셔 보여도 세상을 놓치거나 떠나신 것이 아닙니다. 빠른 외교와 뛰어난 지식, 안정된 경제도 하나님을 대신하는 절대 안전망이 될 수 없습니다. 위기일수록 더 분주해지기 전에 무엇이 거짓된 확신이었는지 살펴야 합니다.",
        "오늘의 한 걸음 — 급하게 결정하려던 일 하나를 잠시 멈추고 하나님께 지혜를 구하세요. 믿을 만한 사람의 조언을 듣되, 과장과 두려움 대신 확인된 사실에 따라 정직한 다음 행동을 선택합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d12",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.16.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "19:16",
          "reference": "이사야 19:16",
          "text": "그 날에 애굽인이 부녀와 같을 것이라 그들이 만군의 여호와의 흔드시는 손이 그 위에 흔들림을 인하여 떨며 두려워할 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.16.KRV"
        },
        {
          "number": "19:17",
          "reference": "이사야 19:17",
          "text": "유다의 땅은 애굽의 두려움이 되리니 이는 만군의 여호와께서 애굽에 대하여 정하신 모략을 인함이라 그 소문을 듣는 자마다 떨리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.17.KRV"
        },
        {
          "number": "19:18",
          "reference": "이사야 19:18",
          "text": "그 날에 애굽 땅에 가나안 방언을 말하며 만군의 여호와를 가리켜 맹세하는 다섯 성읍이 있을 것이며 그 중 하나를 장망성이라 칭하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.18.KRV"
        },
        {
          "number": "19:19",
          "reference": "이사야 19:19",
          "text": "그 날에 애굽 땅 중앙에는 여호와를 위하여 제단이 있겠고 그 변경에는 여호와를 위하여 기둥이 있을 것이요",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.19.KRV"
        },
        {
          "number": "19:20",
          "reference": "이사야 19:20",
          "text": "이것이 애굽 땅에서 만군의 여호와를 위하여 표적과 증거가 되리니 이는 그들이 그 압박하는 자의 연고로 여호와께 부르짖겠고 여호와께서는 한 구원자, 보호자를 보내사 그들을 건지실 것임이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.20.KRV"
        },
        {
          "number": "19:21",
          "reference": "이사야 19:21",
          "text": "여호와께서 자기를 애굽에 알게 하시리니 그 날에 애굽인이 여호와를 알고 제물과 예물을 그에게 드리고 경배할 것이요 여호와께 서원하고 그대로 행하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.21.KRV"
        },
        {
          "number": "19:22",
          "reference": "이사야 19:22",
          "text": "여호와께서 애굽을 치실 것이라도 치시고는 고치실 것인고로 그들이 여호와께로 돌아올 것이라 여호와께서 그 간구함을 들으시고 그를 고쳐주시리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.22.KRV"
        },
        {
          "number": "19:23",
          "reference": "이사야 19:23",
          "text": "그 날에 애굽에서 앗수르로 통하는 대로가 있어 앗수르 사람은 애굽으로 가겠고 애굽 사람은 앗수르로 갈 것이며 애굽 사람이 앗수르 사람과 함께 경배하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.23.KRV"
        },
        {
          "number": "19:24",
          "reference": "이사야 19:24",
          "text": "그 날에 이스라엘이 애굽과 앗수르로 더불어 셋이 세계 중에 복이 되리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.24.KRV"
        },
        {
          "number": "19:25",
          "reference": "이사야 19:25",
          "text": "이는 만군의 여호와께서 복을 주어 가라사대 나의 백성 애굽이여, 나의 손으로 지은 앗수르여, 나의 산업 이스라엘이여, 복이 있을 지어다 하실 것임이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.19.25.KRV"
        },
        {
          "number": "20:1",
          "reference": "이사야 20:1",
          "text": "앗수르 왕 사르곤이 군대장관을 아스돗으로 보내매 그가 와서 아스돗을 쳐서 취하던 해",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.20.1.KRV"
        },
        {
          "number": "20:2",
          "reference": "이사야 20:2",
          "text": "곧 그 때에 여호와께서 아모스의 아들 이사야에게 일러 가라사대 갈지어다 네 허리에서 베를 끄르고 네 발에서 신을 벗을지니라 하시매 그가 그대로 하여 벗은 몸과 벗은 발로 행하니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.20.2.KRV"
        },
        {
          "number": "20:3",
          "reference": "이사야 20:3",
          "text": "여호와께서 가라사대 나의 종 이사야가 삼 년동안 벗은 몸과 벗은 발로 행하여 애굽과 구스에 대하여 예표와 기적이 되게 되었느니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.20.3.KRV"
        },
        {
          "number": "20:4",
          "reference": "이사야 20:4",
          "text": "이와 같이 애굽의 포로와 구스의 사로잡힌 자가 앗수르 왕에게 끌려 갈 때에 젊은 자나 늙은 자가 다 벗은 몸, 벗은 발로 볼기까지 드러내어 애굽의 수치를 뵈이리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.20.4.KRV"
        },
        {
          "number": "20:5",
          "reference": "이사야 20:5",
          "text": "그들이 그 바라던 구스와 자랑하던 애굽을 인하여 놀라고 부끄러워할 것이라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.20.5.KRV"
        },
        {
          "number": "20:6",
          "reference": "이사야 20:6",
          "text": "그 날에 이 해변 거민이 말하기를 우리가 믿던 나라 곧 우리가 앗수르 왕에게서 벗어나기를 바라고 달려가서 도움을 구하던 나라가 이같이 되었은즉 우리가 어찌 능히 피하리요 하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.20.6.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d12",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-07",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "원수까지 복이 되는 길",
      "paragraphs": [
        "맥락과 뜻 — 두려움에 빠진 이집트가 하나님께 부르짖고, 하나님을 알고 예배하며 고침받는 놀라운 미래가 펼쳐집니다. 이집트와 앗수르 사이에 큰길이 열리고, 이스라엘과 함께 세 나라가 세상에 복이 됩니다. 그러나 이사야가 삼 년 동안 벗은 몸과 맨발로 보인 표징은 당장의 이집트와 구스가 앗수르에게 끌려가므로 그들을 구원의 보증처럼 의지하지 말라고 경고합니다.",
        "마음에 비추기 — 하나님은 어제의 원수도 예배하는 이웃과 복의 통로로 바꾸실 수 있습니다. 그렇다고 어떤 나라나 사람을 하나님 대신 안전의 근거로 삼을 수는 없습니다. 우리는 타인을 배척하거나 숭배하지 않고, 하나님 안에서 함께 치유될 존재로 바라보아야 합니다.",
        "오늘의 한 걸음 — 내 편이 아니라고 선을 그었던 사람 한 명을 위해 복을 빌어 보세요. 동시에 안정감을 얻기 위해 지나치게 기대는 사람이나 조건이 있다면, 그 기대를 하나님께 맡기고 건강한 거리를 세웁시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d13",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "21:1",
          "reference": "이사야 21:1",
          "text": "해변 광야에 관한 경고라 적병이 광야에서 두려운 땅에서 남방 회리바람 같이 몰려왔도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.1.KRV"
        },
        {
          "number": "21:2",
          "reference": "이사야 21:2",
          "text": "혹독한 묵시가 내게 보였도다 주께서 가라사대 속이는 자는 속이고 약탈하는 자는 약탈하도다 엘람이여 올라가고 매대여 에워싸라 그의 모든 탄식을 내가 그치게 하였노라 하시도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.2.KRV"
        },
        {
          "number": "21:3",
          "reference": "이사야 21:3",
          "text": "이러므로 나의 요통이 심하여 임산한 여인의 고통 같은 고통이 내게 임하였으므로 고통으로 인하여 듣지 못하며 놀라서 보지 못하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.3.KRV"
        },
        {
          "number": "21:4",
          "reference": "이사야 21:4",
          "text": "내 마음이 진동하며 두려움이 나를 놀래며 희망의 서광이 변하여 내게 떨림이 되도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.4.KRV"
        },
        {
          "number": "21:5",
          "reference": "이사야 21:5",
          "text": "그들이 식탁을 베풀고 파수꾼을 세우고 먹고 마시도다 너희 방백들아 일어나 방패에 기름을 바를지어다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.5.KRV"
        },
        {
          "number": "21:6",
          "reference": "이사야 21:6",
          "text": "주께서 내게 이르시되 가서 파수꾼을 세우고 그 보는 것을 고하게 하되",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.6.KRV"
        },
        {
          "number": "21:7",
          "reference": "이사야 21:7",
          "text": "마병대가 쌍쌍이 오는 것과 나귀떼와 약대떼를 보거든 자세히 유심히 들으라 하셨더니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.7.KRV"
        },
        {
          "number": "21:8",
          "reference": "이사야 21:8",
          "text": "파수꾼이 사자 같이 부르짖기를 주여 내가 낮에 늘 망대에 섰었고 밤이 맞도록 파수하는 곳에 있었더니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.8.KRV"
        },
        {
          "number": "21:9",
          "reference": "이사야 21:9",
          "text": "마병대가 쌍쌍이 오나이다 그가 대답하여 가라사대 함락되었도다 함락되었도다 바벨론이여 그 신들의 조각한 형상이 다 부숴져 땅에 떨어졌도다 하시도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.9.KRV"
        },
        {
          "number": "21:10",
          "reference": "이사야 21:10",
          "text": "너 나의 타작한 것이여 나의 마당의 곡식이여 내가 이스라엘의 하나님 만군의 여호와께 들은 대로 너희에게 고하였노라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.10.KRV"
        },
        {
          "number": "21:11",
          "reference": "이사야 21:11",
          "text": "두마에 관한 경고라 사람이 세일에서 나를 부르되 파수꾼이여 밤이 어떻게 되었느뇨 파수꾼이여 밤이 어떻게 되었느뇨",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.11.KRV"
        },
        {
          "number": "21:12",
          "reference": "이사야 21:12",
          "text": "파수꾼이 가로되 아침이 오나니 밤도 오리라 네가 물으려거든 물으라 너희는 돌아올지니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.12.KRV"
        },
        {
          "number": "21:13",
          "reference": "이사야 21:13",
          "text": "아라비아에 관한 경고라 드단 대상이여 너희가 아라비아 수풀에서 유숙하리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.13.KRV"
        },
        {
          "number": "21:14",
          "reference": "이사야 21:14",
          "text": "데마 땅의 거민들아 물을 가져다가 목마른 자에게 주고 떡을 가지고 도피하는 자를 영접하라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.14.KRV"
        },
        {
          "number": "21:15",
          "reference": "이사야 21:15",
          "text": "그들이 칼날을 피하며 뺀 칼과 당긴 활과 전쟁의 어려움에서 도망하였음이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.15.KRV"
        },
        {
          "number": "21:16",
          "reference": "이사야 21:16",
          "text": "주께서 이같이 내게 이르시되 품군의 정한 기한 같이 일 년내에 게달의 영광이 다 쇠멸하리니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.16.KRV"
        },
        {
          "number": "21:17",
          "reference": "이사야 21:17",
          "text": "게달 자손 중 활 가진 용사의 남은 수가 적으리라 하시니라 이스라엘의 하나님 여호와의 말씀이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.21.17.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d13",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-08",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "파수꾼처럼 깨어 있기",
      "paragraphs": [
        "맥락과 뜻 — 광야에서 불어오는 폭풍처럼 바벨론의 멸망이 다가오고, 파수꾼은 마침내 그 성과 우상들이 무너졌다고 보고합니다. 두마를 향한 대답은 아침이 오지만 다시 밤도 온다고 말하며 계속 묻고 돌아오라고 초대합니다. 아라비아에서는 전쟁을 피해 도망한 이들에게 물과 빵을 주라는 요청과 함께 게달의 영화가 곧 끝날 것이 선포됩니다.",
        "마음에 비추기 — 믿음은 좋은 소식만 기다리는 낙관이 아니라 밤의 현실을 정직하게 보고도 자리를 지키는 파수입니다. 강한 제국도 끝나고 새로운 어려움도 오지만, 하나님의 말씀은 상황보다 오래갑니다. 깨어 있는 사람은 소식을 아는 데 그치지 않고 도망하는 이에게 물과 빵을 건넵니다.",
        "오늘의 한 걸음 — 힘든 시간을 지나는 사람에게 안부만 묻지 말고 지금 필요한 도움 한 가지를 물어보세요. 하루 중 한 시각을 정해 세상의 아픔을 위해 기도하고, 가능한 작은 도움을 바로 실행합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  },
  {
    "dayId": "d14",
    "kind": "bible",
    "key": "krv",
    "label": "개역한글",
    "sourceName": "성경전서 개역한글판 © 대한성서공회 1961",
    "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.1.KRV",
    "translationKey": "개역한글",
    "commentaryKey": null,
    "rightsBasis": "public_domain",
    "rightsNotice": "대한성서공회 안내에 따라 저작권료 없이 사용하며 성명표시권과 동일성유지권을 준수합니다.",
    "rightsUrl": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5",
    "body": {
      "rights": {
        "basis": "public_domain",
        "notice": "성경전서 개역한글판 © 대한성서공회 1961",
        "url": "https://www.bskorea.or.kr/bbs/board.php?bo_table=copyright_faq&wr_id=5"
      },
      "verses": [
        {
          "number": "22:1",
          "reference": "이사야 22:1",
          "text": "이상 골짜기에 관한 경고라 네가 지붕에 올라감은 어찜인고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.1.KRV"
        },
        {
          "number": "22:2",
          "reference": "이사야 22:2",
          "text": "훤화하며 떠들던 성, 즐거워하던 고을이여 너의 죽임을 당한 자가 칼에 죽은 것도 아니요 전쟁에 사망한 것도 아니며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.2.KRV"
        },
        {
          "number": "22:3",
          "reference": "이사야 22:3",
          "text": "너의 관원들은 다 함께 도망하였다가 활을 버리고 결박을 당하였고 너의 멀리 도망한 자도 발견되어 다 함께 결박을 당하였도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.3.KRV"
        },
        {
          "number": "22:4",
          "reference": "이사야 22:4",
          "text": "이러므로 내가 말하노니 돌이켜 나를 보지 말지어다 나는 슬피 통곡하겠노라 내 딸 백성이 패멸하였음을 인하여 나를 위로하려고 힘쓰지 말지니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.4.KRV"
        },
        {
          "number": "22:5",
          "reference": "이사야 22:5",
          "text": "이상의 골짜기에 주 만군의 여호와께로서 이르는 분요와 밟힘과 혼란의 날이여 성벽의 무너뜨림과 산악에 사무치는 부르짖는 소리로다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.5.KRV"
        },
        {
          "number": "22:6",
          "reference": "이사야 22:6",
          "text": "엘람 사람은 전통을 졌고 병거탄 자와 마병이 함께 하였고 기르 사람은 방패를 들어 내었으니",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.6.KRV"
        },
        {
          "number": "22:7",
          "reference": "이사야 22:7",
          "text": "병거는 너의 아름다운 골짜기에 가득하였고 마병은 성문에 정렬되었도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.7.KRV"
        },
        {
          "number": "22:8",
          "reference": "이사야 22:8",
          "text": "그가 유다에게 덮였던 것을 벗기매 이 날에야 네가 수풀 곳간의 병기를 바라보았고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.8.KRV"
        },
        {
          "number": "22:9",
          "reference": "이사야 22:9",
          "text": "너희가 다윗성의 무너진 곳이 많은 것도 보며 너희가 아래 못의 물도 모으며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.9.KRV"
        },
        {
          "number": "22:10",
          "reference": "이사야 22:10",
          "text": "또 예루살렘의 가옥을 계수하며 그 가옥을 헐어 성벽을 견고케도 하며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.10.KRV"
        },
        {
          "number": "22:11",
          "reference": "이사야 22:11",
          "text": "너희가 또 옛못의 물을 위하여 두 성벽 사이에 저수지를 만들었느니라 그러나 너희가 이 일을 하신 자를 앙망하지 아니하였고 이 일을 옛적부터 경영하신 자를 존경하지 아니하였느니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.11.KRV"
        },
        {
          "number": "22:12",
          "reference": "이사야 22:12",
          "text": "그 날에 주 만군의 여호와께서 명하사 통곡하며 애호하며 머리털을 뜯으며 굵은 베를 띠라 하셨거늘",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.12.KRV"
        },
        {
          "number": "22:13",
          "reference": "이사야 22:13",
          "text": "너희가 기뻐하며 즐거워하여 소를 잡고 양을 죽여 고기를 먹고 포도주를 마시면서 내일 죽으리니 먹고 마시자 하도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.13.KRV"
        },
        {
          "number": "22:14",
          "reference": "이사야 22:14",
          "text": "만군의 여호와께서 친히 내 귀에 들려 가라사대 진실로 이 죄악은 너희 죽기까지 속하지 못하리라 하셨느니라 주 만군의 여호와의 말씀이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.14.KRV"
        },
        {
          "number": "22:15",
          "reference": "이사야 22:15",
          "text": "주 만군의 여호와께서 가라사대 너는 가서 그 국고를 맡고 궁을 차지한 셉나를 보고 이르기를",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.15.KRV"
        },
        {
          "number": "22:16",
          "reference": "이사야 22:16",
          "text": "네가 여기 무슨 관계가 있느냐 여기 누가 있기에 여기서 너를 위하여 묘실을 팠느냐 높은 곳에 자기를 위하여 묘실을 팠고 반석에 자기를 위하여 처소를 쪼아 내었도다",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.16.KRV"
        },
        {
          "number": "22:17",
          "reference": "이사야 22:17",
          "text": "나 여호와가 너를 단단히 속박하고 장사 같이 맹렬히 던지되",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.17.KRV"
        },
        {
          "number": "22:18",
          "reference": "이사야 22:18",
          "text": "정녕히 너를 말아 싸서 공 같이 광막한 지경에 던질 것이라 주인의 집에 수치를 끼치는 너여 네가 그곳에서 죽겠고 네 영광의 수레도 거기 있으리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.18.KRV"
        },
        {
          "number": "22:19",
          "reference": "이사야 22:19",
          "text": "내가 너를 네 관직에서 쫓아내며 네 지위에서 낮추고",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.19.KRV"
        },
        {
          "number": "22:20",
          "reference": "이사야 22:20",
          "text": "그 날에 내가 힐기야의 아들 내 종 엘리아김을 불러",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.20.KRV"
        },
        {
          "number": "22:21",
          "reference": "이사야 22:21",
          "text": "네 옷을 그에게 입히며 네 띠를 그에게 띠워 힘 있게 하고 네 정권을 그의 손에 맡기리니 그가 예루살렘 거민과 유다 집의 아비가 될 것이며",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.21.KRV"
        },
        {
          "number": "22:22",
          "reference": "이사야 22:22",
          "text": "내가 또 다윗집의 열쇠를 그의 어깨에 두리니 그가 열면 닫을 자가 없겠고 닫으면 열 자가 없으리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.22.KRV"
        },
        {
          "number": "22:23",
          "reference": "이사야 22:23",
          "text": "못이 단단한 곳에 박힘 같이 그를 견고케 하리니 그가 그 아비 집에 영광의 보좌가 될 것이요",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.23.KRV"
        },
        {
          "number": "22:24",
          "reference": "이사야 22:24",
          "text": "그 아비 집의 모든 영광이 그 위에 걸리리니 그 후손과 족속 되는 각 작은 그릇 곧 종지로부터 항아리까지리라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.24.KRV"
        },
        {
          "number": "22:25",
          "reference": "이사야 22:25",
          "text": "만군의 여호와께서 가라사대 그 날에는 단단한 곳에 박혔던 못이 삭으리니 그 못이 부러져 떨어지므로 그 위에 걸린 물건이 파쇄되리라 하셨다 하라 나 여호와의 말이니라",
          "sourceUrl": "https://www.bible.com/ko/bible/88/ISA.22.25.KRV"
        }
      ]
    },
    "copyAllowed": true,
    "maxCopyVerses": 1
  },
  {
    "dayId": "d14",
    "kind": "commentary",
    "key": "wordgarden",
    "label": "말씀정원 해설",
    "sourceName": "말씀정원 자체 해설",
    "sourceUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site/day/2026-08-09",
    "translationKey": null,
    "commentaryKey": "말씀정원",
    "rightsBasis": "owned",
    "rightsNotice": "성서유니온 해설을 옮기지 않고 성경 본문을 바탕으로 새로 쓴 묵상 도움말입니다.",
    "rightsUrl": "https://malsseum-garden-202607.hwmich030520.chatgpt.site",
    "body": {
      "rights": {
        "basis": "owned",
        "notice": "말씀정원 자체 해설",
        "url": "https://malsseum-garden-202607.hwmich030520.chatgpt.site"
      },
      "heading": "준비했지만 바라보지 않았다",
      "paragraphs": [
        "맥락과 뜻 — 예루살렘은 다가오는 위기 속에서도 지붕에 올라 잔치를 벌이고, 성벽을 보수하며 물을 모으지만 오래전부터 이 일을 주관하신 하나님은 바라보지 않습니다. 하나님이 회개를 부르실 때 백성은 ‘먹고 마시자’며 현실을 외면합니다. 자신을 위한 화려한 무덤을 준비한 관리 셉나는 자리에서 내려오고 엘리아김이 책임을 맡지만, 마지막에는 단단해 보인 못도 빠진다는 경고가 이어집니다.",
        "마음에 비추기 — 준비와 계획은 필요하지만 하나님을 바라보지 않는 대비는 두려움을 감추는 또 다른 방법이 될 수 있습니다. 즐거움으로 잘못을 마비시키거나 지위로 영원한 흔적을 남기려 해도 인간의 자리는 끝이 있습니다. 책임 있는 지도력도 하나님을 대신하는 마지막 못이 될 수 없습니다.",
        "오늘의 한 걸음 — 계획을 시작하기 전에 잠시 멈춰 하나님께 동기와 방향을 물어보세요. 내가 웃음이나 바쁨으로 피하던 문제 하나를 정직하게 인정하고, 오늘 가능한 수리·사과·책임의 행동을 하나 시작합시다."
      ]
    },
    "copyAllowed": false,
    "maxCopyVerses": 0
  }
];
