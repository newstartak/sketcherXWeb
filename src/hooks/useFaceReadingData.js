// JSON 데이터를 화면용 구조(요약/상세)로 변환하는 훅
import { useMemo } from "react";

// 키를 화면에 표시할 문자열로 변환
function toDisplayKey(key, labelMap, unknownKey)
{
  const raw = String(key ?? "").trim();
  if (!raw) return unknownKey;

  const lowered = raw.toLowerCase();
  if (labelMap[lowered]) return labelMap[lowered];

  return raw;
}

// 값을 문자열로 표시할 수 있게 변환
function toDisplayValue(value)
{
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try
  {
    return JSON.stringify(value, null, 2);
  }
  catch
  {
    return String(value);
  }
}

// 원본 JSON을 요약/상세 섹션 구조로 변환
function buildSectionsFromJson(data, options)
{
  const { detailKeys, summaryLabel, unknownKey } = options;

  if (data == null || typeof data !== "object" || Array.isArray(data))
  {
    return { summaryTitle: summaryLabel, summaryText: "", sections: [] };
  }

  const rawEntries = Object.entries(data);
  const summaryEntry = rawEntries[0] ?? null;
  const summaryKey = summaryEntry ? String(summaryEntry[0]).toLowerCase() : "";

  // 값이 비어 있지 않은 항목만 추림
  const entries = rawEntries.filter(([, value]) => toDisplayValue(value));
  const entryByLower = new Map(
    entries.map(([key, value]) => [String(key).toLowerCase(), [key, value]]),
  );

  const summaryTitle = summaryEntry
    ? toDisplayKey(summaryEntry[0], {}, unknownKey)
    : summaryLabel;
  const summaryText = summaryEntry ? toDisplayValue(summaryEntry[1]) : "";

  // detailKeys가 없으면 첫 번째 키/lang을 제외한 모든 키를 상세로 사용
  const resolvedDetailKeys = detailKeys && detailKeys.length
    ? detailKeys
    : entries
        .map(([key]) => String(key).toLowerCase())
        .filter((key) => key !== summaryKey && key !== "lang");

  const sections = resolvedDetailKeys
    .map((key) => entryByLower.get(key))
    .filter(Boolean)
    .map(([key, value]) => ({
      title: toDisplayKey(key, {}, unknownKey),
      content: toDisplayValue(value),
    }));

  return { summaryTitle, summaryText, sections };
}

// 데이터 변경 시 메모이즈된 결과를 제공
export function useFaceReadingData(data, options = {})
{
  const detailKeys = options.detailKeys
    ? options.detailKeys.map((k) => String(k).toLowerCase())
    : null;
  const summaryLabel = options.summaryLabel ?? "";
  const unknownKey = options.unknownKey ?? "";

  return useMemo(
    () => buildSectionsFromJson(data, {
      detailKeys,
      summaryLabel,
      unknownKey,
    }),
    [data, detailKeys, summaryLabel, unknownKey],
  );
}
