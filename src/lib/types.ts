export type MediaType = 'Anime' | 'Drama' | 'Game' | 'Novel' | 'Idol' | 'Webtoon' | 'Other';

export interface Character {
  id: string;
  name: string;
  isCanon: boolean;             // 원작 캐릭터 여부
  personality: string[];        // 성격 키워드
  appearance: string[];         // 외모 묘사
  abilities: string[];          // 능력/특기
  speechPatterns: string[];     // 말투 예시
  relationships: Relationship[];
  description?: string;
}

export interface Relationship {
  targetCharacterId: string;
  description: string;
}

export interface WorldRule {
  id: string;
  title: string;
  description: string;
}

export interface OriginalWork {
  id: string;
  title: string;
  mediaType: MediaType;
  canonCharacters: Character[]; // 원작 캐릭터
  worldRules: WorldRule[];         // 세계관 규칙
  source: 'Preset' | 'Custom';
}

export interface Foreshadow {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Pending' | 'InProgress' | 'Resolved' | 'Dropped';
  plantedAt?: string; // 화수 또는 챕터
  expectedPayoff?: string;
}

export interface ToneProfile {
  writingStyle: string; // 문체
  atmosphere: string;   // 분위기
  pacing: string;       // 템포
  dialogueRatio: number; // 대사 비중 (0-100)
  rating: 'All' | '15+' | '19+';
}

export interface FanficProject {
  id: string;
  title: string;
  originalWorkId: string;       // 선택한 원작
  timelineSetting: string;      // 시점 (예: 엔딩 이후)
  auSettings: string[];         // AU 설정
  activeCharacterIds: string[]; // 이 프로젝트에 등장하는 캐릭터 ID 목록
  customCharacters: Character[]; // 오리지널 캐릭터
  foreshadows: Foreshadow[];    // 복선 목록
  tone: ToneProfile;            // 톤 설정
  originalWork?: OriginalWork;  // API response includes this
  createdAt: string;
  updatedAt: string;
}

export interface EpisodeNote {
  id: string;
  content: string;
  type: string; // 'General', 'Dialogue', 'Plot', 'Draft'
  order: number;
  episodeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  title: string;
  content: string;       // 타래 전체 본문 (트윗들을 합친 연속된 텍스트)
  order: number;
  projectId: string;
  notes: EpisodeNote[];
  createdAt: string;
  updatedAt: string;
}
