const root = 'https://relaunch-magazin.grillfuerst.de/wp-json/sv-grillfuerst-user-recipes/v1';

export default {
	
	"login": 'https://relaunch-magazin.grillfuerst.de/community-rezepte/login',
	"isLoggedIn": root + '/users/is_logged_in',
	"getUserInfo": root + '/users/info',
	"getUserInfoById": root + '/users/{id}/info',
	"getRecipes": root + '/recipes', // GET
	"getRecipesByUser": root + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": root + '/recipes/', // GET + {recipe_id}
	"createRecipe": root + '/recipes/user/', // POST + {user_id}
	"updateRecipe": root + '/recipes/', // PUT + {recipe_id}
	"getIngredients": root + '/recipes/ingredients', // GET
	"getMenuTypes": root + '/recipes/menutypes', // GET
	"getKitchenStyles": root + '/recipes/kitchenstyles', // GET
	"uploadMedia": root + '/media/upload', // POST

}
