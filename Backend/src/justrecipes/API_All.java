package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.HashMap;

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

        db.insert_user();
        //send email for user registration confirmation

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(HashMap objIn) {
        HashMap returnObj = new HashMap();

        db.check_user_credentials();
        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/reset-password")
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(HashMap objIn) {
        HashMap returnObj = new HashMap();

        String newPassword = "";

        db.update_user_password();
        //send email with newPassword;

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/recipes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecipes(
        @QueryParam("after") int after,
        @QueryParam("limit") int limit,
        @QueryParam("q") String query
    ) {
        HashMap returnObj = new HashMap();

        //Implement full-text search using mysql
        //Implement paging via mysql

        db.get_recipes();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addRecipe(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        db.insert_recipe();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @PUT
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateRecipe(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        db.update_recipe();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @DELETE
    @Path("/recipe")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteRecipe() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        db.delete_recipe();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }
}