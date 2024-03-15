import { Suspense } from "react";
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

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getTheme(params) {
	const res = await fetch(`http://localhost:5000/api/v1/themes${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getReadMe(repoName) {
	const res = await fetch(
		`https://api.github.com/repos/kirasiris/${repoName}/contents/README.md`,
		{
			accept: "application/vnd.github.v3+json",
			headers: {
				Authorization: "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",
			},
			cache: "no-store",
		}
	);
	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const ThemeRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getThemesData = getTheme(`/${params.id}`);

	const [theme] = await Promise.all([getThemesData]);

	const readMeData = await getReadMe(theme.data.github_readme);

	const readMEDecoder = (text) => {
		const converter = new showdown.Converter();
		const readMEContentBase64 = base64.decode(text);
		const textConverted = converter.makeHtml(readMEContentBase64);

		return textConverted;
	};

	const readme = readMEDecoder(
		readMeData.content ? readMeData.content : "Tm8gcmVhZE1FIGZpbGU="
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
									<div className="card">
										<div className="card-header">ReadMe.md</div>
										<div className="card-body">
											<ParseHtml text={readme} markdown={true} />
										</div>
									</div>
									<hr />
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
