---
sidebar: false
aside: false
---

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { data as allPosts } from '../posts.data.mts'

const categoryPosts = allPosts.filter(p => p.url.includes('/univ-reports/'))

const postsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(categoryPosts.length / postsPerPage))

// 페이지 번호 배열 생성
const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return categoryPosts.slice(start, end)
})

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// URL을 변경하고 상태를 업데이트하는 함수
const changePage = (page) => {
  currentPage.value = page
  if (typeof window !== 'undefined') {
    const url = new URL(window.location)
    if (page === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', page)
    }
    window.history.pushState({}, '', url)
  }
}

// 브라우저 뒤로가기/앞으로가기 감지 시 URL에서 페이지 번호를 읽어오는 함수
const handlePopState = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const page = parseInt(params.get('page'))
    currentPage.value = !isNaN(page) && page > 0 ? page : 1
  }
}

// 컴포넌트 마운트 시 URL 확인 및 이벤트 리스너 등록
onMounted(() => {
  handlePopState()
  window.addEventListener('popstate', handlePopState)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<h1 style="text-align: center; margin-bottom: 24px; font-size: 2.4rem;">학부 리포트</h1>

<p style="color: var(--vp-c-text-2); text-align: center; font-size: 1.1rem; margin-bottom: 24px; line-height: 1.6;">
  학부생 시절 작성한 리포트와 에세이를 모았습니다. <br> 깊이는 없고 허세는 과합니다. <br> 그래도 글마다 그때가 생각나 남겨둡니다.
</p>

---

<div v-for="post in paginatedPosts" :key="post.url" style="margin-top: 24px;">
  <span style="display: block; color: var(--vp-c-text-2); font-size: 0.9rem; margin-bottom: 0;">
    {{ formatDate(post.date) }}
  </span>
  
  <h2 style="border: none !important; margin-top: 8px !important; margin-bottom: 8px !important; padding: 0 !important; line-height: 1.2;">
    <a :href="post.url" style="color: var(--vp-c-text-1); text-decoration: none; font-weight: bold;">
      {{ post.title }}
    </a>
  </h2>

  <div v-if="post.tags && post.tags.length" style="display: flex; gap: 8px; margin-bottom: 12px;">
    <span v-for="tag in post.tags" :key="tag" style="font-size: 0.85rem; color: var(--vp-c-brand-1); font-weight: 500;">
      #{{ tag }}
    </span>
  </div>
  
  <p style="color: var(--vp-c-text-2); line-height: 1.6;">
    {{ post.preview }}
  </p>
  
  <hr style="margin: 24px 0; border-color: var(--vp-c-divider);">
</div>

<div v-if="totalPages > 1" style="display: flex; justify-content: center; gap: 8px; margin-top: 40px;">
  <button 
    v-for="page in pageNumbers" 
    :key="page"
    @click="changePage(page)"
    :style="{
      padding: '6px 12px',
      border: '1px solid var(--vp-c-divider)',
      borderRadius: '4px',
      background: currentPage === page ? 'var(--vp-c-brand-1)' : 'transparent',
      /* custom.css에 정의된 테마별 대비 색상 변수를 사용하여 가독성을 확보합니다 */
      color: currentPage === page ? 'var(--vp-button-brand-text)' : 'var(--vp-c-text-1)',
      cursor: 'pointer',
      fontWeight: currentPage === page ? 'bold' : 'normal'
    }"
  >
    {{ page }}
  </button>
</div>