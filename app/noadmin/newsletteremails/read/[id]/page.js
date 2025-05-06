import Image from "next/image";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";
import { notFound } from "next/navigation";

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
					{/* <ArticleHeader
						object={newsletteremail}
						url={`/newsletteremails/category/${newsletteremail?.data?.category?._id}/${newsletteremail?.data?.category?.slug}`}
					/>
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								newsletteremail?.data?.files?.avatar?.location
									?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${newsletteremail?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure> */}
					<section className="mb-5">
						<ParseHtml text={newsletteremail?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadNewsletterEmail;
