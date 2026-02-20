// 이미지 렌더러: GCS 이미지 경로를 구성하고 로딩 상태를 보고한다.
import { useEffect, useMemo, useState } from "react";
import "./DrawImage.css";

// 프로젝트에서 사용하는 GCS 버킷명
const SKETCHERX_BUCKET = "sketcherx";

// 기본 root 폴더명
const DEFAULT_ROOT = "vinaida";

// 확장자를 모를 때 시도할 이미지 확장자 목록
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"];

// GCS object를 바로 읽을 수 있는 media URL 생성
function buildGcsMediaUrl(bucketName, objectName)
{
  const encoded = encodeURIComponent(objectName);
  return `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${encoded}?alt=media`;
}

// root 경로 정규화: 슬래시 정리
function normalizeRoot(root)
{
  const trimmed = String(root ?? "").trim();
  if (!trimmed) return null;
  return trimmed.replaceAll("\\", "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

// 파일명 정규화: 확장자 제거 및 슬래시 정리
function normalizeFileName(fileName)
{
  const trimmed = String(fileName ?? "").trim();
  if (!trimmed) return null;

  const normalized = trimmed.replaceAll("\\", "/").replace(/^\/+/, "");
  return normalized.endsWith(".json") ? normalized.slice(0, -".json".length) : normalized;
}

// 경로에 확장자가 포함되어 있는지 검사
function hasExtension(path)
{
  const last = path.split("/").at(-1) ?? "";
  return /\.[A-Za-z0-9]{1,8}$/.test(last);
}

// 이미지 후보 경로 리스트 생성
function buildCandidates(root, fileName)
{
  const normalizedRoot = normalizeRoot(root) ?? DEFAULT_ROOT;
  const normalizedFileName = normalizeFileName(fileName);
  if (!normalizedFileName) return [];

  const prefix = `${normalizedRoot}/2.PNG/`;
  const imgsPrefix = "2.PNG/";

  const basePath = normalizedFileName.startsWith(prefix)
    ? normalizedFileName
    : normalizedFileName.startsWith(imgsPrefix)
      ? `${normalizedRoot}/${normalizedFileName}`
      : `${prefix}${normalizedFileName}`;

  if (hasExtension(basePath)) return [basePath];

  return IMAGE_EXTS.map((ext) => `${basePath}.${ext}`);
}

// DrawImage: 이미지 로딩/대체 확장자 탐색/상태 콜백 제공
export function DrawImage({
  root = DEFAULT_ROOT,
  fileName,
  alt = "",
  onStatus,
  showMeta = true,
  emptyText,
  noUrlText,
  errorText,
})
{
  // 후보 경로 목록 생성
  const candidates = useMemo(() => buildCandidates(root, fileName), [root, fileName]);
  const [index, setIndex] = useState(0);
  const [loadedUrl, setLoadedUrl] = useState(null);
  const [error, setError] = useState(null);

  // 현재 후보 인덱스 기준으로 URL 생성
  const url = useMemo(() =>
  {
    const objectName = candidates[index];
    if (!objectName) return null;
    return buildGcsMediaUrl(SKETCHERX_BUCKET, objectName);
  }, [candidates, index]);

  useEffect(() =>
  {
    // root/file 변경 시 상태 초기화
    setIndex(0);
    setLoadedUrl(null);
    setError(null);
  }, [root, fileName]);

  useEffect(() =>
  {
    // 상위에 로딩 상태 전달
    if (!onStatus) return;
    if (!fileName)
    {
      onStatus({ loading: false, found: false, error: null, url: null });
      return;
    }
    onStatus({ loading: true, found: false, error: null, url });
  }, [fileName, url, onStatus]);

  // 파일명이 없으면 빈 상태 표시
  if (!fileName)
  {
    return <div className="drawImageEmpty">{emptyText}</div>;
  }

  // URL 생성 실패 시 빈 상태 표시
  if (!url)
  {
    return <div className="drawImageEmpty">{noUrlText}</div>;
  }

  // 로딩 실패 시 다음 확장자 후보로 이동
  const tryNext = () =>
  {
    setIndex((current) =>
    {
      const next = current + 1;
      if (next < candidates.length)
      {
        setLoadedUrl(null);
        setError(null);
        return next;
      }

      const err = new Error(errorText ?? "");
      setError(err);
      if (onStatus) onStatus({ loading: false, found: false, error: err, url: null });
      return current;
    });
  };

  return (
    <div className={`drawImage${showMeta ? "" : " drawImageCompact"}`}>
      {showMeta ? (
        <div className="drawImageMeta">
          <div className="drawImageUrl">{loadedUrl ?? url}</div>
          {error ? <div className="drawImageErr">{String(error)}</div> : null}
        </div>
      ) : null}

      {!showMeta && error ? <div className="drawImageErr">{String(error)}</div> : null}

      <div className="drawImageStage">
        <img
          className="drawImageImg"
          src={url}
          alt={alt}
          onLoad={() =>
          {
            setLoadedUrl(url);
            if (onStatus) onStatus({ loading: false, found: true, error: null, url });
          }}
          onError={tryNext}
        />
      </div>
    </div>
  );
}
