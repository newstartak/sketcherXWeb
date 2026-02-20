// 메인 페이지: 쿼리 파라미터 기반으로 데이터를 불러와 화면을 구성한다.
import { useState } from "react";
import { NotFoundNotice } from "../components/NotFoundNotice.jsx";
import { DetailList } from "../components/DetailList.jsx";
import { ImageCard } from "../components/ImageCard.jsx";
import { SummaryCard } from "../components/SummaryCard.jsx";
import { ViewerTabs } from "../components/ViewerTabs.jsx";
import { useSketcherxJson } from "../json/TextJson.jsx";
import { useSketcherXQuery } from "../hooks/useSketcherXQuery.js";
import { useFaceReadingData } from "../hooks/useFaceReadingData.js";
import { getUiText } from "../i18n/uiText.js";
import "./ViewerPage.css";

// ViewerPage: 하위 카드 조합 전용 컴포넌트
export function ViewerPage()
{
  // URL 쿼리에서 root/file/lang을 가져온다.
  const { root, file, lang } = useSketcherXQuery();
  const [activeTab, setActiveTab] = useState("overview");

  // 이미지 로딩 상태(파일 유무 상태 판단에 사용)
  const [imageStatus, setImageStatus] = useState({
    loading: false,
    found: false,
    error: null,
    url: null,
  });

  // JSON 데이터 로드
  const { url, data, error, loading, found } = useSketcherxJson(root, file);
  // 다국어 텍스트
  const uiText = getUiText(lang);
  // JSON을 요약/상세 섹션으로 가공
  const parsed = useFaceReadingData(data, {
    summaryLabel: uiText.summaryLabel,
    unknownKey: uiText.unknownKey,
  });

  // 로딩/존재 여부 계산
  const anyLoading =
    Boolean(file)
    && (loading || imageStatus.loading || (url != null && !found && !error));
  const anyFound = Boolean(file) && (found || imageStatus.found);
  const showNotFound = !file || (!anyLoading && !anyFound);

  const titleText = uiText.title;
  const tabOverview = uiText.tabOverview;
  const tabDetails = uiText.tabDetails;
  const tabTitle = uiText.tabTitle;
  const downloadLabel = uiText.downloadLabel;
  const notFoundText = uiText.notFound;
  const notFoundHint = uiText.notFoundHint;
  const tabsAriaLabel = uiText.tabsAriaLabel;

  return (
    <div className="viewerPage">
      {/* 탭 영역 */}
      <ViewerTabs
        activeTab={activeTab}
        onSelect={setActiveTab}
        labelOverview={tabOverview}
        labelDetails={tabDetails}
        ariaLabel={tabsAriaLabel}
      />

      {/* 파일 미존재/로딩 실패 안내 */}
      {showNotFound ? <NotFoundNotice text={notFoundText} hint={notFoundHint} /> : null}

      {file ? (
        <div className="viewerBody" style={showNotFound ? { display: "none" } : undefined}>
          {/* 총평 탭 */}
          <div className={`viewerPanel${activeTab === "overview" ? " isShown" : ""}`}>
            <div className="panelDecor panelDecorOverview" aria-hidden="true">
              <span className="decorItem decorGat" />
              <span className="decorItem decorBok" />
              <span className="decorItem decorMugu" />
            </div>
            <div className="overviewItem" style={{ "--idx": 0 }}>
              <SummaryCard
                title={titleText}
                subtitle={parsed.summaryTitle}
                text={parsed.summaryText}
                emptyText={uiText.summaryEmpty}
              />
            </div>
            <div className="overviewItem" style={{ "--idx": 1 }}>
              <ImageCard
                root={root}
                file={file}
                onStatus={setImageStatus}
                emptyText={uiText.imageEmpty}
                noUrlText={uiText.imageNoUrl}
                errorText={uiText.imageError}
                downloadLabel={downloadLabel}
              />
            </div>
          </div>

          {/* 상세 탭 */}
          <div className={`viewerPanel${activeTab === "details" ? " isShown" : ""}`}>
            <div className="panelDecor panelDecorDetails" aria-hidden="true">
              <span className="decorItem decorGat" />
              <span className="decorItem decorBok" />
              <span className="decorItem decorMugu" />
              <span className="decorItem decorBosal" />
            </div>
            <h2 className="detailsTabTitle">{tabTitle}</h2>
            <DetailList sections={parsed.sections} emptyText={uiText.detailsEmpty} />
            <div className="detailsEndArea" aria-hidden="true">
              <span className="detailsEndImage" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
