"use client";
import Single from "../profile/single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";

const List = ({ objects = [], searchParams = {} }) => {
	return (
		<div className="container">
			<div className="row">
				<Globalcontent containerClasses="col-lg-12">
					{/* User list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((user) => (
									<Single key={user._id} object={user.user} />
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
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default List;