 “다른 작가들 신경 X, 나 혼자 쓸 프롬프트 공장 만들기” 모드네 😆
이건 완전 만들기 좋다. 구조만 잘 잡아두면 API 비용도 확 줄일 수 있어.

⸻

1. 네가 만들려는 구조, 한 줄로 말하면

“원작 설정(세계관/캐릭터)을 DB에 저장해두고,
내가 쓴 2차 창작 내용을 넣으면 →
그걸 분석해서, 다른 AI 앱에 그대로 붙여 넣을 ‘완성형 프롬프트’를 자동으로 만들어주는 도우미.”

즉, LLM을 직접 소설 쓰는 AI로 쓰는 게 아니라
**“프롬프트를 예쁘게 만들어주는 비서”**로 쓰겠다는 거지. 이게 API 비용도 적게 먹고, 통제감도 훨씬 커.

⸻

2. 기본 구조를 이렇게 잡으면 편함

(1) 원작 설정 저장 형식 (예: JSON)

예를 들어 DB(혹은 노션/로컬 파일)에 이런 식으로 저장:

{
  "world_name": "뮤블 판타지 세계",
  "style": "한국 라이트노벨, 1인칭 시점, 입담 있고 약간 자조적인 톤",
  "canon_rules": [
    "주인공은 절대 살인을 하지 않는다.",
    "마법은 '계약'을 통해서만 사용 가능하다.",
    "시간여행은 없다."
  ],
  "main_characters": [
    {
      "name": "윤서",
      "role": "주인공",
      "personality": "겉은 시니컬하지만 책임감 강함, 말투는 퉁명하지만 속으로 많이 고민함",
      "speech_style": "반말, 짧고 단답형 많이 씀, 가끔 비꼬는 농담"
    },
    {
      "name": "루카",
      "role": "서브 남주",
      "personality": "능글맞고 가벼워 보이지만 상황 판단이 빠름",
      "speech_style": "장난스러운 존댓말 + 반말 섞음"
    }
  ]
}

이걸 “원작 설정 프로필”이라고 생각하고,
2차 창작할 때는 해당 프로필 + 내가 쓴 텍스트만 LLM에 보내는 식.

⸻

(2) 네가 프롬프트 생성기에 줄 입력

프롬프트 생성기(LLM)에는 매번 대략 이런 정보만 보내면 됨:
	•	원작 설정 요약 (가능하면 짧은 버전 / 핵심만)
	•	내가 쓴 2차 창작 텍스트
	•	이번에 AI에게 시키고 싶은 역할 (예: 문장 다듬기 / 다음 장면 이어쓰기 / 대사만 보정 등)

⸻

3. “프롬프트 생성기”용 메타 프롬프트 예시

이건 너가 LLM에 고정으로 넣어둘 시스템 프롬프트라고 생각하면 돼.

너는 "프롬프트 생성기" 역할을 한다.
너의 출력은 "다른 AI 모델에게 줄 단일 프롬프트 한 개"여야 한다. 
설명, 메모, 주석은 넣지 말고, 오직 최종 프롬프트 텍스트만 출력해라.

입력으로는 다음 세 가지를 받는다:
1) 원작 세계관 및 캐릭터 설정
2) 사용자가 쓴 2차 창작 텍스트
3) 이번 요청에서 AI에게 시키고 싶은 작업 종류 (예: 문장 다듬기, 다음 장면 이어쓰기 등)

너는 이 정보를 기반으로, 다음 조건을 모두 만족하는 프롬프트를 만들어야 한다:

- 대상 모델은 일반적인 영어 기반 LLM이라고 가정한다. 
- 프롬프트는 영어로 작성한다.
- 원작 설정에서 중요한 세계관 규칙과 캐릭터 성격, 말투를 꼭 포함한다.
- 사용자의 2차 창작 텍스트를 "원문"으로 명시하고, 
  AI가 원문을 최대한 보존하면서 요청한 작업만 수행하도록 지시한다.
- AI가 멋대로 설정을 추가하거나 개조하지 않도록, 
  "Do not change the established canon or character personalities"를 분명히 써준다.
- 출력 형식(예: '소설 본문만 출력', '설명 없이 결과만 출력')도 프롬프트에 명확히 써준다.
- 너무 장황하지 않게, 다른 AI가 바로 이해하고 실행할 수 있을 정도로만 정리한다.

이제 내가 아래와 같은 형식으로 입력을 줄 것이다:

