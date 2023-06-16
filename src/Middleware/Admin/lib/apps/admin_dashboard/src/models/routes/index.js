const API_ROOT = process.env.API_ROOT_V1_URL;

export default {
	"root": process.env.APP_ROOT_URL,
	"login": process.env.APP_DOMAIN_URL + '/wp-admin',
	"isLoggedIn": API_ROOT + '/admin/is_logged_in',
	"getAdminInfo": API_ROOT + '/admin/info',
	"getUserInfoById": API_ROOT + '/users/{id}/info',
	"getRecipes": API_ROOT + '/recipes', // GET
	"getRecipesByUser": API_ROOT + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": API_ROOT + '/recipes/', // GET + {recipe_id}
	"updateRecipe": API_ROOT + '/recipes/', // PUT + {recipe_id}
	"exportRecipe": API_ROOT + '/recipes/{id}/export', // PUT + {recipe_id}
	"getIngredients": API_ROOT + '/recipes/ingredients', // GET
	"getMenuTypes": API_ROOT + '/recipes/menutypes', // GET
	"getKitchenStyles": API_ROOT + '/recipes/kitchenstyles', // GET
	"getAccessories": API_ROOT + '/products/accessories', // GET
	"getIngredientsProducts": API_ROOT + '/products/ingredients', // GET
	"uploadMedia": API_ROOT + '/media/upload', // POST
	"updateMedia": API_ROOT + '/media/update', // PUT
}
