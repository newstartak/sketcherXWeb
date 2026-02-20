// URL 쿼리 파라미터(root/file/lang)를 읽어오는 훅
import { useEffect, useState } from "react";

// URL에서 root/file/lang을 읽는다 (popstate 대응)
// 예: /?root=vinaida&file=1234&lang=ko
function readQuery()
{
  const params = new URLSearchParams(window.location.search);
  const root = (params.get("root") ?? "vinaida").trim() || "vinaida";
  const file = (params.get("file") ?? "").trim();
  const lang = (params.get("lang") ?? "").trim();
  return { root, file, lang };
}

export function useSketcherXQuery()
{
  const [query, setQuery] = useState(() => readQuery());

  useEffect(() =>
  {
    // 브라우저 뒤로가기/앞으로가기에 따라 쿼리 재읽기
    const onPopState = () => setQuery(readQuery());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return query;
}
