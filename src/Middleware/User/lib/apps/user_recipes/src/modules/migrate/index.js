export const RecipeMigrator = (r) => {
	return r;
	console.log("RecipeMigrator");
	// Perform your migration logic here
	
	// fix legacy step images
	r.steps.map((step) => {
		if(step.hasOwnProperty('images') === false){
			step.images = [];
			delete step.image;
		}
		return step;
	});
	
	// fix null|undefined step images
	r.steps.map((step) => {
		step.images = step.images.filter(img => img);
		return step;
	});
	
	return r;
};

