package br.ufscar.dc.BolaoDaCopaV2RS.servicos;

import br.ufscar.dc.BolaoDaCopaV2RS.dao.PaisDAO;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Stateless
@Path("pais")
public class ServicosPais {

    @Inject
    PaisDAO paisDAO;

    @Context
    private UriInfo context;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getJson() {
        try {
            return Response.ok(paisDAO.listarTodosPaises()).build();
        } catch (SQLException ex) {
            Logger.getLogger(ServicosPais.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
    }
}
