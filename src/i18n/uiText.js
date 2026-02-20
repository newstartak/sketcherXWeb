// UI 다국어 문자열 정의(키 중심 구조)
const DEFAULT_LANG = "en";

// 각 문구 키별로 언어 값을 보관
const UI_TEXT = {
  // 페이지 메인 타이틀
  title: {
    ko: "관상 분석 결과",
    ja: "観相分析結果",
    zh: "面相分析结果",
    en: "Physiognomy Analysis Result",
  },
  // 탭: 요약/이미지
  tabOverview: {
    ko: "총평 및 관상 그림",
    ja: "総評と観相画像",
    zh: "总评与面相图",
    en: "Overview / Result Image",
  },
  // 탭: 상세
  tabDetails: {
    ko: "세부 내용",
    ja: "詳細",
    zh: "详情",
    en: "Details",
  },
  // 세부내용 탭 타이틀
  tabTitle: {
    ko: "관상 분석 세부 내용",
    ja: "観相分析の詳細内容",
    zh: "面相分析详细内容",
    en: "Detailed Physiognomy Analysis Content",
  },
  // 탭 영역 접근성 라벨
  tabsAriaLabel: {
    ko: "관상 탭",
    ja: "観相タブ",
    zh: "面相标签",
    en: "Face reading tabs",
  },
  // 요약 카드 제목
  summaryLabel: {
    ko: "총평",
    ja: "総評",
    zh: "总评",
    en: "Overview",
  },
  // 파일/데이터 없음 안내 메시지
  notFound: {
    ko: "파일을 찾을 수 없습니다.",
    ja: "見つかりません",
    zh: "未找到",
    en: "Not found",
  },
  // 없음 안내 보조 문구
  notFoundHint: {
    ko: "QR 코드를 다시 확인해주세요.",
    ja: "QRコードを確認してください。",
    zh: "请检查二维码。",
    en: "Check the QR code and try again.",
  },
  // 요약 데이터 비어 있음
  summaryEmpty: {
    ko: "총평 데이터가 없습니다.",
    ja: "総評データがありません。",
    zh: "没有总评数据。",
    en: "Summary data is not available yet.",
  },
  // 상세 리스트 비어 있음
  detailsEmpty: {
    ko: "표시할 항목이 없습니다.",
    ja: "表示する項目がありません。",
    zh: "没有可显示的项目。",
    en: "No items to display.",
  },
  // 이미지 파일명 없음 표시
  imageEmpty: {
    ko: "-",
    ja: "-",
    zh: "-",
    en: "-",
  },
  // 이미지 URL 없음 표시
  imageNoUrl: {
    ko: "이미지 URL이 없습니다.",
    ja: "画像URLがありません。",
    zh: "没有图片URL。",
    en: "No URL",
  },
  // 이미지 로드 실패 표시
  imageError: {
    ko: "이미지를 찾을 수 없습니다.",
    ja: "画像が見つかりません。",
    zh: "未找到图片。",
    en: "Image not found",
  },
  // 다운로드 버튼 라벨
  downloadLabel: {
    ko: "다운로드",
    ja: "Download",
    zh: "Download",
    en: "Download",
  },
  // 알 수 없는 키 표시용 라벨
  unknownKey: {
    ko: "항목",
    ja: "項目",
    zh: "项目",
    en: "Item",
  },
};

// 해당 언어가 없으면 기본 언어로 폴백
function pickLang(valueMap, lang)
{
  return valueMap?.[lang] ?? valueMap?.[DEFAULT_LANG] ?? "";
}

// 현재 언어에 맞는 UI 문구 집합 반환
export function getUiText(lang)
{
  const key = String(lang ?? DEFAULT_LANG).toLowerCase();
  return {
    title: pickLang(UI_TEXT.title, key),
    tabOverview: pickLang(UI_TEXT.tabOverview, key),
    tabTitle: pickLang(UI_TEXT.tabTitle, key),
    tabDetails: pickLang(UI_TEXT.tabDetails, key),
    tabsAriaLabel: pickLang(UI_TEXT.tabsAriaLabel, key),
    summaryLabel: pickLang(UI_TEXT.summaryLabel, key),
    notFound: pickLang(UI_TEXT.notFound, key),
    notFoundHint: pickLang(UI_TEXT.notFoundHint, key),
    summaryEmpty: pickLang(UI_TEXT.summaryEmpty, key),
    detailsEmpty: pickLang(UI_TEXT.detailsEmpty, key),
    imageEmpty: pickLang(UI_TEXT.imageEmpty, key),
    imageNoUrl: pickLang(UI_TEXT.imageNoUrl, key),
    imageError: pickLang(UI_TEXT.imageError, key),
    downloadLabel: pickLang(UI_TEXT.downloadLabel, key),
    unknownKey: pickLang(UI_TEXT.unknownKey, key),
  };
}
