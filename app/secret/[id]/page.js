import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/secret/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getSecret(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	return res;
}

const SecretRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getSecretsData = getSecret(`/${params.id}`);

	const [secret] = await Promise.all([getSecretsData]);

	return (
		<Suspense fallback={<Loading />}>
			{/* <Header title={secret.data.title} /> */}
			<div className="container mt-4">
				{secret.data.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent>
							<article>
								{/* <ArticleHeader
								object={secret}
								url={`/secret/category/${secret?.data?.category?._id}/${secret?.data?.category?.slug}`}
								/> */}
								{/* <figure className="mb-4">
									<Image
										className="img-fluid"
										src={
											secret?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										alt={`${secret?.data?.files?.avatar?.location?.filename}'s featured image`}
										width={1200}
										height={900}
										priority
									/>
								</figure> */}
								<section className="mb-5">
									<ParseHtml text={secret?.data?.text} />
									<hr />
									<div className="float-start">
										<ExportModal
											linkToShare={`localhost:3000/secret/${secret?.data?._id}`}
											object={secret?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											postId={secret?.data?._id}
											postType="secret"
											onModel="Secret"
										/>
									</div>
									<div style={{ clear: "both" }} />
									{/* <AuthorBox author={secret?.data?.user} /> */}
									{/* <CommentBox
										auth={auth.data}
										user={auth?.data}
										postId={secret?.data?._id}
										secondPostId={secret?.data?._id}
										isVisible={true}
										postType="secret"
										onModel="Secret"
									/> */}
								</section>
							</article>
						</Globalcontent>
						<Sidebar />
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default SecretRead;