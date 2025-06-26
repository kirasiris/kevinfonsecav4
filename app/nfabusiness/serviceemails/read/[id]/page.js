import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getServiceEmails(params) {
	const res = await fetchurl(
		`/global/serviceemails${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const ReadServiceEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const email = await getServiceEmails(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<section className="mb-5">
						<ParseHtml text={email?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadServiceEmail;
