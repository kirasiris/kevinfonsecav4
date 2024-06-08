import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";
import Image from "next/image";

async function getJob(params) {
	const res = await fetchurl(`/jobs${params}`, "GET", "no-cache");
	return res;
}

const ReadJob = async ({ params, searchParams }) => {
	const job = await getJob(`/${params.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<ArticleHeader
						object={job}
						url={`/job/category/${job?.data?.category?._id}/${job?.data?.category?.slug}`}
					/>
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								job?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${job?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure>
					<section className="mb-5">
						<ParseHtml text={job?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadJob;
