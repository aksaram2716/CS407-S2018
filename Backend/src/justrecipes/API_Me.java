package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

/**
 * Created by Akshit on 02/14/2018.
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

        String[][] recipeArray = db.get_user_recipes(userId, query, limit, after);
        if(recipeArray != null) {
            for (String[] recipeItem : recipeArray) {

                HashMap recipe = new HashMap();
                Integer recipeId = Integer.parseInt(recipeItem[0]);
                recipe.put("id", recipeId);
                recipe.put("name", recipeItem[1]);
                recipe.put("image", recipeItem[2]);
                recipe.put("text", recipeItem[3]);
                recipe.put("created_by", recipeItem[4]);
                recipe.put("created_by_image", recipeItem[5]);
                recipe.put("created", recipeItem[6]);
                recipe.put("last_modified", recipeItem[7]);
                recipe.put("favorite", recipeItem[8] != null);
                recipe.put("method", recipeItem[9]);
                recipe.put("ingredients", recipeItem[10]);
                recipe.put("video_url", recipeItem[11]);
                recipe.put("favorite_count", db.get_favorite_count(recipeId));

                recipeList.add(recipe);
            }
        }

        return Response.ok(recipeList, MediaType.APPLICATION_JSON).build();
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
                recipe.put("created_by", recipeItem[4]);
                recipe.put("created_by_image", recipeItem[5]);
                recipe.put("created", recipeItem[6]);
                recipe.put("last_modified", recipeItem[7]);
                recipe.put("favorite", recipeItem[8] != null);
                recipe.put("method", recipeItem[9]);
                recipe.put("ingredients", recipeItem[10]);
                recipe.put("video_url", recipeItem[11]);
                recipe.put("favorite_count", db.get_favorite_count(recipeId));

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
    public Response addShare(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(Constants.CUSTOM_FAILURE).build();
        }

        ArrayList userList = (ArrayList) objIn.get("user_list");
        Integer recipeId = (Integer)objIn.get("recipe_id");

        String userArray[] = db.get_user_profile(userId);
        String firstname = userArray[0];
        String lastname = userArray[1];
        String url = "http://localhost:8000/#!/recipe?id=" + recipeId;

        boolean emailSent = new Email().send(userList, firstname + " " + lastname + " shared a recipe with you", url);

        if(db.insert_user_share(userId, String.join(",", userList)) != -1 && emailSent) {
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
}