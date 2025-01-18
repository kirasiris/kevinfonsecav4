import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getRealState(params) {
	const res = await fetchurl(`/realstates${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadRealState = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const realstate = await getRealState(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<ArticleHeader
						object={realstate}
						url={`/realstate/${realstate?.data?._id}/${realstate?.data?.slug}`}
					/>
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								realstate?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${realstate?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure>
					<section className="mb-5">
						<ParseHtml text={realstate?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadRealState;
