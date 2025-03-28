export const imagerowExtension = {
	extensions: [
		{
			name: "imagerow",
			level: "block",
			start(src: string) {
				return src.match(/^!imagerow\{/)?.index;
			},
			tokenizer(src: string) {
				const match = src.match(/^!imagerow\{([\s\S]*?)\}/); // Using [\s\S] to also match newlines
				if (match) {
					return {
						type: "imagerow",
						raw: match[0],
						images: match[1].trim(), // Trim to remove extra whitespace
					};
				}
				return undefined;
			},
			renderer(token: { images: string; }) {
				const images = extractImagesFromMarkdown(token.images);
				console.log(images);


				return `<div class="image-row">${images.map(img => `<img src="${img.url}" alt="${img.alt}">`).join("")}</div>`;
			},
		},
	],
};


function extractImagesFromMarkdown(markdown: string) {
	const split = markdown.split(',');

	const images: { url: string; alt: string }[] = [];

	for (const item of split) {
		const trimmed = item.trim();

		// Match the markdown image syntax: [alt text](url)
		const match = trimmed.match(/\[(.*?)\]\((.*?)\)/);

		if (match) {
			images.push({
				alt: match[1],
				url: match[2]
			});
		}
	}

	return images;
}