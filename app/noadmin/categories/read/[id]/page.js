import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";

async function getCategory(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadCategory = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const category = await getCategory(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<ArticleHeader
						object={category}
						url={`/category/category/${category?.data?.category?._id}/${category?.data?.category?.slug}`}
					/>
					<section className="mb-5">
						<ParseHtml text={category?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadCategory;
