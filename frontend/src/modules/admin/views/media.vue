<template>
	<div class="media-upload-container">
		<h1 class="text-white">Media Upload</h1>
		<p class="text-white">Link: {{ uploadedUrl }}</p>

		<form @submit.prevent="handleSubmit" class="upload-form">
			<div class="form-group">
				<label for="title">Title</label>
				<input type="text" id="title" v-model="media.title" class="form-control" required />
			</div>

			<div class="form-group">
				<label for="description">Description</label>
				<textarea id="description" v-model="media.description" class="form-control" rows="3"></textarea>
			</div>

			<div class="form-group">
				<label for="file">Media File</label>
				<input type="file" id="file" ref="fileInput" @change="handleFileChange" class="form-control"
					:accept="acceptedFileTypes" required />
				<div v-if="fileError" class="error-message">{{ fileError }}</div>
				<div v-if="filePreview" class="file-preview">
					<img v-if="isImage" :src="filePreview" alt="Preview" />
					<video v-else-if="isVideo" controls :src="filePreview"></video>
				</div>
			</div>

			<div class="form-actions">
				<button type="submit" class="btn btn-primary" :disabled="isUploading">
					{{ isUploading ? 'Uploading...' : 'Upload Media' }}
				</button>
				<button type="button" class="btn btn-secondary" @click="resetForm">Cancel</button>
			</div>

			<div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress">
				<div class="progress-bar" :style="`width: ${uploadProgress}%`">
					{{ uploadProgress }}%
				</div>
			</div>

			<div v-if="successMessage" class="success-message">{{ successMessage }}</div>
			<div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, reactive, computed } from 'vue';
import { getIdToken, getAuth } from "firebase/auth";

interface MediaForm {
	title: string;
	description: string;
	file: File | null;
}

const media = reactive<MediaForm>({
	title: '',
	description: '',
	file: null
});

const auth = getAuth();

const uploadedUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const filePreview = ref<string | null>(null);
const fileError = ref<string | null>(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const acceptedFileTypes = '.jpg,.jpeg,.png,.gif,.mp4,.webm,.avi';

const isImage = computed(() => {
	return media.file?.type.startsWith('image/') || false;
});

const isVideo = computed(() => {
	return media.file?.type.startsWith('video/') || false;
});

const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const files = target.files;

	if (files && files.length > 0) {
		const file = files[0];

		// Validate file type
		if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
			fileError.value = 'Please select an image or video file';
			media.file = null;
			filePreview.value = null;
			return;
		}

		// Validate file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			fileError.value = 'File size should not exceed 10MB';
			media.file = null;
			filePreview.value = null;
			return;
		}

		media.file = file;
		fileError.value = null;

		// Generate preview
		const reader = new FileReader();
		reader.onload = (e) => {
			filePreview.value = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	} else {
		media.file = null;
		filePreview.value = null;
	}
};

const handleSubmit = async () => {
	if (!media.file) {
		fileError.value = 'Please select a file to upload';
		return;
	}

	try {
		isUploading.value = true;
		errorMessage.value = null;
		successMessage.value = null;



		// Create form data
		const formData = new FormData();
		formData.append('file', media.file);
		formData.append('title', media.title);

		// Simulate upload with progress
		// Replace this with your actual API call
		await upload(formData);

		successMessage.value = 'Media uploaded successfully!';
		resetForm();
	} catch (error) {
		errorMessage.value = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
	} finally {
		isUploading.value = false;
	}
};

const upload = async (formData: FormData): Promise<void> => {
	// Replace this function with your actual API call
	return new Promise(async (resolve, reject) => {
		const user = auth.currentUser;
		if (!user) return; // TODO: Throw error

		const idToken = await getIdToken(user);
		try {
			const { data } = await axios.post(
				`http://127.0.0.1:8000/media?name=${encodeURIComponent(media.title)}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': `Bearer ${idToken}`
					},
					onUploadProgress: (progressEvent) => {
						if (progressEvent.total) {
							// Calculate the progress percentage
							const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
							uploadProgress.value = percentCompleted;
						}
					}
				}
			);
			uploadedUrl.value = data.url;
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

const resetForm = () => {
	media.title = '';
	media.description = '';
	media.file = null;
	filePreview.value = null;
	fileError.value = null;
	uploadProgress.value = 0;

	if (fileInput.value) {
		fileInput.value.value = '';
	}
};
</script>

<style scoped>
.media-upload-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.upload-form {
	background-color: #f8f9fa;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
	margin-bottom: 20px;
}

label {
	display: block;
	margin-bottom: 5px;
	font-weight: bold;
}

.form-control {
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #ced4da;
	border-radius: 4px;
}

.form-actions {
	display: flex;
	gap: 10px;
	margin-bottom: 15px;
}

.btn {
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	border: none;
}

.btn-primary {
	background-color: #007bff;
	color: white;
}

.btn-secondary {
	background-color: #6c757d;
	color: white;
}

.btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.file-preview {
	margin-top: 10px;
	max-width: 100%;
}

.file-preview img,
.file-preview video {
	max-width: 100%;
	max-height: 300px;
	border: 1px solid #ddd;
	border-radius: 4px;
}

.progress {
	height: 20px;
	background-color: #e9ecef;
	border-radius: 4px;
	margin: 15px 0;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background-color: #007bff;
	color: white;
	text-align: center;
	line-height: 20px;
	transition: width 0.2s;
}

.error-message {
	color: #dc3545;
	margin-top: 5px;
}

.success-message {
	color: #28a745;
	margin-top: 15px;
}
</style>