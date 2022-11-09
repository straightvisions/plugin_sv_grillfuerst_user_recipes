import React from "react";

export default function Example() {
	return (
		<footer className="bg-white shadow sm:rounded-lg my-6">
			<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6">
					<div className="flex flex-shrink-0 items-center">
						<a href="https://www.grillfuerst.de" target="_blank">
							<img
								className="block h-8 w-auto"
								src="https://www.grillfuerst.de/magazin/wp-content/uploads/2022/09/Logo.svg"
								alt="Grillfürst"
							/>
						</a>
					</div>
				</div>
				<div className="mt-8 md:mt-0">
					<p className="text-center text-base text-gray-400"><a href="https://www.grillfuerst.de/Impressum.php" target="_blank">Impressum</a></p>
				</div>
			</div>
		</footer>
	)
}
