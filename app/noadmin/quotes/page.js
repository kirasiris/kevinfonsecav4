import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/quotes/list";
import CreateQuoteForm from "@/forms/noadmin/quotes/createquoteform";

async function getQuotes(params) {
	const res = await fetchurl(`/global/quotes${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminQuotesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const quotes = await getQuotes(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/quotes"
				publishedLink="/noadmin/quotes/published"
				draftLink="/noadmin/quotes/draft"
				scheduledLink=""
				trashedLink="/noadmin/quotes/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<CreateQuoteForm />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/quotes"
							pageText="Quotes"
							addLink="/noadmin/quotes"
							searchOn="/noadmin/quotes"
							searchedKeyword=""
							objects={quotes}
							searchParams={awtdSearchParams}
							statusFilter=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminQuotesIndex;
