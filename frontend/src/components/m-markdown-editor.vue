<template>
	<div class="m-markdown-editor">
		<div class="toolbar text-primary">
			<button type="button" @click="applyBold" title="Bold">B</button>
			<button type="button" @click="applyItalic" title="Italic">I</button>
			<button type="button" @click="applyHeader(1)" title="Header 1">H1</button>
			<button type="button" @click="applyHeader(2)" title="Header 2">H2</button>
			<button type="button" @click="applyHeader(3)" title="Header 3">H3</button>
			<button type="button" @click="applyLink" title="Link">Link</button>
			<button type="button" @click="applyImage" title="Image">Image</button>
			<button type="button" @click="applyBulletList" title="Bullet List">•</button>
			<button type="button" @click="applyNumberedList" title="Numbered List">1.</button>
			<button type="button" @click="applyCode" title="Code">Code</button>
			<button type="button" @click="applyCodeBlock" title="Code Block">```</button>
			<button type="button" @click="applyQuote" title="Quote">></button>
			<button type="button" @click="applyHorizontalRule" title="Horizontal Rule">—</button>
			<button type="button" @click="applySubscript" title="Subscript">Subscript</button>
			<button type="button" @click="togglePreview" :class="{ active: previewMode }">
				{{ previewMode ? 'Edit' : 'Preview' }}
			</button>
		</div>

		<div class="editor-container" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
			@drop.prevent="handleDrop">

			<div v-if="isDragging" class="drag-overlay">
				<div class="drop-message">Drop image to upload</div>
			</div>

			<textarea v-if="!previewMode" ref="editorRef" v-model="model" class="markdown-input"
				placeholder="Write your markdown here..."></textarea>
			<div v-else class="preview markdown-body" v-html="previewHtml"></div>

			<div v-if="isUploading" class="upload-overlay">
				<div class="upload-progress">Uploading image...</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import { ref, computed } from 'vue';

const model = defineModel({
	default: ''
});

const auth = getAuth();

// Editor state
const editorRef = ref<HTMLTextAreaElement | null>(null);
const previewMode = ref(false);
const isDragging = ref(false);
const isUploading = ref(false);

// Format functions
const insertFormatting = (prefix: string, suffix = '') => {
	const textarea = editorRef.value;
	if (!textarea) return;

	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);

	const beforeText = textarea.value.substring(0, start);
	const afterText = textarea.value.substring(end);

	model.value = beforeText + prefix + selectedText + suffix + afterText;

	// Reset selection to the formatted text
	setTimeout(() => {
		textarea.focus();
		textarea.setSelectionRange(
			start + prefix.length,
			start + prefix.length + selectedText.length
		);
	}, 0);
};

// Drag and drop functionality
const handleDragOver = (event: DragEvent) => {
	isDragging.value = true;
	event.dataTransfer!.dropEffect = 'copy';
};

const handleDragLeave = () => {
	isDragging.value = false;
};

const handleDrop = async (event: DragEvent) => {
	isDragging.value = false;

	const files = event.dataTransfer?.files;
	if (!files || files.length === 0) return;

	const file = files[0];

	// Check if file is an image
	if (!file.type.startsWith('image/')) {
		alert('Only image files are supported for drag and drop');
		return;
	}

	// Upload the image
	await uploadImage(file);
};

// Dummy upload function
const uploadImage = async (file: File) => {
	try {
		const user = auth.currentUser;
		if (!user) throw 403;
		const idToken = await getIdToken(user);

		isUploading.value = true;

		// Create form data
		const formData = new FormData();
		formData.append('file', file);

		const { data } = await axios.post(
			`${import.meta.env.VITE_APP_BACKEND_URL}/media?name=${encodeURIComponent(file.name)}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${idToken}`
				}
			}
		);

		const imageUrl = `${import.meta.env.VITE_APP_BACKEND_URL}/${data.url}`;

		// Insert the image markdown at current cursor position
		const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
		insertImageMarkdown(imageUrl, fileName);

		console.log('Image uploaded successfully!');
	} catch (error) {
		console.error('Error uploading image:', error);
		alert('Failed to upload image');
	} finally {
		isUploading.value = false;
	}
};

// Helper to insert image markdown at cursor position
const insertImageMarkdown = (imageUrl: string, altText: string) => {
	const markdown = `![${altText}](${imageUrl})`;

	if (previewMode.value) {
		// If in preview mode, just append to the end
		model.value += '\n' + markdown;
	} else {
		// If in edit mode, insert at cursor position
		const textarea = editorRef.value;
		if (!textarea) return;

		const cursorPos = textarea.selectionStart;
		const textBefore = model.value.substring(0, cursorPos);
		const textAfter = model.value.substring(cursorPos);

		model.value = textBefore + markdown + textAfter;

		// Reset cursor position after the inserted markdown
		setTimeout(() => {
			textarea.focus();
			const newPosition = cursorPos + markdown.length;
			textarea.setSelectionRange(newPosition, newPosition);
		}, 0);
	}
};

// Formatting helpers
const applyBold = () => insertFormatting('**', '**');
const applyItalic = () => insertFormatting('*', '*');
const applyHeader = (level: number) => insertFormatting('#'.repeat(level) + ' ');
const applyLink = () => insertFormatting('[', '](url)');
const applyImage = () => insertFormatting('![alt text](', ')');
const applyBulletList = () => insertFormatting('- ');
const applyNumberedList = () => insertFormatting('1. ');
const applyCode = () => insertFormatting('`', '`');
const applyCodeBlock = () => insertFormatting('```\n', '\n```');
const applyQuote = () => insertFormatting('> ');
const applyHorizontalRule = () => insertFormatting('---\n');
const applySubscript = () => insertFormatting('<sub>', '</sub>');

// Preview rendering
const renderMarkdown = (text: string) => {
	if (!text) return '';

	let html = text
		// Escape HTML tags
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

		// Headers
		.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
		.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
		.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
		.replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
		.replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
		.replace(/^###### (.*?)$/gm, '<h6>$1</h6>')

		// Bold and Italic
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>')

		// Links and Images
		.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
		.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')

		// Code
		.replace(/`(.*?)`/g, '<code>$1</code>')

		// Lists
		.replace(/^- (.*?)$/gm, '<li>$1</li>')
		.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')

		// Block quotes and Horizontal rule
		.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
		.replace(/^---$/gm, '<hr>')

		// Line breaks
		.replace(/\n/g, '<br>');

	// Handle lists properly
	html = html.replace(/(<li>.*?<\/li>)\s*<br>(<li>.*?<\/li>)/g, '$1$2');
	html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

	return html;
};

const previewHtml = computed(() => renderMarkdown(model.value));

// Toggle between editor and preview
const togglePreview = () => {
	previewMode.value = !previewMode.value;
};
</script>

<style scoped>
.m-markdown-editor {
	border: 1px solid #ddd;
	border-radius: 4px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 300px;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	padding: 8px;
	background-color: #f5f5f5;
	border-bottom: 1px solid #ddd;
}

.toolbar button {
	margin: 0 4px;
	padding: 4px 8px;
	background-color: white;
	border: 1px solid #ddd;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
}

.toolbar button:hover {
	background-color: #f0f0f0;
}

.toolbar button.active {
	background-color: #e0e0e0;
}

.editor-container {
	flex-grow: 1;
	position: relative;
}

.markdown-input {
	width: 100%;
	height: 100%;
	min-height: 200px;
	padding: 12px;
	box-sizing: border-box;
	font-family: monospace;
	resize: none;
	border: none;
	outline: none;
	font-size: 14px;
	line-height: 1.5;
}

.preview {
	width: 100%;
	height: 100%;
	overflow-y: auto;
	padding: 12px;
	box-sizing: border-box;
	font-size: 14px;
	line-height: 1.5;
}

/* Drag and drop styles */
.drag-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: -10;
}

.drop-message {
	background-color: white;
	padding: 20px;
	border-radius: 4px;
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

.upload-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.upload-progress {
	padding: 20px;
	border-radius: 4px;
	font-size: 16px;
	font-weight: bold;
	color: #333;
}
</style>