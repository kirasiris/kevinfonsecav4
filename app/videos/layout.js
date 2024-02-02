import "../bootstrap.css";
// import "../bootstrap.js";
import "../global.css";
import "../app.css";
import ErrorPage from "@/layout/errorpage";

async function getSetting(params) {
	const res = await fetch(`http://localhost:5000/api/v1/settings/${params}`, {
		cache: "no-store",
	});

	return res.json();
}

export default async function Layout({ children }) {
	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	return settings.data.maintenance === false ? (
		<>{children}</>
	) : (
		<>
			<ErrorPage />
		</>
	);
}
