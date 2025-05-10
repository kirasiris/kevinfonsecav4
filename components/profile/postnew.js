"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UseDropzone from "./post/postdropzone";

const PostNew = ({
	auth = {},
	token = null,
	object = {},
	params = [],
	searchParams = {},
	revalidateUrl = "",
}) => {
	const router = useRouter();

	const [postData, setPostData] = useState({
		postedto: auth?.userId !== params.id ? params.id : undefined,
		privacy: "public",
		title: "",
		text: "",
		address: "",
		subType: searchParams.subType || undefined,
		files: [],
	});

	const { privacy, title, text, address } = postData;

	const resetForm = () => {
		setPostData({
			postedto: auth?.userId !== params.id ? params.id : undefined,
			privacy: "public",
			title: "",
			text: "",
			address: "",
			subType: searchParams.subType || undefined,
			files: [],
		});
	};

	const randomId = Math.random();

	const addPost = async (e) => {
		e.preventDefault();
		await fetchurl(`/posts`, "POST", "no-cache", {
			...postData,
			commented: true,
			status: "published",
		});
		resetForm();
		router.push(`${revalidateUrl}&new=${randomId}`, { scroll: false });
	};

	return auth?.userId !== undefined ? (
		<form onSubmit={addPost}>
			<div className="card">
				<div className="card-header">
					<div className="float-start">
						<Link
							href={{
								pathname: `/profile/${object?.data?._id}/${object?.data?.username}`,
								query: {
									page: 1,
									limit: 100,
									sort: `-createdAt`,
								},
							}}
						>
							<Image
								src={object?.data?.files?.avatar?.location.secure_location}
								className="rounded-5"
								alt={`${object?.data?.username}'s avatar`}
								width={48}
								height={48}
							/>
						</Link>
					</div>
					<Link
						href={{
							pathname: `/profile/${object?.data?._id}/${object?.data?.username}`,
							query: {
								page: 1,
								limit: 100,
								sort: `-createdAt`,
							},
						}}
					>
						{object?.data?.username}
					</Link>
					<div className="float-end">
						<select
							id="privacy"
							name="privacy"
							className="form-control"
							defaultValue={privacy}
							onChange={(e) => {
								setPostData({
									...postData,
									privacy: e.target.value,
								});
							}}
						>
							<option value="only-me">Only me</option>
							<option value="public">Everyone can see</option>
							<option value="following">People I follow</option>
							<option value="followers">People following me</option>
							<option value="anonymous">Anonymous</option>
						</select>
					</div>
				</div>
				<div className="card-body">
					<input
						id="title"
						name="title"
						defaultValue={title}
						onChange={(e) => {
							setPostData({
								...postData,
								title: e.target.value,
							});
						}}
						type="text"
						className="form-control mb-3"
						placeholder="Untitled"
					/>
					<textarea
						id="text"
						name="text"
						className="form-control"
						rows="5"
						placeholder="Share something new. Now with #hashtags support, YAY!!!"
						defaultValue={text}
						onChange={(e) => {
							setPostData({
								...postData,
								text: e.target.value,
							});
						}}
					/>
					{searchParams.subType === "photos" && (
						<UseDropzone
							auth={auth}
							token={token}
							accepted={{ "image/*": [".png", ".jpeg", ".jpg"] }}
							id="file"
							name="file"
							multipleFiles={true}
							onModel="User"
							object={object?.data}
							objectData={postData}
							setObjectData={setPostData}
						/>
					)}
					{searchParams.subType === "videos" && (
						<UseDropzone
							auth={auth}
							token={token}
							accepted={{ "video/*": [".mp4", ".avi"] }}
							id="file"
							name="file"
							multipleFiles={false}
							onModel="User"
							object={object?.data}
							objectData={postData}
							setObjectData={setPostData}
						/>
					)}
					{searchParams.subType === "audios" && <>Audios</>}
					{searchParams.subType === "files" && <>Files</>}
					{searchParams.subType === "maps" && (
						<input
							id="address"
							name="address"
							defaultValue={address}
							onChange={(e) => {
								setPostData({
									...postData,
									address: e.target.value,
								});
							}}
							type="text"
							className="form-control mt-3"
							placeholder="Enter address"
						/>
					)}
				</div>
				<div className="card-footer">
					<button
						type="submit"
						className="btn btn-secondary btn-sm"
						disabled={title.length > 0 && text.length > 0 ? !true : !false}
					>
						Submit
					</button>
				</div>
			</div>
		</form>
	) : (
		<div className="card">
			<div className="card-header">Sorry! :/</div>
			<div
				className="card-body align-content-center align-items-center card-body d-flex m-auto"
				style={{
					height: "280px",
				}}
			>
				<Link
					href={{
						pathname: `/auth/login`,
						query: {
							returnpage: `/profile/${object?.data?._id}/${object?.data?.username}?page=1&limit=100&sort=-createdAt`,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-secondary btn-sm">Login to Post</a>
				</Link>
			</div>
		</div>
	);
};

export default PostNew;
