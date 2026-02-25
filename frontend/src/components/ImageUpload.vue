<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

const ALLOWED_EMAIL = 'max.jp.ward@gmail.com';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/heic'];
const ALLOWED_EXTENSIONS = '.jpg, .jpeg, .png, .gif, .heic';

const backendUrl = import.meta.env.PUBLIC_BACKEND_URL;

const user = ref<User | null>(null);
const loading = ref(true);
const unauthorized = ref(false);
const uploading = ref(false);
const error = ref('');
const markdownLink = ref('');
const copied = ref(false);
const dragging = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    loading.value = false;
    if (firebaseUser) {
      if (firebaseUser.email === ALLOWED_EMAIL) {
        user.value = firebaseUser;
        unauthorized.value = false;
      } else {
        unauthorized.value = true;
        user.value = null;
      }
    } else {
      user.value = null;
      unauthorized.value = false;
    }
  });
});

async function handleSignIn() {
  error.value = '';
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (e: any) {
    error.value = e.message || 'Sign-in failed';
  }
}

async function handleSignOut() {
  await signOut(auth);
  unauthorized.value = false;
  markdownLink.value = '';
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  dragging.value = true;
}

function onDragLeave() {
  dragging.value = false;
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  dragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) uploadFile(file);
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadFile(file);
  input.value = '';
}

async function uploadFile(file: File) {
  error.value = '';
  markdownLink.value = '';

  if (!ALLOWED_TYPES.includes(file.type)) {
    error.value = `Invalid file type. Accepted formats: ${ALLOWED_EXTENSIONS}`;
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    error.value = 'File is too large. Maximum size is 10MB.';
    return;
  }

  uploading.value = true;
  try {
    const token = await user.value!.getIdToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${backendUrl}/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail || `Upload failed (${res.status})`);
    }

    const data = await res.json();
    const name = file.name.replace(/\.[^.]+$/, '');
    markdownLink.value = `![${name}](${backendUrl}/${data.url})`;
  } catch (e: any) {
    error.value = e.message || 'Upload failed';
  } finally {
    uploading.value = false;
  }
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(markdownLink.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function uploadAnother() {
  markdownLink.value = '';
  error.value = '';
}
</script>

<template>
  <div class="image-upload">
    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <p class="state-text">Loading...</p>
    </div>

    <!-- Unauthorized -->
    <div v-else-if="unauthorized" class="state-box">
      <p class="state-text">You are not authorized to upload images.</p>
      <button class="btn btn-outline" @click="handleSignOut">Sign out</button>
    </div>

    <!-- Unauthenticated -->
    <div v-else-if="!user" class="state-box">
      <p class="state-text">Sign in to upload images.</p>
      <button class="btn btn-primary" @click="handleSignIn">
        Sign in with Google
      </button>
    </div>

    <!-- Authenticated -->
    <div v-else>
      <div class="upload-header">
        <span class="upload-label">// upload image</span>
        <button class="sign-out-btn" @click="handleSignOut">sign out</button>
      </div>

      <!-- Upload result -->
      <div v-if="markdownLink" class="result-box">
        <label class="result-label">Markdown link</label>
        <div class="result-row">
          <code class="result-code">{{ markdownLink }}</code>
          <button class="btn btn-primary btn-sm" @click="copyToClipboard">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <button class="btn btn-outline btn-sm upload-another" @click="uploadAnother">
          Upload another
        </button>
      </div>

      <!-- Drop zone -->
      <div
        v-else
        class="drop-zone"
        :class="{ dragging, uploading }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="($refs.fileInput as HTMLInputElement).click()"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.heic"
          hidden
          @change="onFileSelect"
        />
        <div v-if="uploading" class="drop-content">
          <p class="drop-text">Uploading...</p>
        </div>
        <div v-else class="drop-content">
          <p class="drop-text">
            Drag and drop an image here, or click to browse
          </p>
          <p class="drop-hint">
            Accepted formats: {{ ALLOWED_EXTENSIONS }} &middot; Max 10MB
          </p>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-box">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  width: 100%;
  max-width: 640px;
}

.state-box {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.state-text {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text);
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.upload-label {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.sign-out-btn {
  background: none;
  border: none;
  font-family: var(--font-mono);
  color: var(--color-primary);
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
}

.sign-out-btn:hover {
  text-decoration: underline;
}

.drop-zone {
  background: var(--color-surface);
  border: 2px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-3xl) var(--space-xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.drop-zone:hover,
.drop-zone.dragging {
  border-color: var(--color-primary);
  background: rgba(45, 138, 123, 0.04);
}

.drop-zone.uploading {
  pointer-events: none;
  opacity: 0.7;
}

.drop-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.drop-text {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.drop-hint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.result-box {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.result-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
}

.result-row {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.result-code {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  white-space: nowrap;
}

.upload-another {
  margin-top: var(--space-md);
}

.error-box {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: #991b1b;
  font-size: 0.875rem;
}
</style>
