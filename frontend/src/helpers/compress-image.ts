/**
 * Helper module for compressing images while maintaining reasonable quality.
 */

/**
 * Options for image compression
 */
interface CompressOptions {
	maxWidth?: number;      // Maximum width of the output image
	maxHeight?: number;     // Maximum height of the output image
	quality?: number;       // Quality of compression (0-1), default: 0.8
	type?: string;          // Output file type, default: image/jpeg
	maxSizeKB?: number;     // Target file size in KB (will try to reach this size)
}

/**
 * Compresses an image file while trying to maintain quality
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns A promise resolving to the compressed image file
 */
export async function compressImage(
	file: File,
	options: CompressOptions = {}
): Promise<File> {
	// Set default options
	const {
		maxWidth = 1920,
		maxHeight = 1080,
		quality = 0.8,
		type = 'image/jpeg',
		maxSizeKB
	} = options;

	// Create image from file
	const image = await createImageFromFile(file);

	// Calculate dimensions while preserving aspect ratio
	const { width, height } = calculateDimensions(
		image.width,
		image.height,
		maxWidth,
		maxHeight
	);

	// Create canvas and draw image
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Could not get canvas context');
	}

	// Draw image on canvas
	ctx.drawImage(image, 0, 0, width, height);

	// If target size specified, use adaptive compression
	if (maxSizeKB) {
		return compressToTargetSize(canvas, file.name, type, maxSizeKB);
	}

	// Get compressed data URL
	const dataUrl = canvas.toDataURL(type, quality);

	// Convert data URL to blob
	const blob = dataURItoBlob(dataUrl);

	// Return new file
	return new File([blob], file.name, {
		type: blob.type,
	});
}

/**
 * Creates an HTMLImageElement from a file
 */
function createImageFromFile(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = URL.createObjectURL(file);
	});
}

/**
 * Calculates new dimensions while preserving aspect ratio
 */
function calculateDimensions(
	width: number,
	height: number,
	maxWidth: number,
	maxHeight: number
): { width: number; height: number } {
	let newWidth = width;
	let newHeight = height;

	// Scale down if necessary
	if (width > maxWidth) {
		newWidth = maxWidth;
		newHeight = (height * maxWidth) / width;
	}

	if (newHeight > maxHeight) {
		newHeight = maxHeight;
		newWidth = (width * maxHeight) / height;
	}

	return { width: Math.floor(newWidth), height: Math.floor(newHeight) };
}

/**
 * Converts data URI to Blob
 */
function dataURItoBlob(dataURI: string): Blob {
	// Convert base64 to raw binary data held in a string
	const byteString = atob(dataURI.split(',')[1]);

	// Get MIME type
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// Create ArrayBuffer and write bytes
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const intArray = new Uint8Array(arrayBuffer);

	for (let i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i);
	}

	return new Blob([arrayBuffer], { type: mimeString });
}

/**
 * Compresses image to reach target file size (with a reasonable precision)
 */
async function compressToTargetSize(
	canvas: HTMLCanvasElement,
	fileName: string,
	type: string,
	maxSizeKB: number
): Promise<File> {
	// Binary search to find optimal quality
	let minQuality = 0.1;
	let maxQuality = 1.0;
	let quality = 0.7; // Starting point
	let blob: Blob;
	const maxSizeBytes = maxSizeKB * 1024;

	// Try up to 6 iterations (should be enough for reasonable precision)
	for (let i = 0; i < 6; i++) {
		const dataUrl = canvas.toDataURL(type, quality);
		blob = dataURItoBlob(dataUrl);

		// Break if we're close enough to target size
		if (Math.abs(blob.size - maxSizeBytes) < maxSizeBytes * 0.05) {
			break;
		}

		// Adjust quality based on current size
		if (blob.size > maxSizeBytes) {
			maxQuality = quality;
			quality = (minQuality + quality) / 2;
		} else {
			minQuality = quality;
			quality = (maxQuality + quality) / 2;
		}
	}

	// Use final quality to create file
	const dataUrl = canvas.toDataURL(type, quality);
	blob = dataURItoBlob(dataUrl);

	return new File([blob], fileName, { type });
}