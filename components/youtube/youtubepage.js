"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import "react-multi-carousel/lib/styles.css";
import { checkEmptyObject } from "befree-utilities";
import DisplayYoutubeInfoModal from "./displayyoutubeinfomodal";
import NewsletterForm from "../global/newsletter";
import Image from "next/image";
import RelatedCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const YouTubePage = ({
	searchParams = {},
	pushTo = true,
	pushToLink = "/youtube",
}) => {
	const router = useRouter();

	const [video, setVideo] = useState({});
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingVideos, setLoadingVideos] = useState(true);

	const [videoData, setVideoData] = useState({
		video_url: ``,
		download_video: false,
	});

	const { video_url, download_video } = videoData;

	const [btnText, setBtnText] = useState(`Search`);

	const initLookout = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const res = await fetchurl(
			`/extras/youtube/getinfo`,
			"POST",
			"no-cache",
			videoData
		);
		setVideo(res.data);
		setVideos([res.data, ...videos]);
		setBtnText(btnText);
		resetForm();
		router.push(`/youtube?_id=${res.data._id}&videoId=${res.data.videoId}`, {
			scroll: false,
		});
	};

	const resetForm = () => {
		setVideoData({
			video_url: ``,
			download_video: false,
		});
	};

	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);

	useEffect(() => {
		setList(videos);
	}, [videos]);

	useEffect(() => {
		if (keyword !== "") {
			const result = videos.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(videos);
		}
	}, [keyword]);

	const responsive = {
		superLargeDesktop: {
			// the naming can be any, depends on you.
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 1,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

	// Fetch single object
	useEffect(() => {
		const abortController = new AbortController();
		const fetchYouTube = async (id, videoId) => {
			const res = await fetchurl(
				`/extras/youtube/${id}/${videoId}`,
				"GET",
				"default",
				{},
				abortController.signal,
				false,
				false
			);
			if (res?.data) {
				setVideo(res.data);
				setLoading(false);
			} else {
				router.push(`/youtube`, { scroll: false });
			}
		};
		if (!checkEmptyObject(searchParams)) {
			setLoading(true);
			fetchYouTube(searchParams._id, searchParams.videoId);
		}
		return () => abortController.abort();
	}, [searchParams._id, searchParams.videoId]);

	// Fetch all objects
	useEffect(() => {
		const abortController = new AbortController();
		const fetchYouTubes = async () => {
			const res = await fetchurl(
				`/extras/youtube`,
				"GET",
				"default",
				{},
				abortController.signal,
				false,
				false
			);
			if (res?.data) {
				// !id && !videoId && setVideo(res?.data[0]);
				checkEmptyObject(searchParams) && setVideo(res.data[0]); // Display the most recent video
				setVideos(res.data); // Then set the rest of them
				setLoading(false);
				setLoadingVideos(false);
			}
		};
		fetchYouTubes();
		setLoading(true);
		setLoadingVideos(true);
		return () => abortController.abort();
	}, []);

	const loadVideo = async (id, videoId) => {
		pushTo &&
			router.push(`${pushToLink}?_id=${id}&videoId=${videoId}`, {
				scroll: false,
			});
	};

	const [activeTab, setActiveTab] = useState({
		video: true,
		gallery: false,
	});

	return (
		<>
			<div className="container-fluid py-5">
				<form className="w-100" onSubmit={initLookout}>
					<div className="row">
						<div className="col-lg-9">
							<label htmlFor="video_url" className="form-label">
								YouTube URL
							</label>
							<input
								id="video_url"
								name="video_url"
								value={video_url}
								onChange={(e) => {
									setVideoData({
										...videoData,
										video_url: e.target.value,
									});
								}}
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
								value={download_video}
								onChange={(e) => {
									setVideoData({
										...videoData,
										download_video: e.target.value,
									});
								}}
								className="form-control"
							>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						</div>
					</div>
					<div className="mt-3">
						<button
							className="btn btn-secondary btn-sm float-start"
							type="submit"
							disabled={video_url?.length > 0 ? !true : !false}
						>
							{btnText}
						</button>
						<button
							className="btn btn-secondary btn-sm float-end"
							type="reset"
							onClick={resetForm}
						>
							Reset
						</button>
					</div>
				</form>
			</div>
			<div className="container-fluid py-5">
				<div className="row">
					<div className="col-lg-6">
						<div className="btn-group mb-1">
							<button
								className="btn btn-secondary btn-sm"
								type="button"
								onClick={() =>
									setActiveTab({
										video: true,
										gallery: false,
									})
								}
							>
								Video
							</button>
							<button
								className="btn btn-secondary btn-sm"
								type="button"
								onClick={() =>
									setActiveTab({
										video: false,
										gallery: true,
									})
								}
							>
								Gallery
							</button>
						</div>
						{activeTab.video ? (
							loading ? (
								<p>Loading video</p>
							) : video?.videoEmbedUrl !== "" &&
							  video?.videoEmbedUrl !== undefined &&
							  video?.videoEmbedUrl !== null ? (
								<>
									<div className="ratio ratio-16x9">
										<iframe
											src={
												video?.videoEmbedUrl
													? video?.videoEmbedUrl
													: video?.videoEmbedUrl
											}
										/>
									</div>
									<a
										href={`${
											video?.videoFetchedUrl
												? video?.videoFetchedUrl
												: video?.videoFetchedUrl
										}`}
										target="_blank"
										rel="noopener noreferrer"
										className="btn btn-sm btn-link"
									>
										Original Video:
										{video?.videoFetchedUrl
											? video?.videoFetchedUrl
											: video?.videoFetchedUrl}
									</a>
								</>
							) : (
								<p>Nothing to show</p>
							)
						) : video?.thumbnails?.length > 0 ? (
							<Carousel>
								{video?.thumbnails.map((thumbnail, index) => (
									<Carousel.Item key={index}>
										<Image
											src={thumbnail}
											alt="xd"
											width={1248}
											height={698}
											className="d-block w-100"
										/>
									</Carousel.Item>
								))}
							</Carousel>
						) : (
							<p>Nothing to show</p>
						)}
						{video?.related_videos?.length > 0 && (
							<>
								<h6>Related ({video?.related_videos?.length})...</h6>
								<RelatedCarousel responsive={responsive}>
									{video?.related_videos?.map((related, index) => (
										<div key={index}>
											<a
												href={`https://www.youtube.com/watch?v=${related.id}`}
												target="_blank"
												rel="noreferrer noopener"
											>
												<Image
													src={
														related.thumbnails[related.thumbnails.length - 1]
															.url
													}
													className="p-1"
													alt={`${related.author.name}'s thumbnail`}
													title={related.title}
													width={100}
													height={100}
													style={{ width: "100%", height: "auto" }}
												/>
											</a>
											<br />
											{related.author && (
												<>
													<a
														href={related.author.channel_url}
														target="_blank"
														rel="noreferrer noopener"
													>
														<Image
															src={
																related.author.thumbnails[
																	related.author.thumbnails.length - 1
																].url
															}
															className="mt-2 mb-1 me-1"
															alt={`${related.author.name}'s thumbnail`}
															title={related.author.name}
															width={100}
															height={100}
															style={{ width: "45px", height: "auto" }}
														/>
														{related.author.name}
													</a>
													<br />
												</>
											)}
											<a
												href={`https://www.youtube.com/watch?v=${related.id}`}
												target="_blank"
												rel="noreferrer noopener"
											>
												{related.title}
											</a>
										</div>
									))}
								</RelatedCarousel>
							</>
						)}
						<NewsletterForm
							sectionClassList="text-bg-dark text-center pt-3 pb-3 mt-4 mb-4"
							headingClassList=""
						/>
					</div>
					<div className="col-lg-6">
						<input
							id="keyword"
							name="keyword"
							value={keyword}
							onChange={(e) => {
								e.preventDefault();
								setKeyword(e.target.value);
							}}
							type="text"
							className="form-control mb-3"
							placeholder="Enter name of video (EXACT MATCH!)"
						/>
						{list?.length > 0 && (
							<>
								<hr />
								<h2>Videos found ({list.length})...</h2>
								<p className="p-3 text-bg-danger">
									Data gets deleted on the 15 of each month
								</p>
								<hr />
							</>
						)}
						<div
							className="card list-container"
							style={{
								height: "1300px",
								overflowY: "auto",
							}}
						>
							{loadingVideos ? (
								<div className="alert alert-dark m-0 rounded-0">Loading...</div>
							) : list?.length > 0 ? (
								<ul className="list-group list-group-flush">
									{list?.map(
										(video) =>
											video !== undefined &&
											video !== null && (
												<li className="list-group-item" key={`${video?._id}`}>
													<p
														onClick={() => loadVideo(video._id, video.videoId)}
														style={{
															cursor: "pointer",
														}}
													>
														{video?.title}-{video?.videoId}
													</p>
													<div className="btn-group mb-2">
														<button
															className="btn btn-secondary btn-sm"
															type="button"
														>
															<i
																aria-hidden
																className="fas fa-thumbs-up me-1"
															/>
															{video?.likes}
														</button>
														<button
															className="btn btn-secondary btn-sm"
															type="button"
														>
															<i
																aria-hidden
																className="fas fa-thumbs-down me-1"
															/>
															{video?.dislikes}
														</button>
														<button
															className="btn btn-secondary btn-sm"
															type="button"
														>
															<i aria-hidden className="fas fa-tag me-1" />
															{video?.category}
														</button>
														<button
															className="btn btn-secondary btn-sm"
															type="button"
														>
															<i aria-hidden className="fas fa-eye me-1" />
															{video?.views}
														</button>
													</div>
													<audio
														controls
														style={{
															width: "100%",
															backgroundColor: "#000000",
														}}
													>
														<source src={`${video?.audioOnly.url}`} />
													</audio>
													<a
														href={`${video?.videoToDownload.url}`}
														className={`btn btn-sm btn-secondary`}
														download
														rel="noopener noreferrer"
													>
														Download Video
													</a>
													<DisplayYoutubeInfoModal object={video} />
												</li>
											)
									)}
								</ul>
							) : (
								<div className="alert alert-danger m-0 rounded-0">
									Nothing found
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default YouTubePage;
