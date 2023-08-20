"use client";
import MyTextArea from "@/components/global/mytextarea";
import Link from "next/link";
import { useState } from "react";

const PostNew = ({}) => {
	const [postData, setPostData] = useState({
		title: "",
		text: "",
	});
	const { title, text } = postData;

	return (
		<form className="mb-3">
			<div className="card">
				<div className="card-header">
					<div className="float-start">
						<a href="#!">
							<img
								src="https://yt3.ggpht.com/ytc/AL5GRJUOhe9c1D67-yLQEkT2EqyRclI5V3EOTANZQXmt=s48-c-k-c0x00ffffff-no-rj"
								className="me-1"
							/>
						</a>
					</div>
					<Link href="#!">USERNAME</Link>
					<div className="float-end">
						<select className="form-control">
							<option value="1">Only me</option>
							<option value="2">Everyone can see</option>
							<option value="3">People I follow</option>
							<option value="4">People following me</option>
							<option value="5">Anonymous</option>
						</select>
					</div>
				</div>
				<div className="card-body">
					<input
						type={`text`}
						placeholder={`Title *`}
						aria-label={`title`}
						aria-describedby={`title-text`}
						autoComplete={`title`}
						name={`title`}
						id={`title`}
						value={title}
						onChange={(e) => {
							setPostData({
								...postData,
								title: e.target.value,
							});
						}}
						className="form-control"
					/>
					<br />
					<MyTextArea
						name="text"
						id="text"
						objectData={postData}
						setObjectData={setPostData}
						value={text}
						handleChangeValue={"text"}
					/>
				</div>
				<div className="card-footer">
					<button className="btn btn-secondary btn-sm" type="submit">
						Submit
					</button>
				</div>
			</div>
		</form>
	);
};

export default PostNew;
