import Link from "next/link";
import Header from "@/layout/header";
import NewsletterForm from "@/components/global/newsletter";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Head from "@/app/head";

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`, "GET", "no-cache");
	return res;
}

const APIIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);

	return settings.data.maintenance === false ? (
		<>
			<Head
				title={settings.data.title}
				description={settings.data.text}
				favicon={settings.data.favicon}
				postImage={settings.data.showcase_image}
				imageWidth="800"
				imageHeight="450"
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url="/"
				author={settings.data.author}
				createdAt={settings.data.createdAt}
				updatedAt={settings.data.updatedAt}
				locales=""
				posType="website"
			/>
			<Header
				title={`${settings.data.title} API`}
				description="Learn how to programatically communicate with my DB!"
			/>
		</>
	) : (
		<ErrorPage />
	);
};

export default APIIndex;
