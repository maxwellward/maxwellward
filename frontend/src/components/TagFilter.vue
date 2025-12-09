<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  tags: string[];
  posts: Array<{
    id: string;
    data: {
      title: string;
      description: string;
      pubDate: Date;
      tags: string[];
      image?: string;
    };
  }>;
}>();

const selectedTags = ref<string[]>([]);

const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    return props.posts;
  }
  return props.posts.filter((post) =>
    selectedTags.value.every((tag) => post.data.tags.includes(tag))
  );
});

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
  updateUrl();
}

function clearFilters() {
  selectedTags.value = [];
  updateUrl();
}

function updateUrl() {
  const url = new URL(window.location.href);
  if (selectedTags.value.length === 0) {
    url.searchParams.delete('tag');
  } else {
    url.searchParams.set('tag', selectedTags.value.join(','));
  }
  history.replaceState({}, '', url.toString());
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const tagParam = params.get('tag');
  if (tagParam) {
    selectedTags.value = tagParam.split(',').filter((t) => props.tags.includes(t));
  }
});
</script>

<template>
  <div class="blog-filter">
    <div class="filter-section">
      <div class="filter-header">
        <span class="filter-label">// filter by tag</span>
        <button
          v-if="selectedTags.length > 0"
          class="clear-btn"
          @click="clearFilters"
        >
          clear all
        </button>
      </div>

      <div class="tags-list">
        <button
          v-for="tag in tags"
          :key="tag"
          class="tag-btn"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <div class="results-info">
        <span class="results-count">{{ filteredPosts.length }}</span> of {{ posts.length }} posts
      </div>
    </div>

    <div class="posts-grid">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="blog-card"
      >
        <div v-if="post.data.image" class="blog-image">
          <img :src="post.data.image" :alt="post.data.title" loading="lazy" />
        </div>
        <div class="blog-content">
          <div class="blog-meta">
            <time :datetime="new Date(post.data.pubDate).toISOString()">
              {{ formatDate(post.data.pubDate) }}
            </time>
          </div>
          <h3 class="blog-title">
            <a :href="`/blog/${post.id}`">{{ post.data.title }}</a>
          </h3>
          <p class="blog-description">{{ post.data.description }}</p>
          <div v-if="post.data.tags.length > 0" class="blog-tags">
            <button
              v-for="tag in post.data.tags"
              :key="tag"
              class="tag"
              :class="{ active: selectedTags.includes(tag) }"
              @click.prevent="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
          <div class="blog-footer">
            <a :href="`/blog/${post.id}`" class="read-more">read more →</a>
          </div>
        </div>
      </article>
    </div>

    <div v-if="filteredPosts.length === 0" class="empty-state">
      <p>No posts match the selected filters.</p>
      <button class="clear-filters-btn" @click="clearFilters">clear filters</button>
    </div>
  </div>
</template>

<style scoped>
.blog-filter {
  width: 100%;
}

.filter-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.filter-label {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.clear-btn {
  background: none;
  border: none;
  font-family: var(--font-mono);
  color: var(--color-primary);
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
}

.clear-btn:hover {
  text-decoration: underline;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.tag-btn {
  padding: 0.375rem 0.75rem;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tag-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.tag-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.results-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.results-count {
  font-family: var(--font-mono);
  color: var(--color-text);
  font-weight: 500;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.blog-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.2s ease;
}

.blog-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.blog-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-image img {
  transform: scale(1.02);
}

.blog-content {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.blog-meta time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.blog-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: var(--space-sm) 0;
  line-height: 1.4;
}

.blog-title a {
  color: var(--color-text);
  text-decoration: none;
}

.blog-title a:hover {
  color: var(--color-primary);
}

.blog-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: var(--space-md);
  flex: 1;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-family: var(--font-mono);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tag:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.tag.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.blog-footer {
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.read-more {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.read-more:hover {
  color: var(--color-primary);
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
}

.clear-filters-btn {
  margin-top: var(--space-md);
  padding: 0.625rem 1.25rem;
  background: transparent;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease;
}

.clear-filters-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>