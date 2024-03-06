import Link from "next/link";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/secret/sidebar";
import Globalcontent from "@/layout/content";

const List = ({ objects = [], searchParams = {} }) => {
	return (
		<div className="container mt-4">
			<div className="row">
				<Globalcontent>
					<div className="d-grid gap-2 mb-4">
						<Link
							href={{
								pathname: `/secret/create`,
								query: {
									returnpage: `/secret?page=1&limit=10&sort=-createdAt`,
								},
							}}
							passHref
							legacyBehavior
						>
							<a className="btn btn-secondary btn-sm">Create</a>
						</Link>
					</div>
					{/* Blog list */}
					{objects?.data?.length > 0 ? (
						<>
							{objects.data?.map((secret) => (
								<Single key={secret._id} object={secret} />
							))}
							<NumericPagination
								totalPages={
									objects?.pagination?.totalpages ||
									Math.ceil(objects?.data?.length / searchParams.limit)
								}
								page={searchParams.page}
								limit={searchParams.limit}
								keyword={searchParams.keyword}
								sortby="-createdAt"
								siblings={1}
							/>
						</>
					) : (
						<NothingFoundAlert />
					)}
				</Globalcontent>
				<Sidebar />
			</div>
		</div>
	);
};

export default List;
