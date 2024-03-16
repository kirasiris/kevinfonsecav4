"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthTokenOnServer = () => {
	const myCookies = cookies();
	return myCookies.get("xAuthToken");
};

export const deleteAuthTokenOnServer = async (token) => {
	await fetchurl(`http://localhost:5000/api/v1/auth/logout`, "GET");
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
	bodyData
) => {
	const myCookies = cookies();
	const token = myCookies.get("xAuthToken");

	const data = await fetch(`http://localhost:5000/api/v1${url}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token?.value}`,
		},
		body: JSON.stringify(bodyData),
		cache: cache,
	});

	return data;
};
