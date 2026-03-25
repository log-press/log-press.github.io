import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/**/*.md', {
  includeSrc: true,
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('/'))
      .map((page) => {
        let cleanContent = page.src || ''
        
        // 1. 프론트매터 제거
        cleanContent = cleanContent.replace(/^---[\s\S]+?---/, '')
        
        // 2. 커스텀 컨테이너 (::: info 등) 블록 전체 제거
        cleanContent = cleanContent.replace(/:::.*?[\r\n]+([\s\S]*?)[\r\n]+:::/g, '')
        
        // 3. iframe 태그 블록 전체 제거
        cleanContent = cleanContent.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
        
        // 4. HTML 태그 제거
        cleanContent = cleanContent.replace(/<[^>]+>/g, '')
        
        // 5. 마크다운 링크 파싱
        cleanContent = cleanContent.replace(/\[([\s\S]*?)\]\([^)]+\)/g, '$1')
        
        // 6. 마크다운 특수기호 제거 (대괄호 제외)
        cleanContent = cleanContent.replace(/[!*~`#>_\-]/g, '')
        
        // 7. 불필요한 공백 및 줄바꿈 압축
        cleanContent = cleanContent.replace(/\s+/g, ' ').trim()

        return {
          title: page.frontmatter.title || '제목 없음',
          url: page.url,
          date: page.frontmatter.date,
          tags: page.frontmatter.tags || [],
          preview: cleanContent.length > 125 ? cleanContent.slice(0, 125) + '...' : cleanContent
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime()
        const dateB = new Date(b.date || 0).getTime()
        return dateB - dateA
      })
  }
})