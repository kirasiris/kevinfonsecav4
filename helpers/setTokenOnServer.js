"use server";
import { cookies } from "next/headers";

export const getAuthTokenOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("xAuthToken");
};

export const deleteAuthTokenOnServer = async (token) => {
	await fetch(`http://localhost:5000/api/v1/auth/logout`, { method: "GET" });
	cookies().delete(token);
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

export const fetchurl = async (url, method, bodyData) => {
	const myCookies = cookies();
	const token = myCookies.get("xAuthToken");

	const data = await fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token?.value}`,
		},
		body: JSON.stringify(bodyData),
	});

	return data;
};
