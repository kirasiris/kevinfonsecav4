import Image from "next/image";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";

async function getAcquisitionsDisposals(params) {
	const res = await fetchurl(
		`/global/acquisitionsdisposals${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const ReadAcquisitionDisposal = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const blog = await getAcquisitionsDisposals(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					{/* <ArticleHeader
						object={blog}
						url={`/blog/category/${blog?.data?.category?._id}/${blog?.data?.category?.slug}`}
					/>
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								blog?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${blog?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure> */}
					<section className="mb-5">
						<ParseHtml text={blog?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadAcquisitionDisposal;
