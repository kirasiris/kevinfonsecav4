"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Image from "next/image";
import { useEffect, useState } from "react";

const AImagePage = ({ searchParams }) => {
	const [images, setImages] = useState([]);
	const [email, setEmail] = useState("");
	const [showPromp, setShowPrompt] = useState(false);
	const [openAiData, setOpenAiData] = useState({
		prompt: ``,
	});

	const { prompt } = openAiData;

	const [submitEmailButtonText] = useState("Submit email");
	const [submitButtonText, setButtonText] = useState(`Generate`);

	useEffect(() => {
		const localEmail = localStorage.getItem("openai-email");
		localEmail && setEmail(localEmail);
		setShowPrompt(true);
	}, []);

	const submitEmail = async (e) => {
		e.preventDefault();
		localStorage.setItem("openai-email", email);
		setShowPrompt(true);
	};

	const initImage = async (e) => {
		e.preventDefault();
		try {
			setButtonText("...");
			const res = await fetchurl(
				`/extras/tools/openai/generate-image`,
				"POST",
				"no-cache",
				{
					...openAiData,
					email: email,
				}
			);
			console.log("Images", res);
			// setImages([res.data, ...images]);
			// setButtonText(submitButtonText);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="container-fluid">
			<div className="row">
				{images?.length > 0 &&
					images.map((image, index) => (
						<>
							<Image
								key={index}
								src={`${image.url}`}
								className="img-fluid col mb-b"
								alt={`Image #${index}`}
								width="1024"
								height="1024"
							/>
						</>
					))}
				<div className="col-lg-12">
					{!showPromp ? (
						<div className="input-group">
							<input
								id="email"
								name="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								type="text"
								className="form-control form-control-sm mb-3"
								placeholder="john@doe.com"
							/>
							<span className="input-group-btn">
								<button
									className="btn btn-secondary btn-sm rounded-0"
									type="button"
									disabled={email.length > 0 ? !true : !false}
									onClick={submitEmail}
								>
									{submitEmailButtonText}
								</button>
							</span>
						</div>
					) : (
						<form
							className={`w-100 ${images.length > 0 && "mt-4"}`}
							onSubmit={initImage}
						>
							<div className="input-group">
								<input
									id="prompt"
									name="prompt"
									value={prompt}
									onChange={(e) => {
										setOpenAiData({
											...openAiData,
											prompt: e.target.value,
										});
									}}
									type="text"
									className="form-control rounded-start mb-3"
									placeholder="https://www.youtube.com/watch?v=jDWahg4odAY"
								/>
								<span className="input-group-btn">
									<button
										className="btn btn-secondary rounded-start-0 rounded-end"
										type="submit"
										disabled={prompt.length > 0 ? !true : !false}
									>
										{submitButtonText}
									</button>
								</span>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default AImagePage;
