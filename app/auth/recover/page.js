"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";

const Recover = ({ params, searchParams }) => {
	const router = useRouter();
	const { auth } = useContext(AuthContext);

	auth.isAuthenticated && router.push("/");

	const [recoverData, setRecoverData] = useState({
		email: "",
	});

	const { email } = recoverData;

	const [error, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	const recoverAccount = async (e) => {
		e.preventDefault();
		try {
			setBtnTxt("Submit...");
			await fetchurl(`/auth/forgotpassword`, "POST", "no-cache", {
				...recoverData,
				website: "beFree",
			});
			resetForm();
			toast.success(
				`An email has been sent to ${recoverData.email} associated with this account.`
			);
			setBtnTxt(btnText);
			searchParams?.returnpage
				? router.push(searchParams.returnpage)
				: router.push(`/auth/login`);
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
		setRecoverData({
			email: "",
		});
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form onSubmit={recoverAccount}>
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							value={email}
							onChange={(e) => {
								setRecoverData({
									...recoverData,
									email: e.target.value,
								});
							}}
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
						<br />
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

export default Recover;
