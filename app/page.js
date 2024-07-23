import Link from "next/link";
import Header from "@/layout/header";
import SingleBlog from "@/components/blog/single";
import SingleTheme from "@/components/theme/single";
import NewsletterForm from "@/components/global/newsletter";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`, "GET", "no-cache");
	return res;
}

async function getBlogs(params) {
	const res = await fetchurl(`/blogs${params}`, "GET", "no-cache");
	return res;
}

async function getThemes(params) {
	const res = await fetchurl(`/themes${params}`, "GET", "no-cache");
	return res;
}

const HomeIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const settings = await getSetting(`6519d7b34d26360354527e9a`);

	const getBlogsData = getBlogs(
		`?page=${sort}&limit=6&sort=${sort}&postType=blog&status=published`
	);

	const getThemesData = getThemes(
		`?page=${sort}&limit=3&sort=${sort}&postType=theme&status=published`
	);

	const [blogs, themes] = await Promise.all([getBlogsData, getThemesData]);

	return settings.data.maintenance === false ? (
		<>
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
								<SingleTheme key={theme._id} theme={theme} />
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
