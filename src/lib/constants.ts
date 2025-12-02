import { OriginalWork } from './types';

export const PRESET_ORIGINAL_WORKS: OriginalWork[] = [
    {
        id: 'demon-slayer',
        title: '귀멸의 칼날',
        mediaType: 'Anime',
        source: 'Preset',
        worldRules: [
            { id: 'rule-1', title: '오니의 약점', description: '오니는 햇빛에 타 죽는다' },
            { id: 'rule-2', title: '오니 사살법', description: '일륜도로 목을 베어야 죽는다' },
            { id: 'rule-3', title: '전투 기술', description: '호흡을 사용한다' }
        ],
        canonCharacters: [
            {
                id: 'tanjiro',
                name: '카마도 탄지로',
                isCanon: true,
                personality: ['다정함', '정의로움', '포기하지 않음', '가족애'],
                appearance: ['붉은 머리', '화투패 귀걸이', '이마의 흉터'],
                abilities: ['물의 호흡', '해의 호흡', '후각'],
                speechPatterns: ['~라고 생각해요', '힘내자!', '냄새가 나'],
                relationships: []
            },
            {
                id: 'nezuko',
                name: '카마도 네즈코',
                isCanon: true,
                personality: ['오빠를 지킴', '인간을 지킴', '순수함'],
                appearance: ['긴 머리', '대나무 재갈', '분홍색 눈'],
                abilities: ['혈귀술 폭혈', '신체 크기 조절'],
                speechPatterns: ['음음!'],
                relationships: []
            },
            {
                id: 'zenitsu',
                name: '아가츠마 젠이츠',
                isCanon: true,
                personality: ['겁쟁이', '여자를 밝힘', '잠들면 강해짐'],
                appearance: ['노란 머리', '하오리'],
                abilities: ['번개의 호흡', '청각'],
                speechPatterns: ['죽을 거야!', '네즈코 짱~'],
                relationships: []
            }
        ]
    },
    {
        id: 'harry-potter',
        title: '해리 포터',
        mediaType: 'Novel',
        source: 'Preset',
        worldRules: [
            { id: 'hp-rule-1', title: '마법 도구', description: '마법사는 지팡이를 사용한다' },
            { id: 'hp-rule-2', title: '비밀 유지', description: '머글에게 마법을 들키면 안 된다' },
            { id: 'hp-rule-3', title: '학교 시스템', description: '호그와트 기숙사 시스템' }
        ],
        canonCharacters: [
            {
                id: 'harry',
                name: '해리 포터',
                isCanon: true,
                personality: ['용기', '정의로움', '다혈질', '희생정신'],
                appearance: ['검은 머리', '녹색 눈', '번개 흉터', '안경'],
                abilities: ['비행', '어둠의 마법 방어술', '뱀의 말'],
                speechPatterns: [],
                relationships: []
            },
            {
                id: 'hermione',
                name: '헤르미온느 그레인저',
                isCanon: true,
                personality: ['똑똑함', '논리적', '규칙 준수', '의리'],
                appearance: ['부스스한 머리', '앞니'],
                abilities: ['마법 지식', '응용력'],
                speechPatterns: [],
                relationships: []
            },
            {
                id: 'ron',
                name: '론 위즐리',
                isCanon: true,
                personality: ['유머러스', '충성심', '열등감', '용기'],
                appearance: ['빨간 머리', '주근깨', '큰 키'],
                abilities: ['체스', '퀴디치'],
                speechPatterns: [],
                relationships: []
            }
        ]
    },
    {
        id: 'debut-or-die',
        title: '데뷔 못 하면 죽는 병 걸림',
        mediaType: 'Idol',
        source: 'Preset',
        worldRules: [
            { id: 'dd-rule-1', title: '상태창', description: '상태창이 보인다' },
            { id: 'dd-rule-2', title: '시스템 페널티', description: '미션을 실패하면 죽는다' },
            { id: 'dd-rule-3', title: '배경', description: '아이돌 서바이벌' }
        ],
        canonCharacters: [
            {
                id: 'park-moondae',
                name: '박문대',
                isCanon: true,
                personality: ['냉철함', '계산적', '츤데레', '능력자'],
                appearance: ['강아지상', '백금발'],
                abilities: ['노래', '상태창 확인', '심리전'],
                speechPatterns: [],
                relationships: []
            }
        ]
    }
];

export const GENRES = [
    '로맨스', 'BL', 'GL', '판타지', '현대물', '학원물', 'SF', '무협', '미스터리', '공포'
];

export const RATINGS = ['All', '15+', '19+'];
