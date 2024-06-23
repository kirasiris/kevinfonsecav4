"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthTokenOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("xAuthToken");
};

export const getUserStripeChargesEnabled = () => {
	const myCookies = cookies();
	return myCookies.get("userStripeChargesEnabled");
};

export const getUserIdOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("userId");
};

export const setAuthTokenOnServer = async (token) => {
	if (token) {
		console.log("setAuthTokenOnServer function was a success", token);
		cookies().set("xAuthToken", token, { secure: true });
	} else {
		console.log("setAuthTokenOnServer function was not a success", token);
		await deleteAuthTokenOnServer("xAuthToken");
	}
};

export const setUserStripeChargesEnabled = async (enabled) => {
	if (enabled) {
		console.log("userStripeChargesEnabled function was a success", enabled);
		cookies().set("userStripeChargesEnabled", enabled, { secure: true });
	} else {
		console.log("userStripeChargesEnabled function was not a success", enabled);
		await deleteAuthTokenOnServer("user");
	}
};

export const setUserIdOnServer = async (id) => {
	if (id) {
		console.log("setUserIdOnServer function was a success", id);
		cookies().set("userId", id, { secure: true });
	} else {
		console.log("setUserIdOnServer function was not a success", id);
		await deleteAuthTokenOnServer("userId");
	}
};

export const deleteAuthTokenOnServer = async (token) => {
	await fetchurl(`/auth/logout`, "GET", "no-cache");
	cookies().delete(token);
	cookies().delete("userId");
	cookies().delete("userStripeChargesEnabled");
	console.log("2.- Deleting cookie from back-end");
	redirect(`/auth/login`);
};

export const fetchurl = async (
	url = ``,
	method,
	cache = "default",
	bodyData,
	signal = undefined,
	multipart = false,
	isRemote = false
) => {
	const myCookies = cookies();
	const token = myCookies.get("xAuthToken");

	let requestBody = null;
	let customHeaders = {
		Authorization: `Bearer ${token?.value}`,
		"Content-Type": "application/json",
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

	if (multipart) {
		const data = new FormData();
		customHeaders[
			"Content-Type"
		] = `multipart/form-data; boundary=${data._boundary}`;
	}

	const response = await fetch(
		isRemote ? url : `http://localhost:5000/api/v1${url}`,
		{
			method: method,
			cache: cache,
			body: method !== "GET" && method !== "HEAD" ? requestBody : null,
			signal: signal,
			headers: customHeaders,
		}
	)
		.then(async (res) => {
			if (!res.ok) {
				// check if there was JSON
				const contentType = res.headers.get("Content-Type");
				if (contentType && contentType.includes("application/json")) {
					// return a rejected Promise that includes the JSON
					return res.json().then((json) => Promise.reject(json));
				}
				// no JSON, just throw an error
				throw new Error("Something went horribly wrong 💩");
			}
			return res.json();
		})
		.then((data) => data)
		.catch((err) => {
			console.log("Error from console.log in setTokenOnServer file xD", err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from setTokenOnServer file xD", err);
			}
			return err;
		});

	return response;
};
