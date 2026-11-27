import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/shorturls/list";
import UpdateShortUrlForm from "@/forms/noadmin/shorturls/updateshorturlform";

async function getShortUrls(params) {
	const res = await fetchurl(
		`/global/extras/tools/urls/regression${params}`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const UpdateShortUrl = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const [shorturl, shorturls] = await Promise.all([
		getShortUrls(`/${awtdParams.id}`),
		getShortUrls(`?page=${page}&limit=${limit}&sort=${sort}&postType=short`),
	]);

	if (!shorturl?.success) {
		notFound();
	}

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/shorturls"
				publishedLink="/noadmin/shorturls/published"
				draftLink="/noadmin/shorturls/draft"
				scheduledLink="/noadmin/shorturls/scheduled"
				trashedLink="/noadmin/shorturls/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<UpdateShortUrlForm
						currentpage={`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`}
						object={shorturl}
					/>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/shorturls"
							pageText="Short Urls"
							addLink="/noadmin/shorturls/create"
							searchOn="/noadmin/shorturls"
							searchedKeyword=""
							objects={shorturls}
							searchParams={awtdSearchParams}
							postType="short"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateShortUrl;
