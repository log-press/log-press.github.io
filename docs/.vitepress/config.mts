import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Log-Press",
  description: "My Text Archive",
  
  themeConfig: {
    // 로고 이미지 설정 (public 폴더 내 logo.png 사용)
    logo: '/logo-2.png',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Posts',
        items: [
          { text: '학부 리포트', link: '/posts/univ-reports/' },
          { text: '일기', link: '/posts/diary/' }
        ]
      },
      { text: 'Tags', link: '/tags' },
      { text: 'About', link: '/about' }
    ],

    docFooter: {
      prev: false,
      next: false
    },

    footer: {
      copyright: 'Copyright © 2026 Seulchan Lee'
    }
  },

  // 자동화 핵심 규칙: 렌더링 전 설정 강제 주입
  transformPageData(pageData) {
    // 경로가 'posts/'로 시작하고 'index.md'(카테고리 목차)가 아닌 개별 문서일 경우
    if (pageData.relativePath.startsWith('posts/') && !pageData.relativePath.endsWith('index.md')) {
      pageData.frontmatter.sidebar = false;
      // pageData.frontmatter.aside = false; 해당 줄을 삭제하여 aside를 활성화합니다.
    }
  }
})