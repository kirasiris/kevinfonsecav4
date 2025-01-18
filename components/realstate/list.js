import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/realstate/sidebar";
import Globalcontent from "@/layout/content";

const List = ({ featured = {}, objects = [], searchParams = {} }) => {
	return (
		<div className="container">
			<div className="row">
				<Globalcontent>
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} />
						))}
					{/* Blog list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((realstate) => (
									<Single key={realstate._id} object={realstate} />
								))}
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
