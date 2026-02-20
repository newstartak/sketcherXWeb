// GCS에서 JSON을 가져와 파싱하는 훅
import { useEffect, useMemo, useState } from "react";

// 프로젝트에서 사용하는 GCS 버킷명
const SKETCHERX_BUCKET = "sketcherx";

// 기본 root 폴더명
const DEFAULT_ROOT = "vinaida";

// GCS 객체의 media URL 생성
// 주의: 객체 공개 및 CORS 허용이 필요함
function buildGcsMediaUrl(bucketName, objectName)
{
  const encoded = encodeURIComponent(objectName);
  return `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${encoded}?alt=media`;
}

// 파일명을 `.json` 형태로 정규화
// - `abc` -> `abc.json`
// - `abc.json` -> `abc.json`
// - `\` -> `/`
function normalizeJsonFileName(fileName)
{
  const trimmed = String(fileName ?? "").trim();
  if (!trimmed) return null;

  const normalizedSlashes = trimmed.replaceAll("\\", "/").replace(/^\/+/, "");
  const withoutExt = normalizedSlashes.endsWith(".json")
    ? normalizedSlashes.slice(0, -".json".length)
    : normalizedSlashes;

  return `${withoutExt}.json`;
}

// root 경로 정규화
// - 슬래시 앞뒤 정리
// - `\` -> `/`
function normalizeRoot(root)
{
  const trimmed = String(root ?? "").trim();
  if (!trimmed) return null;
  return trimmed.replaceAll("\\", "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

// (root, fileName)으로 GCS object 경로 생성
// 최종 형태: `{root}/5.FACEREADING/{fileName}.json`
function buildSketcherxObjectName(root, fileName)
{
  const normalizedRoot = normalizeRoot(root) ?? DEFAULT_ROOT;
  const normalized = normalizeJsonFileName(fileName);
  if (!normalized) return null;

  const prefix = `${normalizedRoot}/5.FACEREADING/`;
  return normalized.startsWith(prefix) ? normalized : `${prefix}${normalized}`;
}

// sketcherx 버킷에서 JSON을 fetch하고 파싱
export function useSketcherxJson(root, fileName)
{
  // root/file 변경 시 object 경로 재계산
  const objectName = useMemo(
    () => buildSketcherxObjectName(root, fileName),
    [root, fileName],
  );

  // object 경로를 media URL로 변환
  const url = useMemo(() =>
  {
    if (!objectName) return null;
    return buildGcsMediaUrl(SKETCHERX_BUCKET, objectName);
  }, [objectName]);

  // data: 파싱된 JSON
  // error: 네트워크/권한/CORS/파싱 오류
  // loading: 요청 진행 중
  // found: JSON 정상 수신/파싱 여부
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);

  useEffect(() =>
  {
    // URL이 없으면 상태 초기화
    if (!url)
    {
      setData(null);
      setError(null);
      setLoading(false);
      setFound(false);
      return;
    }

    // root/file 변경 시 이전 요청 중단
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setFound(false);

    fetch(url, { signal: controller.signal })
      .then(async (r) =>
      {
        if (!r.ok)
        {
          const err = new Error(`HTTP ${r.status}`);
          err.status = r.status;
          throw err;
        }
        return await r.text();
      })
      .then((t) =>
      {
        const parsed = JSON.parse(t);
        setData(parsed);
        setFound(true);
      })
      .catch((e) =>
      {
        // AbortError는 정상 취소이므로 무시
        if (e?.name === "AbortError") return;
        setError(e);
        setData(null);
        setFound(false);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { url, data, error, loading, found };
}


