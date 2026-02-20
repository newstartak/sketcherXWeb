// 탭 UI 컴포넌트: 총평/상세 전환 버튼을 렌더링한다.
export function ViewerTabs({ activeTab, onSelect, labelOverview, labelDetails, ariaLabel })
{
  return (
    <div className="viewerTabs" role="tablist" aria-label={ariaLabel}>
      <button
        type="button"
        role="tab"
        className={`viewerTab${activeTab === "overview" ? " isActive" : ""}`}
        aria-selected={activeTab === "overview"}
        onClick={() => onSelect("overview")}
      >
        {labelOverview}
      </button>
      <button
        type="button"
        role="tab"
        className={`viewerTab${activeTab === "details" ? " isActive" : ""}`}
        aria-selected={activeTab === "details"}
        onClick={() => onSelect("details")}
      >
        {labelDetails}
      </button>
    </div>
  );
}
