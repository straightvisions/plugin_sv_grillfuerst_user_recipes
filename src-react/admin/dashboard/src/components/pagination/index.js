import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function Pagination(props) {
	const {
		pages = 0,
		rows = 0,
		page = 1,
		showingCount = 0,
		onChange = () => {}
	} = props;
	
	if(pages <= 0){
		return (
			<></>
		);
	}
	
	let pageLinks= () => {
		let items = [];
		for(let i=0; i < pages;i++){
			let className = 'relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20';
			if(i+1 === page) className += ' border border-indigo-500 bg-indigo-50';
			items.push(<a
				key={i+1}
				href="#"
				aria-current="page"
				className={className}
				onClick={e => onChange(i+1)}
			>
				{i+1}
			</a>);
		}
	
		return items;
	}

	const handlePrev = (e) => {
		return page > 1 ? onChange(page-1) : null;
	}
	
	const handleNext = (e) => {
		return page < pages ? onChange(page+1) : null;
	}
	
	return (
		<>
			<div className="flex flex-1 justify-between sm:hidden">
				<a
					onClick={handlePrev}
					className="cursor-pointer relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Previous
				</a>
				<div>
					<p className="text-sm text-gray-700">
						<span className="font-medium">{showingCount}</span> of{' '}
						<span className="font-medium">{rows}</span> results
					</p>
				</div>
				<a
					onClick={handleNext}
					className="cursor-pointer relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Next
				</a>
			</div>
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700">
						Showing  <span className="font-medium">{showingCount}</span> of{' '}
						<span className="font-medium">{rows}</span> results
					</p>
				</div>
				<div>
					<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
						<a
							onClick={handlePrev}
							className="cursor-pointer relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
						>
							<span className="sr-only">Previous</span>
							<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
						</a>
						{pageLinks()}
						<a
							onClick={handleNext}
							className="cursor-pointer relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
						>
							<span className="sr-only">Next</span>
							<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
						</a>
					</nav>
				</div>
			</div>
		</>
	)
}