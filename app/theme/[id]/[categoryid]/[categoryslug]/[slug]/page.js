import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import showdown from "showdown";
import base64 from "base-64";
import Header from "@/layout/header";
import Sidebar from "@/layout/theme/sidebar";
import Loading from "@/app/theme/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getTheme(params) {
	const res = await fetchurl(`/themes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getReadMe(repoName) {
	const response = await fetch(
		`https://api.github.com/repos/kirasiris/${repoName}/contents/README.md`,
		{
			method: "GET",
			accept: "application/vnd.github+json",
			headers: {
				Authorization: "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",
			},
			cache: "no-store",
		}
	)
		.then(async (res) => {
			if (!res.ok) {
				// check if there was JSON
				const contentType = res.headers.get("Content-Type");
				if (contentType && contentType.includes("application/json")) {
					// return a rejected Promise that includes the JSON
					return res.json().then((json) => Promise.reject(json));
				}
				// no JSON, just throw an error
				throw new Error("Something went horribly wrong 💩");
			}
			return res.json();
		})
		.then((data) => data)
		.catch((err) => {
			console.log(err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from setTokenOnServer file", err);
			}
		});
	return response;
}

const ThemeRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getThemesData = getTheme(`/${params.id}`);

	const [theme] = await Promise.all([getThemesData]);

	const readMeResponse = await getReadMe(theme.data.github_readme);

	const readMEDecoder = (text) => {
		const converter = new showdown.Converter();
		const readMEContentBase64 = base64.decode(text);
		const textConverted = converter.makeHtml(readMEContentBase64);
		return textConverted;
	};

	const readme = readMEDecoder(
		readMeResponse.content ? readMeResponse.content : "Tm8gcmVhZE1FIGZpbGU="
	);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={theme.data.title} />
			<div className="container">
				{theme.data.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-8`}>
							<article>
								<ArticleHeader
									object={theme}
									url={`/theme/category/${theme.data.category._id}/${theme.data.category.slug}`}
								/>
								{/* HERE GOES THE FIGURE */}
								<section className="mb-5">
									<ParseHtml text={theme.data.text} />
									<div className="card mb-4">
										<div className="card-header">ReadMe.md</div>
										<div className="card-body">
											<ParseHtml text={readme} />
										</div>
									</div>
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										{theme?.data?.category && (
											<ExportModal
												linkToShare={`localhost:3000/theme/${theme?.data?._id}/${theme?.data?.category?._id}/${theme?.data?.category.slug}/${theme?.data?.slug}`}
												object={theme?.data}
											/>
										)}
									</div>
									<div className="float-end">
										<ReportModal
											postId={theme?.data?._id}
											postType="theme"
											onModel="Blog"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={theme?.data?.user} />
									<CommentBox
										auth={auth.data}
										authorization={auth.authorizationTokens}
										user={theme?.data?.user}
										postId={theme?.data?._id}
										secondPostId={theme?.data?._id}
										isVisible={theme?.data?.commented}
										postType="theme"
										onModel="Blog"
									/>
								</section>
							</article>
						</Globalcontent>
						<Sidebar object={theme} />
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default ThemeRead;
