import Image from "next/image";
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
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								category?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${category?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure>
					<section className="mb-5">
						<ParseHtml text={category?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadCategory;
