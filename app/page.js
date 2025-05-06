import Link from "next/link";
import Header from "@/layout/header";
import SingleBlog from "@/components/blog/single";
import SingleTheme from "@/components/theme/single";
import NewsletterForm from "@/components/global/newsletter";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Head from "@/app/head";

async function getSetting(params) {
	const res = await fetchurl(`/global/settings/${params}`, "GET", "no-cache");
	return res;
}

async function getBlogs(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "no-cache");
	return res;
}

async function getThemes(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "no-cache");
	return res;
}

const HomeIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 6;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=blog&status=published`
	);

	const getThemesData = getThemes(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=theme&status=published`
	);

	const [blogs, themes] = await Promise.all([getBlogsData, getThemesData]);

	return settings.data?.maintenance === false ? (
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
				title={settings.data.title}
				description={settings.data.text}
				headerClasses="d-flex flex-column vh-100 vw-100"
				headerContainerClasses="m-auto"
				headerStyle={{
					backgroundAttachment: "fixed !important",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover !important",
					backgroundPosition: "50% 50%",
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						settings.data.showcase_image ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					}) no-repeat center center`,
				}}
			/>
			{/* CALL TO ACTION - NEWSLETTER REGISTRATION BY EMAIL */}
			<NewsletterForm
				sectionClassList="border-bottom py-5"
				headingClassList="my-5"
			/>
			{/* BLOGS */}
			{blogs?.data?.length > 0 && (
				<section id="blogs" className="border-bottom py-5">
					<div className="container">
						<h2 className="page-section-heading display-5 text-uppercase text-secondary my-5">
							<Link href={`/blog`}>Latest Blogs</Link>
						</h2>
						<div className="row">
							{blogs.data.map((blog) => (
								<SingleBlog
									key={blog._id}
									object={blog}
									imageWidth={`415`}
									imageHeight={`207`}
								/>
							))}
						</div>
					</div>
				</section>
			)}
			{/* THEMES */}
			{themes?.data?.length > 0 && (
				<section id="themes" className="py-5" style={{ marginBottom: "-24px" }}>
					<div className="container">
						<h2 className="page-section-heading display-5 text-uppercase text-secondary my-5">
							<Link href={`/theme`}>Latest Themes</Link>
						</h2>
						<div className="row">
							{themes.data.map((theme) => (
								<SingleTheme key={theme._id} object={theme} />
							))}
						</div>
					</div>
				</section>
			)}
		</>
	) : (
		<ErrorPage />
	);
};

export default HomeIndex;
