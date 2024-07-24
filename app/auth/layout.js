import "@/src/css/global.css";
import "@/src/css/app.css";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`, "GET", "default");
	return res;
}

export default async function Layout({ children }) {
	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);

	return settings.data.maintenance === false ? children : <ErrorPage />;
}
