const root = 'https://relaunch-magazin.grillfuerst.de/wp-json/sv-grillfuerst-user-recipes/v1';
//@todo replace this with config url
const rootStatic = 'https://relaunch-magazin.grillfuerst.de/community-rezepte';

export default {
	"login": rootStatic + '/login',
	"isLoggedIn": root + '/admin/is_logged_in',
	"getAdminInfo": root + '/admin/info',
	"getUserInfoById": root + '/users/{id}/info',
	"getRecipes": root + '/recipes', // GET
	"getRecipesByUser": root + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": root + '/recipes/', // GET + {recipe_id}
	"updateRecipe": root + '/recipes/', // PUT + {recipe_id}
	"exportRecipe": root + '/recipes/{id}/export', // PUT + {recipe_id}
	"getIngredients": root + '/recipes/ingredients', // GET
	"getMenuTypes": root + '/recipes/menutypes', // GET
	"getKitchenStyles": root + '/recipes/kitchenstyles', // GET
	"getAccessories": root + '/products/accessories', // GET
	"getIngredientsProducts": root + '/products/ingredients', // GET
	"uploadMedia": root + '/media/upload', // POST
	"updateMedia": root + '/media/update', // PUT

}
