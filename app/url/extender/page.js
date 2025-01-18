import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/url/extender/list";
import Globalcontent from "@/layout/content";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getUrls(params) {
	const res = await fetchurl(`/extras/shorturls${params}`, "GET", "no-cache");
	return res;
}

const UrlExtenderIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const shorturls = await getUrls(`?page=${page}&limit=${limit}&sort=${sort}`);

	const addLongUrl = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			text: formData.get("text"),
		};

		await fetchurl(`/extras/shorturls`, "POST", "no-cache", rawFormData);

		revalidatePath(`/url/extender?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<>
			<Header
				title="URL Extender"
				description="Tired of short URLs?. Try to extend them!"
			/>
			<div className="container">
				<div className="row">
					<Globalcontent containerClasses="col-lg-12">
						<div className="d-grid gap-2 mb-4">
							<form action={addLongUrl}>
								<label htmlFor="blog-title" className="form-label">
									Title
								</label>
								<input
									id="blog-title"
									name="title"
									defaultValue="Untitled"
									type="text"
									className="form-control mb-3"
									placeholder=""
								/>
								<label htmlFor="longUrl" className="form-label">
									Long Url
								</label>
								<input
									id="longUrl"
									name="longUrl"
									defaultValue=""
									type="text"
									className="form-control mb-3"
									placeholder=""
								/>
								<label htmlFor="text" className="form-label">
									Text
								</label>
								<MyTextArea
									auth={undefined}
									id="text"
									name="text"
									onModel="ShortUrl"
									advancedTextEditor={false}
									customPlaceholder="No description"
									defaultValue="No description..."
								/>
								<br />
								<FormButtons />
							</form>
						</div>
						<p className="p-3 text-bg-danger">
							Data gets deleted on the 15 of each month
						</p>
						<div className="card rounded-0">
							<List objects={shorturls} searchParams={awtdSearchParams} />
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default UrlExtenderIndex;
