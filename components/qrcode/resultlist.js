import Single from "./resultsingle";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";

const List = ({ objects = [], searchParams = {} }) => {
	return (
		<div className="container">
			<div className="row">
				<Globalcontent containerClasses="col-lg-12">
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								<ul className="list-group">
									{objects.data?.map((result) => (
										<Single key={result._id} object={result} />
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
			</div>
		</div>
	);
};

export default List;
