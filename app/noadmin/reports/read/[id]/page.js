import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Link from "next/link";

async function getReport(params) {
	const res = await fetchurl(`/reports${params}`, "GET", "no-cache");
	return res;
}

const ReadReport = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const report = await getReport(`/${awtdParams.id}`);

	const blogLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/blog/${report?.data?.resourceId?._id}/${report?.data?.resourceId?.category?._id}/${report?.data?.resourceId?.category?.slug}/${report?.data?.resourceId?.slug}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	const secretLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/secret/${report?.data?.resourceId?._id}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	const themeLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/theme/${report?.data?.resourceId?._id}/${report?.data?.resourceId?.category?._id}/${report?.data?.resourceId?.category?.slug}/${report?.data?.resourceId?.slug}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	const quizLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/quiz/${report?.data?.resourceId?._id}/${report?.data?.resourceId?.category?._id}/${report?.data?.resourceId?.category?.slug}/${report?.data?.resourceId?.slug}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	const forumLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/forum/${report?.data?.resourceId?._id}/${report?.data?.resourceId?.category?._id}/${report?.data?.resourceId?.category?.slug}/${report?.data?.resourceId?.slug}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	const jobLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/job/${report?.data?.resourceId?._id}/${report?.data?.resourceId?.slug}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	const changelogLink = () => {
		return (
			<h1>
				<Link
					href={{
						pathname: `/changelog/${report?.data?.resourceId?._id}/${report?.data?.resourceId?.slug}`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a target="_blank">{report?.data?.title || "Untitled"}</a>
				</Link>
			</h1>
		);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<header className="mb-4">
						{report?.data?.postType === "blog" && blogLink()}
						{report?.data?.postType === "secret" && secretLink()}
						{report?.data?.postType === "theme" && themeLink()}
						{report?.data?.postType === "quiz" && quizLink()}
						{report?.data?.postType === "forum" && forumLink()}
						{report?.data?.postType === "job" && jobLink()}
						{report?.data?.postType === "changelog" && changelogLink()}
						<div className="text-muted fst-italic mb-2">
							Posted on {report?.data?.createdAt}
						</div>
					</header>
					<section className="mb-5">
						<ParseHtml text={report?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadReport;
