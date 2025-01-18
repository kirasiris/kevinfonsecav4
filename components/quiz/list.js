import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/quiz/sidebar";
import Globalcontent from "@/layout/content";

const List = ({
	featured = {},
	objects = [],
	searchParams = {},
	categories = [],
}) => {
	return (
		<div className="container">
			<div className="row">
				<Globalcontent>
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} fullWidth={true} />
						))}
					{/* Blog list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((quiz) => (
									<Single key={quiz._id} object={quiz} />
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
				<Sidebar categories={categories} />
			</div>
		</div>
	);
};

export default List;
