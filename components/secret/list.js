import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/secret/sidebar";
import Globalcontent from "@/layout/content";
import Form from "@/app/secret/form";

const List = ({ objects = [], searchParams = {} }) => {
	return (
		<div className="container mt-4">
			<div className="row">
				<Globalcontent>
					<Form searchParams={searchParams} />
					{/* Blog list */}
					{objects?.data?.length > 0 ? (
						<>
							{objects.data?.map((secret) => (
								<Single key={secret._id} object={secret} />
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
				</Globalcontent>
				<Sidebar />
			</div>
		</div>
	);
};

export default List;
