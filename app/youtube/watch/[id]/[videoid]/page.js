import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Header from "@/layout/header";
import List from "@/components/youtube/list";
import FormButtons from "@/components/global/formbuttons";
import GalleryList from "@/components/youtube/gallerylist";
import RelatedList from "@/components/youtube/relatedlist";
import NewsletterForm from "@/components/global/newsletter";
import { Suspense } from "react";
import { notFound } from "next/navigation";

async function getYouTubes(params) {
	const res = await fetchurl(`/extras/youtube${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const YouTubeRead = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 15;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	// const auth = await getUserOnServer();

	const getYouTubeData = getYouTubes(`/${params.id}/${params.videoid}`);
	const getYouTubesData = getYouTubes(
		`?page=${page}&limit=${limit}&sort=${sort}${decrypt}`
	);

	const [single, youtubes] = await Promise.all([
		getYouTubeData,
		getYouTubesData,
	]);

	const addYouTube = async (formData) => {
		"use server";
		const rawFormData = {
			video_url: formData.get("video_url"),
			download_video: formData.get("download_video"),
		};
		const res = await fetchurl(
			`/extras/youtube/getinfo`,
			"POST",
			"no-cache",
			rawFormData
		);
		redirect(`/youtube/watch/${res?.data?._id}/${res?.data?.videoId}`);
	};

	return (
		<Suspense fallback={<>Loading</>}>
			<Header
				title={single?.data?.title}
				description="An actual good YouTube videos downloader, totally for free!."
				headerStyle={{
					marginBottom: "0px !important",
				}}
			/>
			<div className="container-fluid py-5">
				<form className="w-100" action={addYouTube}>
					<div className="row">
						<div className="col-lg-9">
							<label htmlFor="video_url" className="form-label">
								YouTube URL
							</label>
							<input
								id="video_url"
								name="video_url"
								defaultValue=""
								type="text"
								className="form-control mb-3"
								placeholder="https://www.youtube.com/watch?v=jDWahg4odAY"
							/>
						</div>
						<div className="col-lg-3">
							<label htmlFor="download_video" className="form-label">
								Download video?
							</label>
							<select
								id="download_video"
								name="download_video"
								defaultValue={false}
								className="form-control"
							>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						</div>
					</div>
					<div className="mt-3">
						<FormButtons />
					</div>
				</form>
			</div>
			<div className="container-fluid py-5">
				<div className="row">
					<div className="col-lg-6">
						<GalleryList object={single?.data} />
						<RelatedList object={single?.data} />
						<NewsletterForm
							sectionClassList="text-bg-dark text-center pt-3 pb-3 mt-4 mb-4"
							headingClassList=""
						/>
					</div>
					<div className="col-lg-6">
						<List
							featured={{}}
							objects={youtubes}
							searchParams={searchParams}
						/>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default YouTubeRead;
