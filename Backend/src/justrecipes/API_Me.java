package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.HashMap;
import java.util.UUID;

/**
 * Created by csuser1234 on 4/23/16.
 */

@Path("/me")

public class API_Me {

    @Context
    SecurityContext securityContext;

    private Database db = new Database();

    private final int customFailure = 463;

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
            return Response.status(customFailure).build();
        }

        String firstname = (String)objIn.get("firstname");
        String lastname = (String)objIn.get("lastname");
        String profileImage = (String)objIn.get("profile_image");

        if(db.update_user_profile(userId, firstname, lastname, profileImage)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(customFailure).build();
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
            return Response.status(customFailure).build();
        }
    }

    @POST
    @Path("/change-password")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(HashMap objIn) {
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(customFailure).build();
        }

        String email = (String)objIn.get("email");
        String currentPassword = (String)objIn.get("current_password");
        String newPassword = (String)objIn.get("new_password");

        if(db.change_user_password(email, currentPassword, newPassword)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(customFailure).build();
        }
    }

    @POST
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addRecipe(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(customFailure).build();
        }

        String name = (String)objIn.get("name");
        String text = (String)objIn.get("text");
        String image = (String)objIn.get("image");

        if(db.insert_recipe(userId, name, text, image) != -1) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(customFailure).build();

        }
    }

    @PUT
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateRecipe(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        if(objIn == null || objIn.isEmpty()) {
            return Response.status(customFailure).build();
        }

        Integer recipeId = (Integer)objIn.get("id");
        String name = (String)objIn.get("name");
        String text = (String)objIn.get("text");
        String image = (String)objIn.get("image");

        if(db.update_recipe(userId, recipeId, name, text, image)) {
            return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
        } else {
            return Response.status(customFailure).build();

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
            return Response.status(customFailure).build();

        }
    }

    /* This should be next sprint, when we add personalization to save favorites and view favorites.
    @GET
    @Path("/recipes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecipes(
            @QueryParam("after") int after,
            @QueryParam("limit") int limit,
            @QueryParam("q") String query
    ) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        //Implement full-text search using mysql
        //Implement paging via mysql
        db.get_recipes();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }
    */
}