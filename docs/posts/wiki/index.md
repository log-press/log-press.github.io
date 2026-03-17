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
const maxVisiblePages = 5

const totalPages = computed(() => Math.ceil(categoryPosts.length / postsPerPage))

const pageNumbers = computed(() => {
  const pages = []
  const startPage = Math.floor((currentPage.value - 1) / maxVisiblePages) * maxVisiblePages + 1
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value)
  
  for (let i = startPage; i <= endPage; i++) {
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

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return 
  
  currentPage.value = page
  if (typeof window !== 'undefined') {
    const url = new URL(window.location)
    if (page === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', page)
    }
    window.history.pushState({}, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handlePopState = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const page = parseInt(params.get('page'))
    currentPage.value = !isNaN(page) && page > 0 ? page : 1
  }
}

onMounted(() => {
  handlePopState()
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

// 마크다운 파싱 오류 방지를 위한 스타일 객체 분리
const getButtonStyle = (page) => ({
  padding: '6px 12px',
  border: '1px solid var(--vp-c-divider)',
  borderRadius: '4px',
  background: currentPage.value === page ? 'var(--vp-c-brand-1)' : 'transparent',
  color: currentPage.value === page ? 'var(--vp-button-brand-text)' : 'var(--vp-c-text-1)',
  cursor: 'pointer',
  fontWeight: currentPage.value === page ? 'bold' : 'normal'
})

const getNavButtonStyle = (isDisabled) => ({
  padding: '6px 12px',
  border: '1px solid var(--vp-c-divider)',
  borderRadius: '4px',
  background: 'transparent',
  color: 'var(--vp-c-text-1)',
  opacity: isDisabled ? 0.5 : 1,
  cursor: isDisabled ? 'not-allowed' : 'pointer'
})
</script>

<h1 style="text-align: center; margin-bottom: 24px; font-size: 2.4rem;">위키</h1>

<p style="color: var(--vp-c-text-2); text-align: center; font-size: 1.1rem; margin-bottom: 24px; line-height: 1.6;">
  정보글은 개추.
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

<div v-if="totalPages > 1" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px;">
  <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" :style="getNavButtonStyle(currentPage === 1)">
    {{ '<' }}
  </button>

  <button v-for="page in pageNumbers" :key="page" @click="changePage(page)" :style="getButtonStyle(page)">
    {{ page }}
  </button>

  <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" :style="getNavButtonStyle(currentPage === totalPages)">
    {{ '>' }}
  </button>
</div>