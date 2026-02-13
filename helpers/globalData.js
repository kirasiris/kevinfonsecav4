// helpers/globalData.js
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "default");
	return res;
}

async function getSetting(params) {
	const res = await fetchurl(
		`/global/settings/${params}`,
		"GET",
		"force-cache",
	);
	return res;
}

async function getMenus(params) {
	const res = await fetchurl(`/global/pages${params}`, "GET", "force-cache");
	return res;
}

export async function getGlobalData() {
	const auth = await getAuthenticatedUser();
	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);
	const menus = await getMenus(`?page=1&status=published`);

	return { auth, settings, menus };
}
