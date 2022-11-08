import React from "react";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function Example() {
	return (
		<Disclosure as="nav" className="bg-white shadow">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex">
								<div className="flex flex-shrink-0 items-center">
									<img
										className="block h-8 w-auto"
										src="https://www.grillfuerst.de/magazin/wp-content/uploads/2022/09/Logo.svg"
										alt="Grillfürst"
									/>
								</div>
							</div>
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<button
										type="button"
										className="relative inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-black hover:border-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
										<span>Neues Rezept</span>
									</button>
								</div>
								<div className="ml-4 flex flex-shrink-0 items-center">
									<button
										type="button"
										className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										<img
											className="h-8 w-8 rounded-full"
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</Disclosure>
	)
}