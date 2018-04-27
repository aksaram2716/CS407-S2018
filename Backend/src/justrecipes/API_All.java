package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.UUID;

/**
 * Created by Akshit on 02/14/2018.
 */

@Path("/all")

public class API_All {

    @Context
    SecurityContext securityContext;

    private Database db = new Database();

    //To check if the server is up and running
    @HEAD
    @Path("/ping")
    public Response ping() {
        return Response.ok().build();
    }

    @POST
    @Path("/signup")
    @Produces(MediaType.APPLICATION_JSON)
    public Response signup(HashMap objIn) {
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String firstname = (String)objIn.get("firstname");
        String lastname = (String)objIn.get("lastname");
        String password = (String)objIn.get("password");
        String email = (String)objIn.get("email");
        String profile_image = Constants.DEFAULT_USER_IMG;
        String apitoken = UUID.randomUUID().toString().replaceAll("-", "");

        int userId = db.insert_user(firstname, lastname, password, email, apitoken, profile_image);
        if(db.insert_account_info(userId) && db.insert_user_settings(userId)) {

            returnObj.put("user_id", userId);
            returnObj.put("api_token", apitoken);

            boolean emailSent = new Email().send(email, "Welcome", "Hi " + firstname + ", welcome to JustRecipes!");
            if(emailSent) {
                return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
            }
        }
        return Response.status(Constants.USER_ALREADY_EXISTS).build();
    }

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(HashMap objIn) {
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String email = (String)objIn.get("email");
        String password = (String)objIn.get("password");

        String apiCreds[] = db.check_user_credentials(email, password);

        if(apiCreds != null) {
            returnObj.put("user_id", apiCreds[0]);
            returnObj.put("api_token", apiCreds[1]);

            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @POST
    @Path("/reset-password")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(HashMap objIn) {
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String email = (String)objIn.get("email");
        if(db.get_user_id(email) == -1) {
            return Response.status(Constants.USER_NOT_FOUND).build();
        }

        String newPassword = UUID.randomUUID().toString().replaceAll("-", "").substring(0,8);

        boolean emailSent = new Email().send(email, "Reset Password", "Hi, here is your new password " + newPassword);

        if(db.update_user_password(email, newPassword) && emailSent) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @GET
    @Path("/recipes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecipes(
        @QueryParam("after") int after,
        @QueryParam("limit") int limit,
        @QueryParam("q") String query
    ) {
        ArrayList<HashMap> recipeList = new ArrayList<>();

        StringBuilder flattenRecipeIds = new StringBuilder();
        if(query != null && !query.equals("")) {
            flattenRecipeIds.append("(");
            int[] recipeIdsFromTags = db.search_tags(query);
            int[] recipeIdsFromMethods = db.search_methods(query);
            int[] recipeIdsFromIngredients = db.search_ingredients(query);
            HashSet<Integer> set = new HashSet<>();

            if(recipeIdsFromTags != null) {
                for (int recipeId : recipeIdsFromTags) {
                    set.add(recipeId);
                }
            }

            if(recipeIdsFromMethods != null) {
                for (int recipeId : recipeIdsFromMethods) {
                    set.add(recipeId);
                }
            }

            if(recipeIdsFromIngredients != null) {
                for (int recipeId : recipeIdsFromIngredients) {
                    set.add(recipeId);
                }
            }

            boolean first = true;
            for (int recipeId : set) {
                if (!first) {
                    flattenRecipeIds.append(",");
                }
                flattenRecipeIds.append(recipeId);
                first = false;
            }
            flattenRecipeIds.append(")");
        } else {
            flattenRecipeIds = null;
        }

        String recipeIds = null;
        if(flattenRecipeIds != null) {
            recipeIds = flattenRecipeIds.toString();
        }

        String[][] recipeArray = db.get_recipes(query, recipeIds, limit, after);
        if(recipeArray != null) {
            for (String[] recipeItem : recipeArray) {

                HashMap recipe = new HashMap();
                Integer recipeId = Integer.parseInt(recipeItem[0]);
                recipe.put("id", recipeId);
                recipe.put("name", recipeItem[1]);
                recipe.put("image", recipeItem[2]);
                recipe.put("text", recipeItem[3]);
                recipe.put("created", recipeItem[6]);
                recipe.put("last_modified", recipeItem[7]);
                recipe.put("video_url", recipeItem[10]);
                recipe.put("favorite_count", db.get_favorite_count(recipeId));

                HashMap recipeOwner = new HashMap();
                recipeOwner.put("id", recipeItem[11]);
                recipeOwner.put("firstname", recipeItem[4]);
                recipeOwner.put("lastname", recipeItem[12]);
                recipeOwner.put("profile_image", recipeItem[5]);
                recipe.put("owner", recipeOwner);

                String[][] tagsArray = db.get_recipe_tags(recipeId);
                if(tagsArray != null) {
                    ArrayList<HashMap> tagList = new ArrayList<>();

                    for (String[] tagItem : tagsArray) {
                        HashMap tags = new HashMap();

                        tags.put("id", tagItem[0]);
                        tags.put("text", tagItem[1]);

                        tagList.add(tags);
                    }

                    recipe.put("tags", tagList);
                }

                recipeList.add(recipe);
            }
        }

        return Response.ok(recipeList, MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecipe(
        @QueryParam("id") int recipeId
    ) {
        HashMap recipe = new HashMap();

        String[] recipeItem = db.get_recipe(recipeId);
        if(recipeItem != null) {

            recipe.put("id", recipeId);
            recipe.put("name", recipeItem[0]);
            recipe.put("image", recipeItem[1]);
            recipe.put("text", recipeItem[2]);
            recipe.put("created", recipeItem[5]);
            recipe.put("last_modified", recipeItem[6]);
            recipe.put("video_url", recipeItem[9]);
            recipe.put("favorite_count", db.get_favorite_count(recipeId));

            HashMap recipeOwner = new HashMap();
            recipeOwner.put("id", recipeItem[3]);
            recipeOwner.put("firstname", recipeItem[10]);
            recipeOwner.put("lastname", recipeItem[11]);
            recipeOwner.put("profile_image", recipeItem[4]);
            recipe.put("owner", recipeOwner);

            String[][] tagsArray = db.get_recipe_tags(recipeId);
            if(tagsArray != null) {
                ArrayList<HashMap> tagList = new ArrayList<>();

                for (String[] tagItem : tagsArray) {
                    HashMap tags = new HashMap();

                    tags.put("id", tagItem[0]);
                    tags.put("text", tagItem[1]);

                    tagList.add(tags);
                }

                recipe.put("tags", tagList);
            }

            String[][] ingredientsArray = db.get_recipe_ingredients(recipeId);
            if(ingredientsArray != null) {
                ArrayList<HashMap> ingredientList = new ArrayList<>();

                for (String[] ingredientItem : ingredientsArray) {
                    HashMap ingredient = new HashMap();

                    ingredient.put("id", ingredientItem[0]);
                    ingredient.put("name", ingredientItem[1]);

                    ingredientList.add(ingredient);
                }

                recipe.put("ingredients", ingredientList);
            }

            String[][] methodsArray = db.get_recipe_methods(recipeId);
            if(methodsArray != null) {
                ArrayList<HashMap> methodList = new ArrayList<>();

                for (String[] methodItem : methodsArray) {
                    HashMap method = new HashMap();

                    method.put("id", methodItem[0]);
                    method.put("text", methodItem[1]);
                    method.put("order", methodItem[2]);

                    methodList.add(method);
                }

                recipe.put("methods", methodList);
            }

            String[][] commentsArray = db.get_recipe_comments(recipeId);
            if(commentsArray != null) {
                ArrayList<HashMap> commentList = new ArrayList<>();

                for (String[] commentItem : commentsArray) {
                    HashMap comment = new HashMap();

                    HashMap owner = new HashMap();
                    owner.put("id", commentItem[2]);
                    owner.put("firstname", commentItem[3]);
                    owner.put("lastname", commentItem[4]);
                    owner.put("profile_image", commentItem[5]);

                    comment.put("id", commentItem[0]);
                    comment.put("recipe_id", commentItem[1]);
                    comment.put("text", commentItem[6]);
                    comment.put("last_modified", commentItem[7]);
                    comment.put("owner", owner);

                    commentList.add(comment);
                }

                recipe.put("comments", commentList);
            }
        }

        return Response.ok(recipe, MediaType.APPLICATION_JSON).build();
    }
}