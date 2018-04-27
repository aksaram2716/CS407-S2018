package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

/**
 * Created by Akshit.
 */

@Path("/me")

public class API_Me {

    @Context
    SecurityContext securityContext;

    private Database db = new Database();

    @GET
    @Path("/profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMyProfile() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        String userArray[] = db.get_user_profile(userId);
        if(userArray != null) {
            returnObj.put("firstname", userArray[0]);
            returnObj.put("lastname", userArray[1]);
            returnObj.put("email", userArray[2]);
            returnObj.put("profile_image", userArray[3]);
            returnObj.put("joined", userArray[4]);
            returnObj.put("last_modified", userArray[5]);
        }

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @PUT
    @Path("/profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMyProfile(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String firstname = (String)objIn.get("firstname");
        String lastname = (String)objIn.get("lastname");
        String profileImage = (String)objIn.get("profile_image");

        if(db.update_user_profile(userId, firstname, lastname, profileImage)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @DELETE
    @Path("/profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMyProfile() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(db.delete_user_profile(userId)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @POST
    @Path("/change-password")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String currentPassword = (String)objIn.get("current_password");
        String newPassword = (String)objIn.get("new_password");

        if(db.check_user_credentials(userId, currentPassword)) {
            db.change_user_password(userId, currentPassword, newPassword);
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
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
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

        String[][] recipeArray = db.get_user_recipes(userId, query, recipeIds, limit, after);
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
                recipe.put("is_favorite", recipeItem[8] != null);
                recipe.put("video_url", recipeItem[11]);
                recipe.put("favorite_count", db.get_favorite_count(recipeId));

                HashMap recipeOwner = new HashMap();
                recipeOwner.put("id", recipeItem[12]);
                recipeOwner.put("firstname", recipeItem[4]);
                recipeOwner.put("lastname", recipeItem[13]);
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
    public Response getRecipes(
        @QueryParam("id") int recipeId
    ) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap recipe = new HashMap();
        String[] recipeItem = db.get_user_recipe(userId, recipeId);
        if(recipeItem != null) {
            recipe.put("id", recipeId);
            recipe.put("name", recipeItem[1]);
            recipe.put("image", recipeItem[2]);
            recipe.put("text", recipeItem[3]);

            recipe.put("created", recipeItem[6]);
            recipe.put("last_modified", recipeItem[7]);
            recipe.put("favorite", recipeItem[8] != null);

            recipe.put("video_url", recipeItem[11]);
            recipe.put("favorite_count", db.get_favorite_count(recipeId));

            HashMap recipeOwner = new HashMap();
            recipeOwner.put("id", recipeItem[4]);
            recipeOwner.put("firstname", recipeItem[12]);
            recipeOwner.put("lastname", recipeItem[13]);
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

                    HashMap commentOwner = new HashMap();
                    commentOwner.put("id", commentItem[2]);
                    commentOwner.put("firstname", commentItem[3]);
                    commentOwner.put("lastname", commentItem[4]);
                    commentOwner.put("profile_image", commentItem[5]);

                    comment.put("id", commentItem[0]);
                    comment.put("recipe_id", commentItem[1]);
                    comment.put("text", commentItem[6]);
                    comment.put("last_modified", commentItem[7]);
                    comment.put("owner", commentOwner);

                    commentList.add(comment);
                }

                recipe.put("comments", commentList);
            }
        }

        return Response.ok(recipe, MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addRecipe(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String name = (String)objIn.get("name");
        String text = (String)objIn.get("text");
        String image = (String)objIn.get("image");

        if(db.insert_recipe(userId, name, text, image) != -1) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @PUT
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateRecipe(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        Integer recipeId = (Integer)objIn.get("id");
        String name = (String)objIn.get("name");
        String text = (String)objIn.get("text");
        String image = (String)objIn.get("image");

        if(db.update_recipe(userId, recipeId, name, text, image)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();

        }
    }

    @DELETE
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteRecipe(
        @QueryParam("id") int recipeId
    ) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(db.delete_recipe(userId, recipeId)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @GET
    @Path("/favorites")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFavorites() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        ArrayList<HashMap> favoriteList = new ArrayList<>();

        String[][] recipeArray = db.get_user_favorites(userId);
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
                recipe.put("is_favorite", recipeItem[8] != null);
                recipe.put("video_url", recipeItem[11]);
                recipe.put("favorite_count", db.get_favorite_count(recipeId));

                HashMap recipeOwner = new HashMap();
                recipeOwner.put("id", recipeItem[12]);
                recipeOwner.put("firstname", recipeItem[4]);
                recipeOwner.put("lastname", recipeItem[13]);
                recipeOwner.put("profile_image", recipeItem[5]);
                recipe.put("owner", recipeOwner);

                favoriteList.add(recipe);
            }
        }

        return Response.ok(favoriteList, MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/favorite")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addFavorite(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        Integer recipeId = (Integer)objIn.get("id");

        if(db.insert_user_favorite(userId, recipeId) != -1) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @DELETE
    @Path("/favorite")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteFavorite(
            @QueryParam("id") int recipeId
    ) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(db.delete_user_favorite(userId, recipeId)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @POST
    @Path("/share")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postShare(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        ArrayList userList = (ArrayList) objIn.get("user_list");
        ArrayList emailsEnabled = new ArrayList();
        for(int i = 0; i < userList.size(); i++) {
            String email = (String)userList.get(i);
            if(db.is_email_notification_enabled(email)) {
                emailsEnabled.add(email);
            }
        }

        Integer recipeId = (Integer)objIn.get("recipe_id");

        String userArray[] = db.get_user_profile(userId);
        String firstname = userArray[0];
        String lastname = userArray[1];
        String url = "http://localhost:8000/#!/recipe?id=" + recipeId;

        boolean emailSent = new Email().send(emailsEnabled, firstname + " " + lastname + " shared a recipe with you", url);

        if(db.insert_user_share(userId, String.join(",", emailsEnabled)) != -1 && emailSent) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @POST
    @Path("/feedback")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addFeedback(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String text = (String)objIn.get("text");

        ArrayList<String> developers = new ArrayList<>();
        developers.add("mantenahk@gmail.com"); //Hari
        developers.add("gudoor1996@gmail.com"); //Akshit

        boolean emailSent = new Email().send(developers, "A JustRecipe user has submitted a new feedback", text);

        if(db.insert_user_feedback(userId, text) != -1 && emailSent) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @GET
    @Path("/search-history")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMySearchHistory() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        ArrayList<String> returnList = new ArrayList<>();

        if(db.check_user_search_history_enabled(userId)){
            String searchHistoryArray[][] = db.get_user_search_history(userId);
            if (searchHistoryArray != null) {
                for (String[] searchHistoryItem : searchHistoryArray) {
                    returnList.add(searchHistoryItem[1]);
                }
            }
        }

        return Response.ok(returnList, MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/settings")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMySettings() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        String settingsArray[] = db.get_user_settings(userId);
        if(settingsArray != null) {
            returnObj.put("web_notification_enabled", settingsArray[1].equals("1"));
            returnObj.put("email_notification_enabled", settingsArray[2].equals("1"));
            returnObj.put("search_history_enabled", settingsArray[3].equals("1"));
            returnObj.put("last_modified", settingsArray[4]);
        }

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @PUT
    @Path("/settings")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postMySettings(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        boolean webNotificationEnabled = (boolean)objIn.get("web_notification_enabled");
        boolean emailNotificationEnabled = (boolean)objIn.get("email_notification_enabled");
        boolean searchHistoryEnabled = (boolean)objIn.get("search_history_enabled");

        if(db.update_user_settings(userId, webNotificationEnabled, emailNotificationEnabled, searchHistoryEnabled)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }

    @POST
    @Path("/comment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postMyComment(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        String text = (String)objIn.get("text");
        Integer recipeId = (Integer) objIn.get("recipe_id");

        if(db.insert_recipe_comment(recipeId, userId, text) > 0) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }
    }
}