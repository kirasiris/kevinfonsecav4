export const capitalizeWordsInArray = (wordArray) => {
	return wordArray
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
		})
		.filter((char) => char.length !== 0);
};

export const calculateTimeSincePublished = (createdAt) => {
	const currentTime = new Date();
	const publishedTime = new Date(createdAt);
	const timeDifference = currentTime - publishedTime;

	const seconds = Math.floor(timeDifference / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else {
		return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
	}
};

export const currencyFormatter = (amount, currency) => {
	return ((amount * 100) / 100).toLocaleString(currency, {
		style: "currency",
		currency: currency,
	});
};

export const stripeCurrencyFormatter = (amount, currency) => {
	return (amount / 100).toLocaleString(currency, {
		style: "currency",
		currency: currency,
	});
};

export const formatDateWithoutTime = (createdAt) => {
	return new Date(createdAt).toLocaleDateString();
};

export const checkEmptyObject = (obj = {}) => {
	for (var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			return false;
		}
	}

	return true;
};

export const b64toBlob = (base64Data) => {
	const byteCharacters = Buffer.from(base64Data).toString("binary");
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray]);

	let file;
	if (blob instanceof Blob) {
		file = new File([blob], "file_name.jpg", { type: "image/jpeg" });
	}

	const url = URL.createObjectURL(blob);

	return { blob, file, url };
};
