const SIZE_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
const K = 1024;
const LOG_K = Math.log(K);

export function formatFileSize(bytes, decimals = 2) {
	const num = Number(bytes);
	if (!Number.isFinite(num)) return "Unknown size";
	if (num <= 0) return "0 Bytes";
	if (num < K) return `${num} Bytes`;

	const dm = decimals < 0 ? 0 : decimals;
	const i = Math.min(Math.floor(Math.log(num) / LOG_K), SIZE_UNITS.length - 1);
	const value = num / Math.pow(K, i);
	return `${parseFloat(value.toFixed(dm))} ${SIZE_UNITS[i]}`;
}
