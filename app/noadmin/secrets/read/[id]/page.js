import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getSecret(params) {
	const res = await fetchurl(`/global/secrets${params}`, "GET", "no-cache");
	return res;
}

const ReadSecret = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const secret = await getSecret(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<section className="mb-5">
						<ParseHtml text={secret?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadSecret;
