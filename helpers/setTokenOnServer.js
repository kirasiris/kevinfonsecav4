"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthTokenOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("xAuthToken");
};

export const deleteAuthTokenOnServer = async (token) => {
	await fetchurl(`/auth/logout`, "GET");
	cookies().delete(token);
	console.log("2.- Deleting cookie from back-end");
	redirect(`/auth/login`);
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
	signal = undefined
) => {
	const myCookies = cookies();
	const token = myCookies.get("xAuthToken");

	let requestBody = null;
	if (
		bodyData &&
		typeof bodyData === "object" &&
		!Array.isArray(bodyData) &&
		bodyData !== null
	) {
		// Check if bodyData is a plain object before stringifying
		requestBody = JSON.stringify(bodyData);
	}

	const response = await fetch(`http://localhost:5000/api/v1${url}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token?.value}`,
		},
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
