"use client";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Image from "next/image";
import { toast } from "react-toastify";

const List = ({ auth = {}, objects = [] }) => {
	// Build initials as a fallback when there's no avatar
	const getInitials = (name = "") =>
		name
			.split(" ")
			.map((n) => n[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("")
			.toUpperCase();

	return (
		<div className="card">
			<div className="card-header">Referral&nbsp;Program</div>
			<div className="card-body">
				<label htmlFor="referralcode" className="form-label">
					Your&nbsp;Referral&nbsp;Code:
				</label>
				<div className="input-group mb-3">
					<input
						id="referralcode"
						name="referralcode"
						defaultValue={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/register?referral=${auth?.data?.referralLinks?.myReferralCode}`}
						type="text"
						className="form-control"
						disabled
						placeholder="1A2B3C4D"
					/>
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={() => {
							navigator.clipboard.writeText(
								`${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/register?referral=${auth?.data?.referralLinks?.myReferralCode}`,
							);
							toast.success("Referral link copied to clipboard!", "bottom");
						}}
					>
						Copy
					</button>
				</div>
				<hr />
				{objects.length > 0 ? (
					<>
						<div className="d-flex justify-content-between align-items-center mb-2">
							<h6 className="mb-0">Referred Users</h6>
							<span className="badge bg-primary rounded-pill">
								{auth?.data?.referralLinks?.referredUsers?.length || 0}
							</span>
						</div>
						<ul className="list-group list-group-flush">
							{objects.map((object) => {
								const avatar = object?.files?.avatar?.location?.secure_location;
								return (
									<li
										key={object._id}
										className="list-group-item d-flex align-items-center px-0 py-3"
									>
										{avatar ? (
											<Image
												src={avatar || "/placeholder.svg"}
												className="rounded-circle me-3"
												alt={object?.name || object?.username}
												width={44}
												height={44}
												style={{ objectFit: "cover" }}
											/>
										) : (
											<div
												className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
												style={{
													width: 44,
													height: 44,
													fontSize: 14,
													fontWeight: 600,
												}}
											>
												{getInitials(object?.name || object?.username || "?")}
											</div>
										)}

										<div className="flex-grow-1 min-w-0">
											<div className="d-flex align-items-center">
												<h6 className="mb-0 text-truncate me-2">
													{object?.name || object?.username}
												</h6>
												{object?.username && (
													<small className="text-muted">
														@{object.username}
													</small>
												)}
											</div>
											<small className="text-muted text-truncate d-block">
												{object?.email}
											</small>
										</div>

										<span className="badge bg-success-subtle text-success rounded-pill ms-2">
											Joined
										</span>
									</li>
								);
							})}
						</ul>
					</>
				) : (
					<NothingFoundAlert text="Share your code to start earning rewards!" />
				)}
			</div>
		</div>
	);
};

export default List;
