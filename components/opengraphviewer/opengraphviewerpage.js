"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Image from "next/image";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NewsletterForm from "../global/newsletter";
import { checkEmptyObject } from "befree-utilities";

const OpenGraphViewerPage = ({ searchParams = {} }) => {
	const router = useRouter();

	// const [openGraph, setOpenGraph] = useState({});
	const [loading, setLoading] = useState(true);
	const [openGraphData, setOpenGraphData] = useState({
		url: ``,
		title: `Untitled`,
		text: `No description`,
		image: `https://setwan.bimakota.go.id/assets/images/no-image.png`,
		type: ``,
		domain: ``,
	});

	const { url, title, text, image, type, domain } = openGraphData;

	const [checkWebsiteBtnText, setCheckWebsiteBtnText] =
		useState("Check website");

	const checkWebsite = async (e) => {
		e.preventDefault();
		setCheckWebsiteBtnText("...");
		const res = await fetchurl(
			`/extras/tools/opengraphs`,
			"POST",
			"no-cache",
			openGraphData
		);

		setCheckWebsiteBtnText(checkWebsiteBtnText);
		setOpenGraphData({
			...openGraphData,
			title: res?.data?.title,
			text: res?.data?.text,
			image: res?.data?.image,
			type: res?.data?.type,
			domain: res?.data?.domain,
		});
		router.push(`/opengraphviewer?_id=${res?.data?._id}`, { scroll: false });
	};

	// Fetch single object
	useEffect(() => {
		const abortController = new AbortController();
		const fetchOpenGraphObject = async (params) => {
			const res = await fetchurl(
				`/extras/tools/opengraphs/${params}`,
				"GET",
				"default",
				{},
				abortController.signal,
				false,
				false
			);
			if (res?.data) {
				// setOpenGraph(res.data);
				setOpenGraphData({
					title: res.data.title,
					text: res.data.text,
					image: res.data.image,
					url: res.data.originalurl,
					domain: res.data.domain,
					type: res.data.type,
				});
				setLoading(false);
			} else {
				router.push(`/opengraphviewer`, { scroll: false });
			}
		};
		if (!checkEmptyObject(searchParams)) {
			setLoading(true);
			fetchOpenGraphObject(searchParams._id);
		}
		return () => abortController.abort();
	}, [searchParams._id]);

	return (
		<section className="container-fluid py-5 mb-4">
			<div className="row mb-3">
				<div className="col-lg-12">
					<form onSubmit={checkWebsite}>
						<div className="input-group">
							<input
								id="url"
								name="url"
								value={url}
								onChange={(e) => {
									setOpenGraphData({
										...openGraphData,
										url: e.target.value,
									});
								}}
								type="text"
								className="form-control rounded-start"
								placeholder="Enter website"
							/>
							<span className="input-group-btn">
								<button
									className="btn btn-secondary rounded-start-0 rounded-end"
									type="submit"
									disabled={url?.length > 0 ? !true : !false}
								>
									{checkWebsiteBtnText}
								</button>
							</span>
						</div>
					</form>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-4">
					<h2>Edit</h2>
					<p className="lead">
						This information will be displayed on Google and Social Networks
					</p>
					<div className="mb-3">
						<label htmlFor="title" className="form-label">
							Title
						</label>
						<input
							id="title"
							name="title"
							className="form-control"
							type="text"
							value={title}
							placeholder={"Title"}
							onChange={(e) => {
								setOpenGraphData({
									...openGraphData,
									title: e.target.value,
								});
							}}
						/>
						<spa>Recommended: 60 characters</spa>
					</div>
					<div className="mb-3">
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<textarea
							id="text"
							name="text"
							className="form-control"
							placeholder={"Text"}
							value={text}
							onChange={(e) => {
								setOpenGraphData({
									...openGraphData,
									text: e.target.value,
								});
							}}
							rows="3"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="image" className="form-label">
							Image
						</label>
						<input
							id="image"
							name="image"
							className="form-control"
							type="text"
							value={image}
							placeholder={"Image"}
							onChange={(e) => {
								setOpenGraphData({
									...openGraphData,
									image: e.target.value,
								});
							}}
						/>
						<div className="form-text">
							<b>Recommended:</b> 1200x630px
						</div>
					</div>
					<div className="mb-3">
						<h6 className="text-center">Advertisement</h6>
						<div
							className="mx-auto bg-dark w-100"
							style={{ minHeight: "250px" }}
						>
							xD
						</div>
					</div>
				</div>
				<div className="col-lg-4">
					<h2>Copy</h2>
					<p className="lead">Add these meta tags to your website.</p>
					<CodeMirror
						value={`<!-- HTML Meta Tags -->
<title>${title}</title>
<meta name="description" content="${text}">
<!-- Facebook Meta Tags -->
<meta property="og:url" content="${url}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${text}">
<meta property="og:image" content="${image}">
<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="${domain}">
<meta property="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${text}">
<meta name="twitter:image" content="${image}">
<!-- Meta Tags Generated via ${process.env.NEXT_PUBLIC_WEBSITE_URL}/opengraphviewer -->`}
						theme={vscodeDark}
						extensions={[loadLanguage("html")]}
						readOnly
					/>
					<NewsletterForm
						sectionClassList="text-bg-dark text-center pt-3 pb-3 mt-4 mb-4"
						headingClassList=""
					/>
				</div>
				<div className="col-lg-4">
					<h2>Preview</h2>
					<p className="lead">
						How your website is displayed on search engines and Social Networks
					</p>
					{image && (
						<>
							<div className="mb-3">
								<h3>Facebook</h3>
								<div className="facebook-preview-container">
									<Image
										src={image}
										width={"524"}
										height={"274"}
										alt={`${title}'s image`}
									/>
									<div className="facebook-preview-info-container">
										<div className="facebook-preview-info-domain">{domain}</div>
										<div className="facebook-preview-info-title-description-container">
											<div className="facebook-preview-info-title">{title}</div>
											<div className="facebook-preview-info-description">
												{text}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-3">
								<h3>Twitter</h3>
								<div className="twitter-preview-container">
									<Image
										src={image}
										width={"436"}
										height={"220"}
										alt={`${title}'s image`}
									/>
									<div className="twitter-preview-info-container">
										<div className="twitter-preview-info-title-description-container">
											<div className="twitter-preview-info-title">{title}</div>
											<div className="twitter-preview-info-description">
												{text}
											</div>
										</div>
										<div className="twitter-preview-info-domain">{domain}</div>
									</div>
								</div>
							</div>
							<div className="mb-3">
								<h3>LinkedIn</h3>
								<div className="linkedin-preview-container">
									<Image
										src={image}
										width={"520"}
										height={"270"}
										alt={`${title}'s image`}
									/>
									<div className="linkedin-preview-info-container">
										<div className="linkedin-preview-info-title-description-container">
											<div className="linkedin-preview-info-title">{title}</div>
											<div className="linkedin-preview-info-domain">
												{domain}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-3">
								<h3>Discord</h3>
								<div className="discord-preview-container">
									<div className="discord-preview-info-container">
										<div className="discord-preview-info-domain">{domain}</div>
										<div className="discord-preview-info-title">{title}</div>
										<div className="discord-preview-info-description">
											{text}
										</div>
										<Image
											src={image}
											width={"524"}
											height={"274"}
											alt={`${title}'s image`}
											style={{
												maxWidth: "100%",
												marginTop: "1rem",
												borderRadius: "0.25rem",
												overflow: "hidden",
											}}
										/>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default OpenGraphViewerPage;
