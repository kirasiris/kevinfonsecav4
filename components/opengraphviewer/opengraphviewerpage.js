"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import Image from "next/image";
import { useEffect } from "react";

const OpenGraphViewerPage = ({ searchParams }) => {
	const router = useRouter();
	const [openGraphData, setOpenGraphData] = useState({
		url: ``,
		title: ``,
		text: ``,
		image: `https://setwan.bimakota.go.id/assets/images/no-image.png`,
		type: ``,
		domain: ``,
	});

	const { url, title, text, image, type, domain } = openGraphData;

	const [checkWebsiteBtnText, setCheckWebsiteBtnText] =
		useState("Check website");

	const handleChange = (name) => (e) => {
		setOpenGraphData({ ...openGraphData, [name]: e.target.value });
	};

	const checkWebsite = async (e) => {
		e.preventDefault();
		setCheckWebsiteBtnText("...");
		const res = await fetch(
			`http://localhost:5000/api/v1/extras/tools/opengraphs`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(openGraphData),
			}
		);
		const data = await res.json();
		setCheckWebsiteBtnText(checkWebsiteBtnText);
		setOpenGraphData({
			...openGraphData,
			title: data.data["og:title"],
			text: data.data["og:description"],
			image: data.data["og:image"],
			type: data.data["og:type"],
			domain: new URL(data.data["og:url"]).hostname,
		});

		router.push(`/opengraphviewer?_id=${data.data._id}`);
	};

	if (searchParams._id) {
		useEffect(() => {
			const fetchOpenGraphObject = async (params) => {
				const res = await fetch(
					`http://localhost:5000/api/v1/extras/tools/opengraphs/${params}`
				);
				return res.json();
			};
			fetchOpenGraphObject(searchParams._id).then((result) => {
				setOpenGraphData({
					...openGraphData,
					title: result.data.title,
					text: result.data.text,
					image: result.data.image,
					type: result.data.type,
					domain: result.data.domain,
				});
			});
			return () => {};
		}, []);
	}

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
								onChange={handleChange("url")}
								type="text"
								className="form-control rounded-0"
								placeholder="Enter website"
							/>
							<span className="input-group-btn">
								<button className="btn btn-secondary rounded-0" type="submit">
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
							name="text"
							className="form-control"
							type="text"
							value={title.trim()}
							placeholder={"Title"}
							onChange={handleChange("title")}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							className="form-control"
							placeholder={"Description"}
							value={text.trim()}
							onChange={handleChange("text")}
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
							value={image.trim()}
							placeholder={"Image"}
							onChange={handleChange("image")}
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
<title>${title || ""}</title>
<meta name="description" content="${text || ""}">
<!-- Facebook Meta Tags -->
<meta property="og:url" content="${openGraphData.url || ""}">
<meta property="og:type" content="${type || ""}">
<meta property="og:title" content="${title || ""}">
<meta property="og:description" content="${text || ""}">
<meta property="og:image" content="${image || ""}">
<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="${domain}">
<meta property="twitter:url" content="${openGraphData.url || ""}">
<meta name="twitter:title" content="${title || ""}">
<meta name="twitter:description" content="${text || ""}">
<meta name="twitter:image" content="${image || ""}">
<!-- Meta Tags Generated via https://www.kevinurielfonseca.me/opengraphviewer -->`}
						theme={vscodeDark}
						extensions={[loadLanguage("html")]}
						readOnly
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
										<div className="facebook-preview-info-domain">
											{domain || ""}
										</div>
										<div className="facebook-preview-info-title-description-container">
											<div className="facebook-preview-info-title">
												{title || ""}
											</div>
											<div className="facebook-preview-info-description">
												{text || ""}
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
											<div className="twitter-preview-info-title">
												{title || ""}
											</div>
											<div className="twitter-preview-info-description">
												{text || ""}
											</div>
										</div>
										<div className="twitter-preview-info-domain">
											{domain || ""}
										</div>
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
											<div className="linkedin-preview-info-title">
												{title || ""}
											</div>
											<div className="linkedin-preview-info-domain">
												{domain || ""}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-3">
								<h3>Discord</h3>
								<div className="discord-preview-container">
									<div className="discord-preview-info-container">
										<div className="discord-preview-info-domain">
											{domain || ""}
										</div>
										<div className="discord-preview-info-title">
											{title || ""}
										</div>
										<div className="discord-preview-info-description">
											{text || ""}
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