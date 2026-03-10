---
sidebar: false
aside: false
---

<script setup>
import { computed } from 'vue'
import { data as allPosts } from './posts/posts.data.mts'

const tagGroups = computed(() => {
  if (!allPosts || !Array.isArray(allPosts)) return [];
  
  const groups = {};
  allPosts.forEach(post => {
    if (post?.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        if (!groups[tag]) groups[tag] = [];
        if (post.title && post.url) groups[tag].push(post);
      });
    }
  });
  
  return Object.keys(groups).map(tag => {
    const sortedPosts = groups[tag].sort((a, b) => {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
    return {
      tag: tag,
      posts: sortedPosts,
      latestDate: sortedPosts.length > 0 ? new Date(sortedPosts[0].date || 0).getTime() : 0
    };
  }).sort((a, b) => b.latestDate - a.latestDate);
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>

<h1 style="text-align: center; margin-bottom: 48px; font-size: 2.4rem;">Tags</h1>

<div v-if="tagGroups.length === 0" style="text-align: center; color: var(--vp-c-text-2); margin-top: 64px;">
  <p>태그 데이터를 불러오는 중이거나 등록된 태그가 없습니다.</p>
</div>
<div v-else>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 64px;">
    <a v-for="group in tagGroups" :key="'link-' + group.tag" :href="'#' + group.tag" style="padding: 6px 14px; background-color: var(--vp-c-bg-alt); border-radius: 4px; color: var(--vp-c-text-1); text-decoration: none; font-size: 0.95rem; font-weight: 500;">
      {{ group.tag }}
    </a>
  </div>
  <div style="max-width: 760px; margin: 0 auto;">
    <div v-for="group in tagGroups" :key="group.tag" :id="group.tag" style="margin-bottom: 56px; scroll-margin-top: 80px;">
      <h2 style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 12px; margin-bottom: 24px; font-size: 1.5rem; display: flex; align-items: center; gap: 8px; border-top: none !important; margin-top: 0 !important;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-text-2);">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        {{ group.tag }}
      </h2>
      <div v-for="post in group.posts" :key="post.url" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
        <a :href="post.url" style="color: var(--vp-c-text-1); text-decoration: none; font-size: 1.05rem;">
          {{ post.title }}
        </a>
        <span style="color: var(--vp-c-text-2); font-size: 0.9rem; margin-left: 16px; white-space: nowrap;">
          {{ formatDate(post.date) }}
        </span>
      </div>
    </div>
  </div>
</div>