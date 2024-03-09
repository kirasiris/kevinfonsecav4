import { Suspense } from "react";
import Header from "@/layout/header";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";
import CommentBox from "@/components/global/commentbox";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AuthorBox from "@/components/global/authorbox";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getChangelog(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/changelogs${params}`
	);
	return res.json();
}

const ChangelogRead = async ({ params }) => {
	const auth = await getAuthenticatedUser();
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
								<AuthorBox author={changelog?.data?.user} />
								<CommentBox
									auth={auth.data}
									authorization={auth.authorizationTokens}
									user={changelog?.data?.user}
									postId={changelog?.data?._id}
									secondPostId={changelog?.data?._id}
									isVisible={changelog?.data?.commented}
									postType="changelog"
									onModel="Changelog"
								/>
							</section>
						</article>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default ChangelogRead;
