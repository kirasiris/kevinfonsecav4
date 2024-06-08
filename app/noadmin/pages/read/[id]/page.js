import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";

async function getPage(params) {
	const res = await fetchurl(`/pages${params}`, "GET", "no-cache");
	return res;
}

const ReadPage = async ({ params, searchParams }) => {
	const page = await getPage(`/${params.id}`);
	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<ArticleHeader object={page} url={`/page/${page?.data?._id}`} />
					{/* <figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								page?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${page?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure> */}
					<section className="mb-5">
						<ParseHtml text={page?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadPage;
