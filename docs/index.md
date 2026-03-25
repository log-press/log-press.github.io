---
layout: home
---

<script setup>
import { data as allPosts } from './posts/posts.data.mts'

const recentPosts = allPosts.slice(0, 5)

// 화살표 클릭 시 'recent posts' 영역으로 이동하는 함수
const scrollToRecent = () => {
  if (typeof window !== 'undefined') {
    const el = document.getElementById('recent-posts')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<div style="height: 85vh; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;">
  <img src="/logo-2.png" alt="로고 이미지" style="width: 280px; margin: 0 auto; display: block;" />
  
  <h1 style="font-size: 2.4rem; font-weight: 700; margin-top: 24px;">Log-Press</h1>
  
  <p style="font-size: 1rem; color: var(--vp-c-text-2); margin-top: 24px;">
    텍스트 아카이브
  </p>

  <div class="scroll-down-btn" @click="scrollToRecent" style="color: var(--vp-c-text-2); cursor: pointer; margin-top: 24px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
</div>

<div id="recent-posts" style="max-width: 600px; margin: 100px auto 200px; padding: 100px 24px 0 24px;">
  <h2 style="font-size: 1.4rem; text-align: center; border-bottom: 2px solid var(--vp-c-divider); padding-bottom: 14px; margin-bottom: 24px;">
    Recent Posts
  </h2>

  <div v-for="post in recentPosts" :key="post.url" style="margin-bottom: 12px; text-align: center;">
    <h3 style="margin: 0 !important; border: none !important; padding: 0 !important;">
      <a :href="post.url" style="font-size: 1.05rem; font-weight: normal; color: var(--vp-c-text-2); text-decoration: none;">
         {{ post.title }}
      </a>
    </h3>
  </div>
</div>