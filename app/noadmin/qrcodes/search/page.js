import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import CreateQrCodeForm from "@/forms/noadmin/qrcodes/createqrcodeform";
import List from "@/components/noadmin/qrcodes/list";

async function getQRCodes(params) {
	const res = await fetchurl(`/global/qrcodes${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminQRCodesGeneratorSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const auth = await getUserOnServer();

	const qrcodes = await getQRCodes(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/qrcodes"
				publishedLink="/noadmin/qrcodes/published"
				draftLink="/noadmin/qrcodes/draft"
				scheduledLink="/noadmin/qrcodes/scheduled"
				trashedLink="/noadmin/qrcodes/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<CreateQrCodeForm auth={auth} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/qrcodes"
							pageText="QR Codes"
							addLink=""
							searchOn="/noadmin/qrcodes"
							searchedKeyword={keyword}
							objects={qrcodes}
							searchParams={awtdSearchParams}
							statusFilter=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminQRCodesGeneratorSearchIndex;
