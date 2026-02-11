import "@/src/css/bootstrap.css";
// import "@/src/js/bootstrap.js";
import "@/src/css/global.css";
import "@/src/css/app.css";
import Head from "@/app/head";
import Menu from "@/layout/menu";
import Footer from "@/layout/footer";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "default");
	return res;
}

async function getSetting(params) {
	const res = await fetchurl(`/global/settings/${params}`, "GET", "default");
	return res;
}

async function getMenus(params) {
	const res = await fetchurl(`/global/pages${params}`, "GET", "default");
	return res;
}

export default async function RootLayout({ children }) {
	const auth = await getAuthenticatedUser();
	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);
	const menus = await getMenus(`?page=1&status=published`);

	return (
		<html lang="en">
			{/* <head>
				<Head
					title={settings?.data?.title}
					description={settings?.data?.text}
					favicon={settings?.data?.favicon}
				/>
			</head> */}
			<body>
				<Menu
					auth={auth}
					title={settings?.data?.title}
					logo={settings?.data?.logo}
					canonical={process.env.NEXT_PUBLIC_WEBSITE_URL}
					menus={menus?.data}
				/>
				<main>{children}</main>
				<Footer
					canonical={process.env.NEXT_PUBLIC_WEBSITE_URL}
					menus={menus?.data}
				/>
			</body>
		</html>
	);
}
