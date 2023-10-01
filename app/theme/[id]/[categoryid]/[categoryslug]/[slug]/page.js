import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import showdown from "showdown";
import base64 from "base-64";
import Header from "@/layout/header";
import Loading from "@/app/theme/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";

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

const ThemeRead = async ({ params }) => {
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
				<div className="row">
					<header className="mb-4">
						<h1>{theme.data.title}</h1>
						<div className="text-muted fst-italic mb-2">
							Posted on {theme.data.createdAt} by {theme.data.user.username}
						</div>
						{theme.data.category && (
							<Link
								href={`/themes?category=${theme.data.category._id}`}
								passHref
								legacyBehavior
							>
								<a className="badge bg-secondary text-decoration-none link-light">
									{theme.data.category.title}
								</a>
							</Link>
						)}
					</header>
					<div className="col-lg-7">
						<figure className="mb-4">
							<Image
								className="img-fluid"
								src={
									theme?.data?.files?.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/1200x900`
								}
								alt={`${theme?.data?.avatar?.location?.fileName}'s featured image`}
								width={1200}
								height={900}
								priority
							/>
						</figure>
					</div>
					<div className="col-lg-5">
						<article>
							<ParseHtml text={theme.data.text} />
							<h1>ReadMe.md</h1>
							<ParseHtml text={readme} />
						</article>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default ThemeRead;
