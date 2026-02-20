// 총평 카드: 메인 제목, 요약 제목(첫 키), 본문을 표시한다.
export function SummaryCard({ title, subtitle, text, emptyText })
{
  return (
    <section className="summaryCard">
      <h2>{title}</h2>
      {subtitle ? <h3 className="summarySubTitle">{subtitle}</h3> : null}
      <p>{text || emptyText}</p>
    </section>
  );
}
