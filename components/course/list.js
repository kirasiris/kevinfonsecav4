import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
// import Sidebar from "@/layout/blog/sidebar";

const List = ({ featured = {}, objects = [], searchParams = {} }) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} />
						))}
					{/* Course list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((course) => (
									<Single key={course._id} object={course} />
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
									postType="blog"
								/>
							</>
						) : (
							<NothingFoundAlert />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default List;
