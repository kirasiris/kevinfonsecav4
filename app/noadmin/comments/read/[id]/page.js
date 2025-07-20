import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Loading from "@/app/comment/loading";

async function getComment(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadComment = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const comment = await getComment(`/${awtdParams.id}`);

	return (
		<Suspense fallback={<Loading />}>
			<div className="row">
				<div className="col-lg-12">
					<article>
						<section className="mb-5">
							<h1>{comment?.data?.title}</h1>
							<ParseHtml text={comment?.data?.text} />
							<pre>{JSON.stringify(comment?.data, null, 4)}</pre>
						</section>
					</article>
				</div>
			</div>
		</Suspense>
	);
};

export default ReadComment;
