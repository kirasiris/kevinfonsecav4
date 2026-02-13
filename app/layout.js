import "@/src/css/bootstrap.css";
// import "@/src/js/bootstrap.js";
import "@/src/css/global.css";
import "@/src/css/app.css";
import Menu from "@/layout/menu";
import Footer from "@/layout/footer";
import { getGlobalData } from "@/helpers/globalData";

export default async function RootLayout({ children }) {
	const { auth, settings, menus } = await getGlobalData();

	return (
		<html lang="en">
			{/* HEAD SHOULD NEVER BE WITHIN LAYOUT FILE AS IT WILL ALWAYS TRY TO FETCH INFORMATION FROM ITSELF UNLESS CHILD PAGES USE THEIR OWN LAYOUT FILES WHICH ARE NOT BEING USED */}
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
