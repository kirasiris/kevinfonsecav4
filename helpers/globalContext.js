"use client";
import { useState, createContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { setAuthToken } from "./utilities";
import { getAuthTokenOnServer } from "./setTokenOnServer";

export const AuthContext = createContext();

const API_URL = `http://localhost:5000`;

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		token: ``,
		isAuthenticated: false,
		user: null,
		role: null,
	});

	const resetSetAuth = () => {
		setAuth({ token: ``, isAuthenticated: false, user: null, role: null });
	};

	const loadUser = async () => {
		try {
			const res = await axios.get(`/auth/me`);
			console.log("Holas from loadUser function call", res?.data?.data);
			return res?.data;
		} catch (err) {
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
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const logout = async () => {
		try {
			// localStorage.removeItem("xAuthToken");
			// document.cookie = `xAuthToken='';expires=Thu, 01 Jan 1970 00:00:01 GMT`;
			// await axios.get(`/auth/logout`);
			// resetSetAuth();
			// router.push(`/auth/login`);
			console.log("Loging out from globalContext...");
		} catch (err) {
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
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const token = auth && auth.token ? auth.token : "";
	const secondarytoken = getAuthTokenOnServer();
	axios.defaults.baseURL = `${API_URL}/api/v1/`;
	axios.defaults.headers.common["Content-Type"] = `application/json`;
	axios.defaults.headers.common["Accept"] = `application/json`;
	axios.defaults.headers["Authorization"] = `Bearer ${
		token ? token : secondarytoken.value
	}`;
	axios.defaults.headers.common["Authorization"] = `Bearer ${
		token ? token : secondarytoken.value
	}`;

	axios.interceptors.response.use(
		async (res) => {
			return res;
		},
		async (err) => {
			let res = err?.response;

			if (res?.status === 401 && res?.config && !res?.config?._isRetryRequest) {
				await logout();
				resetSetAuth();
			}
		}
	);

	useEffect(() => {
		const localToken = async () => {
			let token = localStorage.getItem("xAuthToken");
			setAuthToken(token);
			if (token) {
				await axios
					.get(`/auth/me`)
					.then((res) => {
						return setAuth({
							token: token,
							isAuthenticated: true,
							user: res.data.data,
							role: localStorage.setItem(
								"isFounder",
								res.data.data.role.includes("founder")
							),
						});
					})
					.catch((err) => {
						// resetSetAuth();
					});
			}
		};
		localToken();
	}, []);

	/*
	 *
	 * MOST OF THE PAGES WILL USE THIS. THATS THE REASON OF MAKING THIS REQUEST
	 * AS A GLOBAL CONTEXT
	 *
	 */
	const [categories, setCategories] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentResults, setCurrentResults] = useState(0);
	const [totalResults, setTotalResults] = useState({
		blogs: 0,
		categories: 0,
		changelogs: 0,
		contacts: 0,
		comments: 0,
		courses: 0,
		emails: 0,
		files: 0,
		lessons: 0,
		logs: 0,
		newsletters: 0,
		playlists: 0,
		posts: 0,
		quotes: 0,
		reports: 0,
		secrets: 0,
		shorturls: 0,
		themes: 0,
		users: 0,
		videos: 0,
		ytdownloads: 0,
	});
	const [files, setFiles] = useState({
		media: [],
		previews: [],
		uploaded: [],
		mediaLength: 0,
		selected: null,
		showMediaModal: false,
		playing: null,
		playlist: [],
	});

	const fetchCategories = async (params = "") => {
		try {
			const res = await axios.get(`/categories${params}`);
			setCategories(res?.data?.data);
			setTotalResults({
				...totalResults,
				categories: res?.data?.countAll,
			});
		} catch (err) {
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

	useEffect(() => {
		fetchCategories();
	}, [setCategories]);

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				categories,
				setCategories,
				totalPages,
				setTotalPages,
				currentResults,
				setCurrentResults,
				totalResults,
				setTotalResults,
				files,
				setFiles,
				loadUser,
				logout,
				fetchCategories,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
