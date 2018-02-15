package justrecipes;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

/**
 * Created by Akshit on 02/08/2018
 */
@Path("/")

public class API {

    @Context
    SecurityContext securityContext;

    private Database db = new Database();

    @HEAD
    @Path("/ping")
    public Response ping() {
        return Response.ok().build();
    }
}
