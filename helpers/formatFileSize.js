/**
 * Convert a byte count into a human-readable file size string.
 * Supports Bytes, KB, MB, GB, TB, PB.
 *
 * @param {number} bytes - The file size in bytes
 * @param {number} [decimals=2] - Number of decimal places to show
 * @returns {string} - The formatted file size (e.g. "1.23 MB")
 */
const SIZE_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
const K = 1024;
const LOG_K = Math.log(K);

export function formatFileSize(bytes, decimals = 2) {
	const num = Number(bytes);
	if (!Number.isFinite(num)) return "Unknown size";
	if (num <= 0) return "0 Bytes";
	// Short-circuit the common sub-KB case so we skip the log calculation.
	if (num < K) return `${num} Bytes`;

	const dm = decimals < 0 ? 0 : decimals;
	const i = Math.min(Math.floor(Math.log(num) / LOG_K), SIZE_UNITS.length - 1);
	const value = num / Math.pow(K, i);
	return `${parseFloat(value.toFixed(dm))} ${SIZE_UNITS[i]}`;
}
