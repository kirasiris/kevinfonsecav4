"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import RelatedCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const YouTubePage = ({ searchParams }) => {
	const [video, setVideo] = useState({});
	const [videos, setVideos] = useState([]);

	const router = useRouter();

	const [videoData, setVideoData] = useState({
		video_url: ``,
		download_video: false,
	});

	const { video_url, download_video } = videoData;

	const [submitButtonText, setButtonText] = useState(`Search`);

	const handleChange = (name) => (e) => {
		e.preventDefault();
		setVideoData({ ...videoData, [name]: e.target.value });
	};

	const initLookout = async (e) => {
		e.preventDefault();
		setButtonText("...");
		const res = await fetch(
			`http://localhost:5000/api/v1/extras/youtube/getinfo`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(videoData),
			}
		);
		const data = await res.json();
		setVideo(data.data);
		setVideos([data.data, ...videos]);
		setButtonText(submitButtonText);
		resetForm();
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

	// If searchParams are found, load the corresponding video data
	useEffect(() => {
		const fetchYouTube = async (id, videoId) => {
			const res = await fetch(
				`http://localhost:5000/api/v1/extras/youtube/${id}/${videoId}`
			);
			const data = await res.json();
			setVideo(data.data);
		};

		searchParams._id &&
			searchParams.videoId &&
			fetchYouTube(searchParams._id, searchParams.videoId);
	}, []);

	// Otherwise load the most recent video found in DB
	useEffect(() => {
		const fetchYouTubes = async (id, videoId) => {
			const res = await fetch(`http://localhost:5000/api/v1/extras/youtube`);
			const data = await res.json();
			!id && !videoId && setVideo(data.data[0]);
			setVideos(data.data);
		};
		fetchYouTubes(searchParams._id, searchParams.videoId);
	}, []);

	const loadVideo = async (id, videoId) => {
		const res = await fetch(
			`http://localhost:5000/api/v1/extras/youtube/${id}/${videoId}`
		);
		const data = await res.json();
		setVideo(data.data);
		router.push(`/youtube?_id=${id}&videoId=${videoId}`);
	};

	const [activeTab, setActiveTab] = useState({
		video: true,
		gallery: false,
	});

	const [activeModal, setActiveModal] = useState(false);

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
								onChange={handleChange("video_url")}
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
								onChange={handleChange("download_video")}
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
							disabled={video_url.length > 0 ? !true : !false}
						>
							{submitButtonText}
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
						) : video?.thumbnails?.length > 0 ? (
							<Carousel>
								{video?.thumbnails.map((thumbnail, index) => (
									<Carousel.Item key={index}>
										<img src={`${thumbnail}`} className="d-block w-100" />
									</Carousel.Item>
								))}
							</Carousel>
						) : video?.thumbnails?.length > 0 ? (
							<Carousel>
								{video?.thumbnails.map((thumbnail, index) => (
									<Carousel.Item key={index}>
										<img src={`${thumbnail}`} className="d-block w-100" />
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
												<img
													key={related.id}
													src={
														related.thumbnails[related.thumbnails.length - 1]
															.url
													}
													alt={`${related}'s thumbnail`}
													title="imagem"
													style={{
														width: 400,
														height: "auto",
													}}
													className="p-1"
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
														<img
															src={
																related.author.thumbnails[
																	related.author.thumbnails.length - 1
																].url
															}
															style={{ width: "45px" }}
															className="mt-2 mb-1"
														/>{" "}
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
							placeholder="Enter website"
						/>
						{list?.length > 0 && (
							<>
								<hr />
								<h2>Videos found ({list.length})...</h2>
								<p>Data gets deleted on the 15 of each month</p>
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
							{list?.length > 0 ? (
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
															{video?.viewCount}
														</button>
													</div>
													<audio
														controls
														style={{
															width: "100%",
															backgroundColor: "#00000000",
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
													<button
														className="btn btn-secondary btn-sm m-1"
														type="button"
														onClick={() => setActiveModal(true)}
													>
														More
													</button>
													<Modal
														show={activeModal}
														onHide={() => setActiveModal(false)}
														size="xl"
														aria-labelledby="contained-modal-title-vcenter"
														centered
													>
														<Modal.Header closeButton>
															<h1 className="display-6">Download Options</h1>
														</Modal.Header>
														<Modal.Body>
															{video?.text}
															<hr />
															<h2 className="display-6">
																More downloading options below:
															</h2>
															<div className="btn-group">
																<>
																	<a
																		href={`${video?.videoOnly?.url}`}
																		className={`btn btn-sm btn-dark`}
																		download
																		rel="noopener noreferrer"
																	>
																		Download Video ONLY
																	</a>
																	<a
																		href={`${video?.audioOnly?.url}`}
																		className={`btn btn-sm btn-dark`}
																		download
																		rel="noopener noreferrer"
																	>
																		Download Audio ONLY
																	</a>
																</>
															</div>
														</Modal.Body>
														<Modal.Footer>
															<button
																className="btn btn-secondary btn-sm"
																type="button"
																onClick={() => setActiveModal(false)}
															>
																Close
															</button>
														</Modal.Footer>
													</Modal>
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
