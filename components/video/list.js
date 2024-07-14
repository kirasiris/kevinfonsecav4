import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/video/sidebar";

const List = ({ objects = [], searchParams = {}, categories = [] }) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-8">
					<div className="card">
						<div className="card-header">Animes</div>
						<div className="card-body d-flex flex-wrap p-0 rounded-0">
							{/* Blog list */}
							{objects?.data?.length > 0 ? (
								<>
									{objects.data?.map((video) => (
										<Single key={video._id} object={video} />
									))}
									<hr className="mt-0 mb-0" />
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
								<NothingFoundAlert
									loading={false}
									classNames="alert-dark w-100 rounded-0 m-0 border-0"
								/>
							)}
						</div>
					</div>
				</div>
				<div className="col-lg-4 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
					<Sidebar categories={categories} />
				</div>
			</div>
		</div>
	);
};

export default List;
