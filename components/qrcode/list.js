"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalsidebar from "@/layout/sidebar";
import Globalcontent from "@/layout/content";
import CreateQrCodeForm from "@/forms/qrcode/createqrcodeform";

const List = ({ object = {}, objects = [], searchParams = {} }) => {
	const router = useRouter();

	const [searchEmailParams, setEmailSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchEmailParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(`/qrcode/search?keyword=${keyword}`);
	};

	return (
		<section className="py-5">
			<div className="container-fluid">
				<div className="row">
					<Globalsidebar>
						<CreateQrCodeForm auth={undefined} object={object} />
					</Globalsidebar>
					<Globalcontent containerClasses="col-lg-8">
						<div className="card rounded-0 mb-3">
							<div className="card-header">
								<div className="d-flex align-items-center">
									<button className="btn btn-link btn-sm">
										Find your URLs:
									</button>
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
										{objects.data?.map((qrcode) => (
											<Single key={qrcode._id} object={qrcode} />
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
					</Globalcontent>
				</div>
			</div>
		</section>
	);
};

export default List;
