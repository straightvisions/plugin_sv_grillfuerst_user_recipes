import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconLogo } from "../icons";
import user from "../../modules/user";
import routes from "../../models/routes";

/* @todo replace this with modern context providers */
const navigation = [
	{
		name: "Dashboard",
		href: routes.config.appURL,
	},
	{
		name: "Export",
		href: routes.config.appURL + '/export/',
	},
];

const userNavigation = [
	{ name: "Sign out", href: "/wp-login.php?action=logout" },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function NavigationBar() {
	const _user = user.get();
	const [currentPath, setCurrentPath] = useState("");
	
	useEffect(() => {
		const normalizedPath = window.location.pathname; // Get only the pathname from the URL
		setCurrentPath(normalizedPath);
	}, []);
	
	const getHrefPathname = (url) => {
		try {
			return new URL(url).pathname; // Extract the pathname portion of the full URL
		} catch {
			return url; // In case it's not a valid URL, return it as-is
		}
	};
	
	return (
		<Disclosure as="nav" className="bg-white shadow-sm">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex">
								<div className="flex flex-shrink-0 items-center">
									<IconLogo />
								</div>
								<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
									{navigation.map((item) => {
										const isActive = getHrefPathname(item.href) === currentPath;
										
										return (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													isActive
														? "border-indigo-500 text-gray-900"
														: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
													"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
												)}
												aria-current={isActive ? "page" : undefined}
											>
												{item.name}
											</a>
										);
									})}
								</div>
							</div>
							<div className="-mr-2 flex items-center sm:hidden">
								{/* Mobile menu button */}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>
					
					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 pt-2 pb-3">
							{navigation.map((item) => {
								const isActive = getHrefPathname(item.href) === currentPath;
								
								return (
									<Disclosure.Button
										key={item.name}
										as="a"
										href={item.href}
										className={classNames(
											isActive
												? "bg-indigo-50 border-indigo-500 text-indigo-700"
												: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
											"block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
										)}
										aria-current={isActive ? "page" : undefined}
									>
										{item.name}
									</Disclosure.Button>
								);
							})}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
