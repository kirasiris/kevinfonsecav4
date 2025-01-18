import { getUserOnServer } from "@/helpers/setTokenOnServer";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/forum/sidebar";
import Globalcontent from "@/layout/content";
import Form from "@/app/forum/form";

const List = async ({
	featured = {},
	objects = [],
	params = {},
	searchParams = {},
}) => {
	const auth = await getUserOnServer();

	return (
		<div className="container">
			<div className="row">
				<Globalcontent>
					{auth?.userId !== undefined &&
						params.category !== undefined &&
						params.subcategory !== undefined && (
							<Form params={params} searchParams={searchParams} />
						)}
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} fullWidth={true} />
						))}
					{/* Blog list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								<ul className="list-group">
									{objects.data?.map((forum) => (
										<Single key={forum._id} object={forum} />
									))}
								</ul>
								<NumericPagination
									totalPages={
										objects?.pagination?.totalpages ||
										Math.ceil(objects?.data?.length / searchParams.limit)
									}
									searchParams={searchParams}
									siblings={1}
								/>
							</>
						) : (
							<NothingFoundAlert />
						)}
					</div>
				</Globalcontent>
				<Sidebar />
			</div>
		</div>
	);
};

export default List;
