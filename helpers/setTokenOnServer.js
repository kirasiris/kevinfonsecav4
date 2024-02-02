"use server";
import { cookies } from "next/headers";

export const deleteAuthTokenOnServer = (token) => {
	cookies().delete(token);
};

export const setAuthTokenOnServer = (token) => {
	if (token) {
		console.log("Token gets to setAuthTokenOnServer function", token);
		cookies().set("xAuthToken", token, { secure: true });
	} else {
		console.log("Token does not gets to setAuthTokenOnServer function", token);
		deleteAuthTokenOnServer("xAuthToken");
	}
};

export const fetchurl = async (url, method, bodyData) => {
	const myCookies = cookies();
	const token = myCookies.get("xAuthToken");

	const data = await fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
		body: JSON.stringify(bodyData),
	});

	return data;
};
