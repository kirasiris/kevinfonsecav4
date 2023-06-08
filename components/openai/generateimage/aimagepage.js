"use client";

import { useState } from "react";

const AImagePage = ({ searchParams }) => {
	const [openAiData, setOpenAiData] = useState({
		prompt: ``,
	});

	const { prompt } = openAiData;

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-12">
					<form>
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
							className="form-control mb-3"
							placeholder="https://www.youtube.com/watch?v=jDWahg4odAY"
						/>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AImagePage;
