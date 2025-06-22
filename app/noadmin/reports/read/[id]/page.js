import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getReport(params) {
	const res = await fetchurl(`/global/reports${params}`, "GET", "no-cache");
	return res;
}

const ReadReport = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const report = await getReport(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<section className="mb-5">
						<h1>Report</h1>
						<ParseHtml text={report?.data?.text} />
						<hr />
						<p>
							<b>Rest of report object:</b>
						</p>
						<pre>{JSON.stringify(report.data, null, 4)}</pre>
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadReport;
