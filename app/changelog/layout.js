import "../bootstrap.css";
// import "../bootstrap.js";
import "../global.css";
import "../app.css";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`, "GET", "no-cache");

	return res;
}

export default async function Layout({ children }) {
	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	return settings.data.maintenance === false ? children : <ErrorPage />;
}
