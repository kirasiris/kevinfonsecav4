"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const UpdateConfirmEmail = ({ params, searchParams }) => {
	const router = useRouter();

	const [confirmData, setConfirmData] = useState({
		email: ``,
	});

	const { email } = confirmData;

	const [error, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	const confirmAccount = async (e) => {
		e.preventDefault();
		try {
			setBtnTxt("Submit...");
			const confirmtoken = params.confirmtoken;

			if (!confirmtoken) {
				toast.error("There was an error, please try again");
				router.push("/auth/login");
			}
			await fetchurl(
				`/auth/confirmemail/${confirmtoken}`,
				"PUT",
				"no-cache",
				confirmData
			);
			resetForm();
			toast.success("Email confirmed");
			setBtnTxt(btnText);
			router.push("/auth/login");
		} catch (err) {
			console.log(err);
			setError(true);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			};
		}
	};

	const resetForm = () => {
		setConfirmData({
			email: ``,
		});
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form onSubmit={confirmAccount}>
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							value={email}
							onChange={(e) => {
								setConfirmData({
									...confirmData,
									email: e.target.value,
								});
							}}
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
						<button
							type="submit"
							className="btn btn-secondary btn-sm float-start"
							disabled={email.length > 0 ? !true : !false}
						>
							{btnText}
						</button>
						<button
							type="button"
							className="btn btn-secondary btn-sm float-end"
							onClick={resetForm}
						>
							Reset
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateConfirmEmail;
