<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

// '/posts/' 하위의 개별 문서인지 확인
const isPost = computed(() => route.path.includes('/posts/') && !route.path.endsWith('/'))

// 영문 날짜 변환 함수
const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<template>
  <Layout>
    <template #doc-before>
      <div v-if="isPost" style="text-align: center; margin-bottom: 60px;">
        <h1 style="font-size: 2.4rem; font-weight: bold; border: none; margin-top: 32px; margin-bottom: 24px; color: var(--vp-c-text-1); line-height: 1.4;">
          {{ frontmatter.title }}
        </h1>
        
        <p style="color: var(--vp-c-text-2); margin: 0;">
          {{ formatDate(frontmatter.date) }}
        </p>

        <div v-if="frontmatter.tags && frontmatter.tags.length" style="display: flex; justify-content: center; gap: 8px; margin-top: 24px;">
          <span v-for="tag in frontmatter.tags" :key="tag" 
                style="background: var(--vp-c-bg-soft); padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; color: var(--vp-c-brand-1); font-weight: 500;">
            #{{ tag }}
          </span>
        </div>

        <hr style="margin-top: 60px; border: none; border-top: 1px solid var(--vp-c-divider);">
      </div>
    </template>
  </Layout>
</template>