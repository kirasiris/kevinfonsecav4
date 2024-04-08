"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthTokenOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("xAuthToken");
};

export const setAuthTokenOnServer = async (token) => {
	if (token) {
		console.log("Token gets to setAuthTokenOnServer function", token);
		cookies().set("xAuthToken", token, { secure: true });
	} else {
		console.log("Token does not gets to setAuthTokenOnServer function", token);
		await deleteAuthTokenOnServer("xAuthToken");
	}
};

export const fetchurl = async (
	url = `http://localhost:5000/api/v1`,
	method,
	cache = "default",
	bodyData,
	signal = undefined,
	multipart = false
) => {
	const myCookies = cookies();
	const token = myCookies.get("xAuthToken");

	let requestBody = null;
	let customHeaders = {
		Authorization: `Bearer ${token?.value}`,
	};

	if (
		bodyData &&
		typeof bodyData === "object" &&
		!Array.isArray(bodyData) &&
		bodyData !== null &&
		!multipart
	) {
		// Check if bodyData is a plain object before stringifying
		requestBody = JSON.stringify(bodyData);
	}

	if (!multipart) {
		customHeaders["Content-Type"] = "application/json";
	}

	const response = await fetch(`http://localhost:5000/api/v1${url}`, {
		method: method,
		headers: customHeaders,
		body: method !== "GET" && method !== "HEAD" ? requestBody : null,
		cache: cache,
		signal: signal,
	})
		.then(async (res) => await res.json())
		.then((response) => response)
		.catch((err) => {
			console.log(err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from setTokenOnServer file", err);
			}
		});

	return response;
};

export const deleteAuthTokenOnServer = async (token, userId) => {
	await fetchurl(`/auth/logout`, "GET", "no-cache");
	cookies().delete(token);
	console.log("2.- Deleting cookie from back-end");
	redirect(`/auth/login`);
};
