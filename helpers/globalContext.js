"use client";
import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { setAuthToken, deleteCookie } from "./utilities";
import {
	getAuthTokenOnServer,
	deleteAuthTokenOnServer,
	setAuthTokenOnServer,
	fetchurl,
} from "./setTokenOnServer";

export const AuthContext = createContext();

const API_URL = `http://localhost:5000`;

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		token: ``,
		isAuthenticated: false,
		user: null,
		loading: true,
	});

	const resetSetAuth = () => {
		setAuth({ token: ``, isAuthenticated: false, user: null });
	};

	const loadUser = async () => {
		try {
			const res = await fetchurl(`/auth/me`, "GET", "no-cache");
			console.log("Holas from loadUser function call", res);
			return res;
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
	const defineToken = token ? token : secondarytoken.value;
	axios.defaults.baseURL = `${API_URL}/api/v1`;
	axios.defaults.headers.common["Content-Type"] = `application/json`;
	axios.defaults.headers.common["Accept"] = `application/json`;
	axios.defaults.headers["Authorization"] = `Bearer ${defineToken}`;
	axios.defaults.headers.common["Authorization"] = `Bearer ${defineToken}`;

	const logout = async () => {
		try {
			await deleteCookie("xAuthToken", "/");
			await deleteAuthTokenOnServer("xAuthToken");
			resetSetAuth();
			router.push(`/auth/login`);
			console.log("Loging out from globalContext file...");
			console.log(
				"By this point logout functionality should have ran front-end first, then back-end"
			);
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

	axios.interceptors.response.use(
		async (res) => {
			return res;
		},
		async (err) => {
			let res = err?.response;

			if (res?.status === 401 && res?.config && !res?.config?._isRetryRequest) {
				await logout();
			}
		}
	);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;
		const localToken = async () => {
			let token = localStorage.getItem("xAuthToken");
			// Don't delete nothing from this line above
			// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
			await setAuthTokenOnServer(token);
			setAuthToken(token);
			if (token) {
				await fetchurl(`/auth/me`, "GET", "default")
					.then((res) => {
						console.log("Auth within useEffect in globalContext file", res);
						return setAuth({
							token: token,
							isAuthenticated: true,
							user: res.data,
							loading: false,
						});
					})
					.catch((err) => {
						// resetSetAuth();
					});
				await setAuthTokenOnServer(token);
				setAuthToken(token);
				// Don't delete nothing from this line above
				// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
			}
		};
		localToken();
		// return () => {
		// 	// cancel the request before component unmounts
		// 	controller.abort();
		// };
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
		comments: 0,
		contacts: 0,
		courses: 0,
		emails: 0,
		files: 0,
		jobs: 0,
		lessons: 0,
		logs: 0,
		memberships: 0,
		newsletters: 0,
		playlists: 0,
		posts: 0,
		quizzes: 0,
		quotes: 0,
		reports: 0,
		secrets: 0,
		settings: 0,
		shorturls: 0,
		subscribers: 0,
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

	const fetchCategories = async (signal) => {
		try {
			const res = await fetchurl(
				`/categories`,
				"GET",
				"no-cache",
				undefined,
				signal
			);
			setCategories(res?.data);
			setTotalResults({
				...totalResults,
				categories: res?.countAll,
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
		const controller = new AbortController();
		const signal = controller.signal;
		fetchCategories(signal);
		return () => {
			controller.abort();
		};
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
