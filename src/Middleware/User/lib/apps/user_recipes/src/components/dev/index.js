import React from "react";
import { AdjustmentsVerticalIcon, ArrowPathIcon } from '@heroicons/react/20/solid'

export default function Example() {
	if (location.hostname !== "localhost"){
		return;
	}
	
	return (
		<footer className="bg-white shadow sm:rounded-lg my-6">
			<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6">
					<div className="flex flex-shrink-0 items-center">
						<AdjustmentsVerticalIcon className="h-5 w-5" aria-hidden="true"/>
					</div>
				</div>
				<div className="mt-8 md:mt-0">
					<div className="mr-4">
						<button
							onClick={()=>{localStorage.clear();location.reload();}}
							type="button"
							className="relative inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
						>
							<ArrowPathIcon className="h-5 w-5" aria-hidden="true"/>
						</button>
					</div>
				</div>
			</div>
		</footer>
	)
}