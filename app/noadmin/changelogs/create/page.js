"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import MyTextArea from "@/components/global/mytextarea";

const CreateChangelog = () => {
	const router = useRouter();

	const [changelogData, setChangelogData] = useState({
		title: `Untitled`,
		text: `No description`,
		status: `draft`,
		postType: [`enhancement`],
		version: `1.0.0`,
	});

	const { title, text, status, postType, version } = changelogData;

	const addChangelog = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/changelogs`, changelogData);
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/changelogs`);
		} catch (err) {
			console.log(err);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setChangelogData({
			title: `Untitled`,
			text: `No description`,
			status: `draft`,
			postType: [`enhancement`],
			version: `1.0.0`,
		});
	};

	return (
		<form className="row" onSubmit={addChangelog}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setChangelogData({
							...changelogData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="blog-text multipurpose-textarea" className="form-label">
					Text
				</label>
				<MyTextArea
					id="blog-text"
					name="text"
					value={text}
					objectData={changelogData}
					setObjectData={setChangelogData}
					onModel="Changelog"
					advancedTextEditor={true}
				/>
				<label htmlFor="version" className="form-label">
					Version
				</label>
				<input
					id="version"
					name="version"
					value={version}
					onChange={(e) => {
						setChangelogData({
							...changelogData,
							version: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="postType" className="form-label">
					Post type
				</label>
				<select
					id="postType"
					name="postType"
					value={postType}
					onChange={(e) => {
						const selectedOptions = Array.from(e.target.selectedOptions).map(
							(option) => option.value
						);
						setChangelogData({
							...changelogData,
							postType: selectedOptions,
						});
					}}
					className="form-control"
					multiple
				>
					<option value={`bug`}>Bug</option>
					<option value={`dependencies`}>Dependencies</option>
					<option value={`duplicate`}>Duplicate</option>
					<option value={`enhancement`}>Enhancement</option>
					<option value={`help`}>Help</option>
					<option value={`invalid`}>Invalid</option>
					<option value={`question`}>Question</option>
					<option value={`wontfix`}>Wontfix</option>
				</select>
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					value={status}
					onChange={(e) => {
						setChangelogData({
							...changelogData,
							status: e.target.value,
						});
					}}
					className="form-control"
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={title.length > 0 && text.length > 0 ? !true : !false}
				>
					Submit
				</button>
				<button
					type="button"
					className="btn btn-secondary btn-sm float-end"
					onClick={resetForm}
				>
					Reset
				</button>
			</div>
		</form>
	);
};

export default CreateChangelog;