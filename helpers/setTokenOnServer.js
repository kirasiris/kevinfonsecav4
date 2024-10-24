"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthTokenOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("xAuthToken");
};

export const getUserOnServer = () => {
	const myCookies = cookies();

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
		// One day equals to...
		const daysInTime = 24 * 60 * 60 * 1000;
		console.log("setAuthTokenOnServer function was a success", token);
		cookies().set("xAuthToken", token, {
			secure: true,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
			sameSite: "lax",
		});
	} else {
		console.log("setAuthTokenOnServer function was not a success", token);
		await deleteAuthTokenOnServer();
	}
};

export const setUserOnServer = async (object) => {
	if (object) {
		// One day equals to...
		const daysInTime = 24 * 60 * 60 * 1000;
		cookies().set(
			"userStripeChargesEnabled",
			object?.stripe?.stripeChargesEnabled,
			{
				secure: true,
				maxAge: new Date(
					Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
				),
			}
		);
		cookies().set("userId", object?._id, {
			secure: true,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
		cookies().set("username", object?.username, {
			secure: true,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
		cookies().set("email", object?.email, {
			secure: true,
			maxAge: new Date(
				Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRE * daysInTime
			),
		});
		cookies().set("avatar", object?.files?.avatar?.location?.secure_location, {
			secure: true,
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
	await fetchurl(`/auth/logout`, "GET", "no-cache");
	cookies().delete("xAuthToken");
	cookies().delete("userStripeChargesEnabled");
	cookies().delete("userId");
	cookies().delete("username");
	cookies().delete("email");
	cookies().delete("avatar");
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

	const response = await fetch(
		isRemote ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`,
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
