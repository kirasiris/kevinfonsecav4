import "../bootstrap.css";
// import "../bootstrap.js";
import "../global.css";
import "../app.css";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getSetting(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/settings/${params}`);

	return res.json();
}

export default async function Layout({ children }) {
	const auth = await getAuthenticatedUser();
	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	return settings.data.maintenance === false ? children : <ErrorPage />;
}
