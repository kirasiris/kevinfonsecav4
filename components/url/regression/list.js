"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalsidebar from "@/layout/sidebar";
import Globalcontent from "@/layout/content";
import CreateShortUrlForm from "@/forms/url/regression/createshorturlform";

const List = ({ objects = [], searchParams = {} }) => {
	const router = useRouter();

	const [searchEmailParams, setEmailSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchEmailParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(`/url/regression/search?keyword=${keyword}`);
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<Globalsidebar>
					<CreateShortUrlForm
						auth={undefined}
						currentpage={`/url/regression?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`}
					/>
				</Globalsidebar>
				<Globalcontent containerClasses="col-lg-8">
					<div className="card rounded-0 mb-3">
						<div className="card-header">
							<div className="d-flex align-items-center">
								<button className="btn btn-link btn-sm">Find your URLs:</button>
								<form
									onSubmit={searchData}
									className="d-none d-md-block d-lg-block d-xl-block d-xxl-block"
								>
									<input
										id="keyword"
										name="keyword"
										value={keyword}
										onChange={(e) => {
											setEmailSearchParams({
												...searchEmailParams,
												keyword: e.target.value,
											});
										}}
										type="text"
										className="form-control"
										placeholder="Enter email"
									/>
								</form>
							</div>
						</div>
						{objects?.data?.length > 0 ? (
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
						)}
					</div>
					<p className="p-3 text-bg-danger">
						Data gets deleted on the 15 of each month
					</p>
				</Globalcontent>
			</div>
		</div>
	);
};

export default List;
