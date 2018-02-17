package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.HashMap;

/**
 * Created by csuser1234 on 4/23/16.
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

        db.get_user_profile();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @PUT
    @Path("/profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMyProfile(HashMap objIn) {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        //store the image as base64 string into database.
        //allow users to update everything in this object itself, name, password, image, etc. Everything but email.
        db.update_user_profile();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }

    @DELETE
    @Path("/profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMyProfile() {
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        db.delete_user_profile();

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
        int userId = Integer.parseInt(this.securityContext.getUserPrincipal().getName());
        HashMap returnObj = new HashMap();

        //Implement full-text search using mysql
        //Implement paging via mysql
        db.get_recipes();

        return Response.ok(returnObj, MediaType.APPLICATION_JSON).build();
    }
}