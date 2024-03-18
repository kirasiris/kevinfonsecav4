import { AuthProvider } from "@/helpers/globalContext";
import "../global.css";
import "../app.css";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`);
	return res.json();
}

export default async function Layout({ children }) {
	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	return settings.data.maintenance === false ? (
		<AuthProvider>{children}</AuthProvider>
	) : (
		<ErrorPage />
	);
}
