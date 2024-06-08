import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Link from "next/link";

async function getMenu(params) {
	const res = await fetchurl(`/menus${params}`, "GET", "no-cache");
	return res;
}

async function getPages(params) {
	const res = await fetchurl(`/pages${params}`, "GET", "no-cache");
	return res;
}

const ReadMenu = async ({ params, searchParams }) => {
	const menu = await getMenu(`/${params.id}`);
	const pages = await getPages(
		`?resourceId=${menu?.data?._id}&sort=orderingNumber`
	);

	return (
		<div className="row">
			<div className="col-lg-12">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{menu?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={menu?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Pages</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/menus/page/${menu?.data?._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">Add page</a>
								</Link>
							</div>
						</div>
					</div>
					{pages?.data?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
						>
							{pages?.data?.map((page, index) => (
								<li key={page._id} className={`list-group-item`}>
									<div className="float-start">
										<Link
											href={{
												pathname: `/noadmin/pages/update/${page._id}`,
												query: {
													returnpage: `/noadmin/menus/read/${menu?.data?._id}`,
												},
											}}
											passHref
											legacyBehavior
										>
											<a>
												<span className="badge bg-secondary me-1">
													{page.orderingNumber}
												</span>
												{page.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										<span className="badge bg-info me-1">
											{page.referrerpolicy}
										</span>
										<span className="badge bg-secondary me-1">
											{page.rel}&nbsp;Views
										</span>
										<span className="badge bg-dark me-1">{page.target}</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="alert alert-danger rounded-0  m-0 border-0">
							Nothing&nbsp;found
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReadMenu;