[WORLD_SETTINGS]
...(여기에 세계관/캐릭터 설정)...

[USER_TEXT]
...(여기에 내가 쓴 2차 창작 텍스트)...

[TASK]
...(여기에 원하는 작업 설명)...

위 세 정보를 바탕으로, 다른 AI에게 줄 "최종 프롬프트"를 영어로 1개만 만들어서 출력해라.


⸻

4. 실제 사용 예시

입력 예시 (네가 LLM에 보냄)

[WORLD_SETTINGS]
World: modern fantasy Seoul.
Style: Korean light novel, first-person POV, witty and slightly self-deprecating tone.
Main character: Yoonseo – cynical but caring, never kills, uses sarcastic short sentences.
Canon rules: Magic only works through contracts. No time travel.

[USER_TEXT]
윤서는 한숨을 쉬며 창밖을 봤다.
"또 비네. 이런 날은 꼭 일이 터지더라..."
그녀는 소파에 털썩 앉아 계약서 뭉치를 발로 툭툭 찼다.
문득 전화기가 울렸고, 화면에는 '루카'라는 이름이 떴다.

[TASK]
- 위 텍스트의 스타일을 유지하면서 문장을 자연스럽게 다듬고, 
- 이어지는 다음 2~3 문단을 영어로 작성해 달라고 다른 AI에게 부탁하는 프롬프트를 만들어줘.
- 소설 본문만 출력하도록 시켜줘. 설명, 해석, 메타 코멘트는 출력하지 말라고 해줘.


⸻

LLM(프롬프트 생성기)의 출력 예시

이게 다른 AI 앱에 그대로 복붙할 최종 프롬프트:

You are a creative writing assistant.

Use the following canon and style guidelines:
- World: modern fantasy Seoul.
- Style: Korean light novel, first-person POV, witty and slightly self-deprecating tone.
- Main character: Yoonseo – cynical but caring, never kills, uses sarcastic short sentences.
- Canon rules: Magic only works through contracts. No time travel.
Do not break these rules. Do not change the established personalities of the characters.

Task:
1. First, lightly polish the Korean text below to make the sentences more natural and vivid, without changing the meaning, style, or tone.
2. Then, continue the scene in English for 2–3 paragraphs, describing what happens right after the phone shows “Ruka” calling.
3. Keep the same POV, tone, and characterization.
4. Output only the story text (first the revised Korean, then the English continuation). Do not include any explanations, notes, or headings.

Original text:
"윤서는 한숨을 쉬며 창밖을 봤다.
'또 비네. 이런 날은 꼭 일이 터지더라...'
그녀는 소파에 털썩 앉아 계약서 뭉치를 발로 툭툭 찼다.
문득 전화기가 울렸고, 화면에는 '루카'라는 이름이 떴다."

이렇게 되면:
	•	네 앱에서는 짧은 설정 + 내가 쓴 텍스트 + TASK만 보내고
	•	LLM이 “프롬프트 포맷 + 영어화 + 안전장치”를 다 알아서 해줌
	•	너는 이걸 노벨라든 ChatGPT든, Gemini든 어디든 복붙해서 쓰면 됨

⸻

5. API 비용 줄이는 팁
	1.	세계관 전문을 매번 보내지 말고, “압축 요약본”만 쓰기
	•	캐릭터 10명 중 2명만 나오면, 그 둘만 요약해서 보내기
	•	“World profile short” / “character profile short” 따로 저장
	2.	이전 회차 요약을 따로 저장
	•	매 장 끝날 때 “한 문단 요약”을 저장해두고
	•	다음에 프롬프트 생성할 때 “지금까지 줄거리 요약”만 보내기
	3.	TASK 패턴 재사용
	•	“문장 다듬기용 템플릿”, “다음 장면 이어쓰기 템플릿”, “대사만 보정 템플릿”
	•	몇 개 패턴만 만들어두고, 선택하는 식으로 하면 토큰 절약 + 일관성 확보

⸻

6. 다음 단계, 원하면 이렇게도 도와줄 수 있어
	•	네가 실제로 쓸 세부 템플릿 3~4개
	•	「문장 다듬기용」
	•	「다음 장면 이어쓰기용」
	•	「대사 톤 통일용」
	•	「줄거리 아웃라인 생성용」
	•	또는 이걸 간단한 웹폼/CLI 툴 구조로 설계해주는 것도 가능
	•	세계관 선택 → TASK 선택 → 텍스트 입력 → 프롬프트 복사하기
