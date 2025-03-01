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

		<div class="editor-container">
			<textarea v-if="!previewMode" ref="editorRef" v-model="model" class="markdown-input"
				placeholder="Write your markdown here..."></textarea>
			<div v-else class="preview markdown-body" v-html="previewHtml"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const model = defineModel({
	default: ''
});

// Editor state
const editorRef = ref<HTMLTextAreaElement | null>(null);
const previewMode = ref(false);

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
</style>