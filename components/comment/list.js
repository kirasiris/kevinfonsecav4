"use client";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";

const List = ({ objects = [], searchParams = {} }) => {
	return (
		<section className="py-5">
			<div className="container">
				<div className="row">
					<Globalcontent>
						{/* Blog list */}
						<div className="row">
							{objects?.data?.length > 0 ? (
								<>
									{objects.data?.map((comment) => (
										<Single key={comment._id} object={comment} />
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
				</div>
			</div>
		</section>
	);
};
export default List;
