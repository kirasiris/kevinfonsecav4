import Image from "next/image";
import Link from "next/link";
import FormButtons from "../global/formbuttons";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import { revalidatePath } from "next/cache";

const PostNew = async ({
	auth = {},
	object = {},
	params = {},
	searchParams = {},
}) => {
	const addPost = async (formData) => {
		"use server";
		const rawFormData = {
			privacy: formData.get("privacy"),
			title: formData.get("title"),
			text: formData.get("text"),
			address: formData.get("address"),
			subType: searchParams.subType || undefined,
		};
		console.log("data from postnew file", rawFormData);
		await fetchurl(`/posts`, "POST", "no-cache", rawFormData);
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	return auth?.userId !== undefined ? (
		<form action={addPost}>
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
							passHref
							legacyBehavior
						>
							<a>
								<Image
									src={object?.data?.files?.avatar?.location.secure_location}
									className="rounded-5"
									alt={`${object?.data?.username}'s avatar`}
									width={48}
									height={48}
								/>
							</a>
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
						passHref
						legacyBehavior
					>
						{object?.data?.username}
					</Link>
					<div className="float-end">
						<select
							id="privacy"
							name="privacy"
							className="form-control"
							defaultValue="public"
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
						defaultValue=""
						type="text"
						className="form-control"
						placeholder="Untitled"
					/>
					<br />
					{console.log(auth)}
					<MyTextArea
						auth={auth}
						id="text"
						name="text"
						onModel="Post"
						advancedTextEditor={false}
						customPlaceholder="Share something new. Now with #hashtags support, YAY!!!"
						defaultValue=""
					/>
					{searchParams.subType === "maps" && (
						<input
							id="address"
							name="address"
							defaultValue=""
							type="text"
							className="form-control mt-3"
							placeholder=""
						/>
					)}
				</div>
				<div className="card-footer">
					<FormButtons />
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
							returnpage: `/profile/${object?.data?._id}/`,
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
