import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";

const List = ({ objects = [], searchParams = {} }) => {
	return objects?.data?.length > 0 ? (
		<>
			<ul className="list-group list-group-flush">
				{objects.data?.map((url) => (
					<Single key={url._id} object={url} />
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
		<NothingFoundAlert
			classList="alert-dark rounded-0 m-0 border-0"
			text="Nothing found"
		/>
	);
};

export default List;
