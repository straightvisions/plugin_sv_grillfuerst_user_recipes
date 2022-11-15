const root = 'https://relaunch-magazin.grillfuerst.de/wp-json';

export default {
	
	"getRecipes": root + '/recipes', // GET
	"getRecipesByUser": root + '/recipes/user/', // GET + {user_id}
	"getRecipe": root + '/recipes/', // GET + {recipe_id}
	"createRecipe": root + '/recipes/user/', // POST + {user_id}
	"updateRecipe": root * '/recipes/', // PUT + {recipe_id}

}