"use client";
import axios from "axios";

const getCookie = (name) => {
	if (typeof window !== "undefined") {
		return document.cookie.split(";").some((c) => {
			return c.trim().startsWith(name + "=");
		});
	}
};

const deleteCookie = (name, path, domain) => {
	if (getCookie(name)) {
		document.cookie =
			name +
			"=" +
			(path ? ";path=" + path : "") +
			(domain ? ";domain=" + domain : "") +
			";expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
};

export const setAuthToken = (token) => {
	if (token) {
		console.log("Token gets to setAuthToken function", token);
		if (typeof window !== "undefined") {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			axios.defaults.headers["Authorization"] = `Bearer ${token}`;
			window?.localStorage.setItem("xAuthToken", token);
		}
	} else {
		console.log("Token does not gets to setAuthToken function", token);
		delete axios.defaults.headers.common["Authorization"];
		delete axios.defaults.headers["Authorization"];
		window?.localStorage.removeItem("xAuthToken");
		deleteCookie("xAuthToken", "/");
	}
};

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
