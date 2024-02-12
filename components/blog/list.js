import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/blog/sidebar";

const List = ({
	featured = {},
	objects = [],
	searchParams = {},
	categories = [],
	quotes = [],
}) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-8">
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} fullWidth={true} />
						))}
					{/* Blog list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((blog) => (
									<Single key={blog._id} object={blog} />
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
				<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
					<Sidebar quotes={quotes} categories={categories} />
				</div>
			</div>
		</div>
	);
};

export default List;
