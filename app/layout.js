import Footer from "@/layout/footer";
import "./bootstrap.css";
// import "./bootstrap.js";
import "./global.css";
import "./app.css";
import Menu from "@/layout/menu";
import Head from "@/app/head";

async function getSetting(params) {
	const res = await fetch(`http://localhost:5000/api/v1/settings/${params}`, {
		cache: "no-store",
	});

	return res.json();
}

export default async function RootLayout({ children }) {
	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			{/* <head /> */}
			<Head
				title={settings.data.title}
				description={settings.data.text}
				favicon={settings.data.favicon}
				canonical={settings.data.site_url}
			/>
			<body>
				<Menu
					title={settings.data.title}
					logo={settings.data.logo}
					canonical={settings.data.site_url}
				/>
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
