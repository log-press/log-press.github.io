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
        cleanContent = cleanContent.replace(/#+\s/g, '').replace(/\n/g, ' ').trim()

        return {
          title: page.frontmatter.title || '제목 없음',
          url: page.url,
          date: page.frontmatter.date,
          tags: page.frontmatter.tags || [], // 태그 데이터 추가 (없으면 빈 배열)
          preview: cleanContent.length > 100 ? cleanContent.slice(0, 100) + '...' : cleanContent
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