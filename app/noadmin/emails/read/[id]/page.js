import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
// import ArticleHeader from "@/components/global/articleheader";
// import Image from "next/image";

async function getEmails(params) {
	const res = await fetchurl(`/global/emails${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const email = await getEmails(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					{/* <ArticleHeader
						object={email}
						url={`/email/email/${email?.data?.email?._id}/${email?.data?.email?.slug}`}
					/>
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								email?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${email?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure> */}
					<section className="mb-5">
						<ParseHtml text={email?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadEmail;
