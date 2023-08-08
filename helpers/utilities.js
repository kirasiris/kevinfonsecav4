"use client";
import axios from "axios";
// import { useEffect, useState } from "react";

// export const useScript = (
// 	name = ``,
// 	url = ``,
// 	origin = ``,
// 	position = `head`,
// 	async = false
// ) => {
// 	const [lib, setLib] = useState({});
// 	useEffect(() => {
// 		const placement = document.querySelector(position);
// 		const script = document.createElement("script");

// 		script.src = url;
// 		script.referrerPolicy = origin;
// 		script.async = typeof async === "undefined" ? true : async;
// 		script.onload = () => setLib({ [name]: window[name] });

// 		placement.appendChild(script);

// 		return () => {
// 			placement.removeChild(script);
// 		};
// 	}, [url]);
// 	return lib;
// };

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
