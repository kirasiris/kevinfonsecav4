import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";

const List = ({ objects = [], searchParams = {} }) => {
	const groupByDate = objects?.data?.reduce((groups, changelog) => {
		const date = changelog.createdAt.split("T")[0];
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(changelog);
		return groups;
	}, {});

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{Object.entries(groupByDate).map(([date, objects]) => (
									<div key={date}>
										<p className="text-center my-3">{date}</p>
										{objects.map((changelog) => (
											<Single key={changelog._id} object={changelog} />
										))}
									</div>
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
				</div>
			</div>
		</div>
	);
};

export default List;
