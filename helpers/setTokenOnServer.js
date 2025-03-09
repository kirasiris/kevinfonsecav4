"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthTokenOnServer = async () => {
	const myCookies = await cookies();
	return myCookies.get("xAuthToken");
};

export const getUserOnServer = async () => {
	const myCookies = await cookies();

	const cookiesReturned = {
		userStripeChargesEnabled: myCookies.get("userStripeChargesEnabled")?.value,
		userId: myCookies.get("userId")?.value,
		username: myCookies.get("username")?.value,
		email: myCookies.get("email")?.value,
		avatar: myCookies.get("avatar")?.value,
	};
	return cookiesReturned;
};

export const setAuthTokenOnServer = async (token) => {
	if (token) {
		const myCookies = await cookies();
		// One day equals to...
		const daysInTime = 24 * 60 * 60 * 1000;
		console.log("setAuthTokenOnServer function was a success", token);
		myCookies.set("xAuthToken", token, {
			secure: process.env.NEXT_PUBLIC_API_ENV === "production" ? true : false,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
			sameSite:
				process.env.NEXT_PUBLIC_API_ENV === "production" ? "none" : "lax",
		});
	} else {
		console.log("setAuthTokenOnServer function was not a success", token);
		await deleteAuthTokenOnServer();
	}
};

export const setUserOnServer = async (object) => {
	if (object) {
		const myCookies = await cookies();
		// One day equals to...
		const daysInTime = 24 * 60 * 60 * 1000;
		myCookies.set(
			"userStripeChargesEnabled",
			object?.stripe?.stripeChargesEnabled,
			{
				secure: process.env.NEXT_PUBLIC_API_ENV === "production" ? true : false,
				maxAge: new Date(
					Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
				),
			}
		);
		myCookies.set("userId", object?._id, {
			secure: process.env.NEXT_PUBLIC_API_ENV === "production" ? true : false,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
		myCookies.set("username", object?.username, {
			secure: process.env.NEXT_PUBLIC_API_ENV === "production" ? true : false,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
		myCookies.set("email", object?.email, {
			secure: process.env.NEXT_PUBLIC_API_ENV === "production" ? true : false,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
		myCookies.set("avatar", object?.files?.avatar?.location?.secure_location, {
			secure: process.env.NEXT_PUBLIC_API_ENV === "production" ? true : false,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
	} else {
		console.log("setUserOnServer function was not a success", object);
		await deleteAuthTokenOnServer();
	}
};

export const deleteAuthTokenOnServer = async () => {
	const myCookies = await cookies();
	await fetchurl(`/auth/logout`, "POST", "no-cache");
	myCookies.delete("xAuthToken");
	myCookies.delete("userStripeChargesEnabled");
	myCookies.delete("userId");
	myCookies.delete("username");
	myCookies.delete("email");
	myCookies.delete("avatar");
	console.log("2.- Deleting cookie from back-end");
	redirect(`/auth/login`);
};

export const fetchurl = async (
	url = ``,
	method,
	cache = "default",
	bodyData,
	signal = undefined || null || {},
	multipart = false,
	isRemote = false
) => {
	const myCookies = await cookies();
	const token = myCookies.get("xAuthToken");

	let requestBody = null;
	let customHeaders = {
		Authorization: `Bearer ${token?.value}`,
		"Content-Type": "application/json",
		credentials: "include",
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

	// If no signal is provided, create a new AbortController signal
	if (signal !== undefined && signal !== null && signal !== ``) {
		const controller = new AbortController();
		signal = controller.signal;
	}

	const response = await fetch(
		isRemote ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`,
		{
			method: method,
			cache: cache,
			body: method !== "GET" && method !== "HEAD" ? requestBody : null,
			signal: signal,
			headers: customHeaders,
			redirect: "manual",
		}
	)
		.then(async (res) => {
			// Might need to delete
			if (res.status === 303) {
				const redirectUrl = res.headers.get("Location");
				return fetch(redirectUrl, { method, headers: customHeaders });
			}
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
		.catch((err) => {
			console.log("Error from console.log in fetchurl file xD", err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from fetchurl file xD", err);
			}
			return err;
		});

	return response;
};
