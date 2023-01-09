const root = 'https://relaunch-magazin.grillfuerst.de/wp-json/sv-grillfuerst-user-recipes/v1';

export default {
	
	"getRecipes": root + '/recipes', // GET
	"getRecipesByUser": root + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": root + '/recipes/', // GET + {recipe_id}
	"updateRecipe": root + '/recipes/', // PUT + {recipe_id}
	"getIngredients": root + '/recipes/ingredients', // GET
	"getMenuTypes": root + '/recipes/menutypes', // GET
	"getKitchenStyles": root + '/recipes/kitchenstyles', // GET

}
