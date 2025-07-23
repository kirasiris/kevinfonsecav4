import { Suspense } from "react";
import { formatDateWithoutTime } from "befree-utilities";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Loading from "@/app/video/loading";

async function getChapter(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadChapter = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const chapter = await getChapter(`/${awtdParams.id}`);

	return (
		<Suspense fallback={<Loading />}>
			<article>
				<div className="bg-secondary border-0 rounded-0 p-0 mb-3">
					<div className="container">
						<div class="ratio ratio-16x9">
							<iframe
								src={chapter?.data?.players?.stape}
								title={chapter?.data?.title}
								allowfullscreen
							/>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="card mb-3">
								<div className="card-header">
									<div className="d-flex justify-content-between">
										<div className="">
											<button
												type="button"
												className="btn btn-danger btn-sm me-1"
											>
												Favorite
											</button>
											<button
												type="button"
												className="btn btn-secondary btn-sm me-1"
											>
												Likes
											</button>
											<button
												type="button"
												className="btn btn-secondary btn-sm me-1"
											>
												Dislikes
											</button>
											<button
												type="button"
												className="btn btn-secondary btn-sm"
											>
												Views {chapter?.data?.views}
											</button>
										</div>
										<div>
											<button type="button" className="btn btn-danger btn-sm">
												Subscribe
											</button>
										</div>
									</div>
								</div>
								<div className="card-body">
									{chapter?.data?.title}
									<ParseHtml text={chapter?.data?.text} />
								</div>
								<div className="card-footer">
									<div className="d-flex justify-content-between">
										<button className="btn btn-secondary btn-sm">
											Language:&nbsp;{chapter?.data?.language}
										</button>
										<button className="btn btn-secondary btn-sm">
											Date:&nbsp;
											{formatDateWithoutTime(chapter?.data?.createdAt)}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default ReadChapter;
