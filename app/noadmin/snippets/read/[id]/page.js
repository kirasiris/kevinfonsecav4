import { fetchurl } from "@/helpers/setTokenOnServer";
import LiveCode from "@/components/admin/snippets/livecode";
import { notFound } from "next/navigation";

async function getSnippet(params) {
	const res = await fetchurl(`/snippets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadSnippet = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const snippet = await getSnippet(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<LiveCode
						object={snippet?.data}
						title={snippet?.data?.title}
						MyHtml={snippet?.data?.code?.html}
						MyCss={snippet?.data?.code?.css}
						MyJs={snippet?.data?.code?.javascript}
						hasId={true}
						positionFixed={false}
					/>
				</article>
			</div>
		</div>
	);
};

export default ReadSnippet;
