import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/**/*.md', {
  includeSrc: true,
  transform(rawData) {
    return rawData
      // 1. 카테고리 목차용 파일(index.md)은 목록에서 제외합니다.
      .filter(page => !page.url.endsWith('/'))
      .map((page) => {
        // 프론트매터 제거 및 본문 텍스트 추출
        let cleanContent = page.src ? page.src.replace(/^---[\s\S]+?---\s*/, '') : ''
        
        // 마크다운 특수기호 정규식(Regex) 처리
        cleanContent = cleanContent
          .replace(/!\[.*?\]\(.*?\)/g, '') // 1. 이미지는 아예 제거
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 2. 링크는 주소 지우고 텍스트만 남김 ([텍스트](주소) -> 텍스트)
          .replace(/[`~*_]+/g, '') // 3. 굵게, 기울임, 취소선, 인라인 코드 기호 등 제거
          .replace(/#+\s/g, '') // 4. 헤더 기호(#) 제거
          .replace(/>\s/g, '') // 5. 인용문 기호(>) 제거
          .replace(/<\/?[^>]+(>|$)/g, '') // 6. 혹시 섞여 있을 HTML 태그 제거
          .replace(/\s+/g, ' ') // 7. 여러 줄바꿈과 탭, 연속된 공백을 띄어쓰기 하나로 통일
          .trim()

        return {
          title: page.frontmatter.title || '제목 없음',
          url: page.url,
          date: page.frontmatter.date,
          tags: page.frontmatter.tags || [], // 태그 데이터 추가 (없으면 빈 배열)
          preview: cleanContent.length > 125 ? cleanContent.slice(0, 125) + '...' : cleanContent
        }
      })
      // 2. 작성일 기준 최신순(내림차순)으로 다시 정렬합니다.
      .sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime()
        const dateB = new Date(b.date || 0).getTime()
        return dateB - dateA
      })
  }
})