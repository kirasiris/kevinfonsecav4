import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getReport(params) {
	const res = await fetchurl(`/reports${params}`, "GET", "no-cache");
	return res;
}

const ReadReport = async ({ params, searchParams }) => {
	const report = await getReport(`/${params.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<header className="mb-4">
						<h1>{report?.data?.title || "Untitled"}</h1>
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
