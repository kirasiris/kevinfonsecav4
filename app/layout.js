import "./bootstrap.css";
// import "./bootstrap.js";
import "./global.css";
import "./app.css";
import Head from "@/app/head";
import Menu from "@/layout/menu";
import Footer from "@/layout/footer";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`, "GET", "no-cache");
	return res;
}

export default async function RootLayout({ children }) {
	const auth = await getAuthenticatedUser();
	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	return (
		<html lang="en">
			<Head
				auth={auth}
				title={settings.data.title}
				description={settings.data.text}
				favicon={settings.data.favicon}
				canonical={settings.data.site_url}
			/>
			<body>
				<Menu
					auth={auth}
					title={settings.data.title}
					logo={settings.data.logo}
					canonical={settings.data.site_url}
				/>
				<main>{children}</main>
				<Footer auth={auth} />
			</body>
		</html>
	);
}
