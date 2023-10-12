import { Suspense } from "react";
import Header from "@/layout/header";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";

async function getChangelog(params) {
	const res = await fetch(`http://localhost:5000/api/v1/changelogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const ChangelogRead = async ({ params }) => {
	const getChangelogsData = getChangelog(`/${params.id}`);

	const [changelog] = await Promise.all([getChangelogsData]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={changelog.data.title} />
			<div className="container">
				<div className="row">
					<div className={`col-lg-12`}>
						<article>
							<header className="mb-4">
								<h1>{changelog.data.title}</h1>
								<div className="text-muted fst-italic mb-2">
									Posted on {changelog.data.createdAt} by{" "}
									{changelog.data.user.username}
								</div>
							</header>
							<section className="mb-5">
								<ParseHtml text={changelog?.data?.text} />
							</section>
						</article>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default ChangelogRead;
