import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getEmails(params) {
	const res = await fetchurl(`/global/emails${params}`, "GET", "no-cache");
	console.log("email", res);
	if (!res.success) notFound();
	return res;
}

const ReadEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const email = await getEmails(`/${awtdParams.id}`);

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

export default ReadEmail;
