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
        if(db.insert_account_info(userId)) {

            returnObj.put("userId", userId);
            returnObj.put("apitoken", apitoken);

            boolean emailSent = new Email().send(email, "Welcome", "Hi " + firstname + ", welcome to JustRecipes!");
            if(emailSent) {
                return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
            }
        }
        return Response.status(Constants.CUSTOM_FAILURE).build();
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
            returnObj.put("userId", apiCreds[0]);
            returnObj.put("apitoken", apiCreds[1]);

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

        String[][] recipeArray = db.get_recipes(query, limit, after);
        if(recipeArray != null) {
            for (String[] recipeItem : recipeArray) {

                HashMap recipe = new HashMap();
                recipe.put("id", Integer.parseInt(recipeItem[0]));
                recipe.put("name", recipeItem[1]);
                recipe.put("image", recipeItem[2]);
                recipe.put("text", recipeItem[3]);
                recipe.put("created_by", recipeItem[4]);
                recipe.put("created_by_image", recipeItem[5]);
                recipe.put("created", recipeItem[6]);
                recipe.put("last_modified", recipeItem[7]);

                recipeList.add(recipe);
            }
        }

        return Response.ok(recipeList, MediaType.APPLICATION_JSON).build();
    }
}