"use client";
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

	const [myData, setData] = useState("");

	const initImage = async (e) => {
		e.preventDefault();
		try {
			setButtonText("...");
			const res = await fetch(
				`http://localhost:5000/api/v1/extras/tools/openai/generate-image`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ ...openAiData, email: email }),
				}
			);
			const data = await res.json();
			setData(data);
			// setImages([data.image, ...images]);
			setButtonText(submitButtonText);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="container-fluid">
			<div className="row">
				{images.length > 0 &&
					images.map((image, index) => (
						<Image
							key={index}
							src={`data:image/jpeg;base64,${image.b64_json}`}
							className="img-fluid col mb-b"
							alt={`Image #${index}`}
							width="1024"
							height="1024"
						/>
					))}
				<pre>{JSON.stringify(myData, null, 4)}</pre>
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
									className="form-control form-control-sm mb-3"
									placeholder="https://www.youtube.com/watch?v=jDWahg4odAY"
								/>
								<span className="input-group-btn">
									<button
										className="btn btn-secondary btn-sm rounded-0"
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
