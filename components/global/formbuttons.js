"use client";
import { useFormStatus } from "react-dom";

const FormButtons = ({ classList = "float-start" }) => {
	const { pending } = useFormStatus();

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<>
			<button
				type="submit"
				className={`btn btn-secondary btn-sm ${classList}`}
				aria-disabled={pending}
				disabled={pending}
			>
				{pending ? "Processing..." : "Submit"}
			</button>
			<button
				type="reset"
				className="btn btn-secondary btn-sm float-end"
				onClick={resetForm}
			>
				Reset
			</button>
		</>
	);
};

export default FormButtons;
