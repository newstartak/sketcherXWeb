// 데이터가 없을 때 보여주는 안내 컴포넌트
export function NotFoundNotice({ text, hint })
{
  return (
    <div className="notice">
      {text}
      <div className="noticeHint">{hint}</div>
    </div>
  );
}
