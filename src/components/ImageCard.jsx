// 이미지 카드: 제목, 이미지 렌더러, 다운로드 버튼을 한 블록으로 묶어 표시한다.
import { useCallback, useMemo, useState } from "react";
import { DrawImage } from "../img/DrawImage.jsx";

// 이미지 카드 컴포넌트
// - DrawImage에서 로드된 URL을 받아 다운로드 버튼에 연결한다.
// - 텍스트/버튼 문구는 상위에서 전달한 값을 사용한다.
export function ImageCard({
  root,
  file,
  onStatus,
  emptyText,
  noUrlText,
  errorText,
  downloadLabel,
})
{
  // 다운로드 URL 상태(이미지 로드 성공 시 설정됨)
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // 파일명 기반으로 다운로드 파일명 생성
  const fileBase = useMemo(() =>
  {
    const date = new Date();

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `vinaida_${y}${m}${d}`
  }, [file]);

  // DrawImage의 상태 콜백을 가로채 다운로드 URL을 저장
  const handleStatus = useCallback((status) =>
  {
    if (status?.url)
    {
      setDownloadUrl(status.url);
    }
    if (onStatus) onStatus(status);
  }, [onStatus]);

  const downloadName = `${fileBase}`;
  const hasDownload = Boolean(downloadUrl);

  const handleDownload = useCallback(async (event) =>
  {
    event.preventDefault();
    if (!hasDownload || isDownloading) return;

    console.log("[ImageCard] download fetch start", { downloadUrl, downloadName });
    setIsDownloading(true);
    try
    {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    }
    finally
    {
      setIsDownloading(false);
    }
  }, [downloadName, downloadUrl, hasDownload, isDownloading]);

  return (
    <section className="imageCard">
      <DrawImage
        root={root}
        fileName={file}
        alt={file}
        onStatus={handleStatus}
        showMeta={false}
        emptyText={emptyText}
        noUrlText={noUrlText}
        errorText={errorText}
      />
      <div className="imageActions">
        <a
          className={`imageDownload${hasDownload && !isDownloading ? "" : " isDisabled"}`}
          href={hasDownload ? downloadUrl : undefined}
          onClick={handleDownload}
          aria-disabled={!hasDownload || isDownloading}
        >
          {downloadLabel}
        </a>
      </div>
    </section>
  );
}
