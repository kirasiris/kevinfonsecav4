import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import PageList from "@/components/noadmin/menus/pagelist";

async function getMenu(params) {
	const res = await fetchurl(`/global/menus${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getPages(params) {
	const res = await fetchurl(`/global/pages${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const ReadMenu = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const menu = await getMenu(`/${awtdParams.id}`);
	const pages = await getPages(
		`?resourceId=${menu?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<div className="row">
				<div className="col-lg-12">
					<div className="card rounded-0 mb-3">
						<div className="card-header">{menu?.data?.title || "Untitled"}</div>
						<div className="card-body">
							<ParseHtml text={menu?.data?.text} />
						</div>
					</div>
					<div className="card rounded-0">
						<PageList
							allLink={`/noadmin/menus/read/${menu?.data?._id}`}
							pageText="Pages"
							addLink={`/noadmin/menus/page/${menu?.data?._id}/create`}
							searchOn={`/noadmin/menus/read/${menu?.data?._id}`}
							searchedKeyword=""
							objects={pages}
							searchParams={awtdSearchParams}
							statusFilter=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReadMenu;
