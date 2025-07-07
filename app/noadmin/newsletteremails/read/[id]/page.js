import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getNewsletterEmail(params) {
	const res = await fetchurl(
		`/global/newsletteremails${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const ReadNewsletterEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const newsletteremail = await getNewsletterEmail(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<section className="mb-5">
						<ParseHtml text={newsletteremail?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadNewsletterEmail;
