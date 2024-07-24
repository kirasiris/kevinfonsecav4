import { Suspense } from "react";
import { notFound } from "next/navigation";
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
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";
import MyFinalCommentForm from "@/components/global/myfinalcommentform";
import DisqusComments from "@/components/global/disquscomments";
import { revalidatePath } from "next/cache";
import Head from "@/app/head";

async function getSecret(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const SecretRead = async ({ params, searchParams }) => {
	const auth = await getUserOnServer();

	const getSecretsData = getSecret(`/${params.id}`);

	const [secret] = await Promise.all([getSecretsData]);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={secret.data.age + " - " + secret.data.sex}
				description={secret.data.text}
				// favicon=""
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/secret/${secret.data._id}`}
				author="Kevin Uriel Fonseca"
				createdAt={secret.data.createdAt}
				updatedAt={secret.data.updatedAt}
				locales=""
				posType="secret"
			/>
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
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										<ExportModal
											linkToShare={`/secret/${secret?.data?._id}`}
											object={secret?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={secret?.data?._id}
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
