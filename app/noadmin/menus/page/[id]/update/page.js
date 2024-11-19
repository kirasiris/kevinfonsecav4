import { fetchurl } from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getPage(params) {
	const res = await fetchurl(`/pages${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdatePage = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const page = await getPage(`/${awtdParams.id}`);

	const upgradePage = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			url: formData.get("url"),
			text: formData.get("text"),
			referrerpolicy: formData.get("referrerpolicy"),
			rel: formData.get("rel"),
			target: formData.get("target"),
			orderingNumber: formData.get("orderingNumber"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
		};
		await fetchurl(`/pages/${awtdParams.id}`, "PUT", "no-cache", rawFormData);
		redirect(`/noadmin/menus/read/${page?.data?.resourceId}`);
	};

	return (
		<form className="row" action={upgradePage}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={page.data.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="url" className="form-label">
					Url
				</label>
				<input
					id="url"
					name="url"
					defaultValue={page.data.url}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={undefined}
					token={undefined}
					id="text"
					name="text"
					onModel="Page"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={page.data.text}
				/>
				<div className="row">
					<div className="col"></div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="referrerpolicy" className="form-label">
							Referrer Policy
						</label>
						<select
							id="referrerpolicy"
							name="referrerpolicy"
							defaultValue={page.data.referrerpolicy}
							className="form-control"
						>
							<option value={`no-referrer`}>No Referrer</option>
							<option value={`no-referrer-when-downgrade`}>
								No Referrer When Downgrade
							</option>
							<option value={`origin`}>Origin</option>
							<option value={`origin-when-cross-origin`}>
								Origin When Cross Origin
							</option>
							<option value={`same-origin`}>Same Origin</option>
							<option value={`strict-origin`}>Strict Origin</option>
							<option value={`strict-origin-when-cross-origin`}>
								String Origin When Cross Origin
							</option>
							<option value={`unsafe-url`}>Unsafe Url</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="rel" className="form-label">
							Rel
						</label>
						<select
							id="rel"
							name="rel"
							defaultValue={page.data.rel}
							className="form-control"
						>
							<option value={`no-referrer`}>No Referrer</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="target" className="form-label">
							Target
						</label>
						<select
							id="target"
							name="target"
							defaultValue={page.data.target}
							className="form-control"
						>
							<option value={`_self`}>Self</option>
							<option value={`_blank`}>Blank</option>
							<option value={`_parent`}>Parent</option>
							<option value={`_top`}>Top</option>
							<option value={`_unfencedTop`}>Unfenced Top</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Ordering Number
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={page.data.orderingNumber}
							min={1}
							max={99}
							type="number"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
					avatarFormat={""}
					status={page.data.status}
					fullWidth={false}
					password={""}
					featured={false}
					commented={page.data.commented.toString()}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multipleFiles={false}
					onModel={"Page"}
					files={[]}
					auth={undefined}
					token={undefined}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdatePage;
