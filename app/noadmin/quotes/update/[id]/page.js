import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/quotes/list";
import UpdateQuoteForm from "@/forms/noadmin/quotes/updatequoteform";

async function getQuotes(params) {
	const res = await fetchurl(`/global/quotes${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const UpdateQuote = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const [quote, quotes] = await Promise.all([
		getQuotes(`/${awtdParams.id}`),
		getQuotes(`?page=${page}&limit=${limit}&sort=${sort}`),
	]);

	if (!quote?.success) {
		notFound();
	}

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/quotes"
				publishedLink="/noadmin/quotes/published"
				draftLink="/noadmin/quotes/draft"
				scheduledLink="/noadmin/quotes/scheduled"
				trashedLink="/noadmin/quotes/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<UpdateQuoteForm
						currentpage={`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`}
						object={quote}
					/>
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
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateQuote;
