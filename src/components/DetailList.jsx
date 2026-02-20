// 상세 항목 목록 렌더러
export function DetailList({ sections, emptyText })
{
  if (!sections.length)
  {
    return <div className="emptyText">{emptyText}</div>;
  }

  return (
    <div className="detailList">
      {sections.map((section, index) => (
        <article
          className="detailItem"
          key={`${section.title}-${index}`}
          style={{ "--idx": index }}
        >
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </article>
      ))}
    </div>
  );
}
