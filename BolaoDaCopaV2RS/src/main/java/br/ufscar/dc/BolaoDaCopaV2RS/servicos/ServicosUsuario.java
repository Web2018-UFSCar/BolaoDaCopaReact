package br.ufscar.dc.BolaoDaCopaV2RS.servicos;

import br.ufscar.dc.BolaoDaCopaV2RS.beans.Usuario;
import br.ufscar.dc.BolaoDaCopaV2RS.dao.UsuarioDAO;

import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Stateless
@Path("usuario")
public class ServicosUsuario {


    @Inject
    UsuarioDAO usuarioDao;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsuarioPorEmail(@QueryParam("email") String email) {
        simularDemora();
        try {
            Usuario u = usuarioDao.buscarUsuarioPeloEmail(email);
            if (u != null) {
                return Response.ok(u).build();
            } else {
                return Response.noContent().build();
            }
        } catch (SQLException ex) {
            Logger.getLogger(ServicosUsuario.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
    }


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response gravarUsuario(Usuario u) {
        simularDemora();
        try {
            Usuario uGravado = usuarioDao.gravarUsuario(u);


            return Response.ok(uGravado).build();
        } catch (SQLException ex) {
            Logger.getLogger(ServicosUsuario.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
    }


    private void simularDemora() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex) {
            Logger.getLogger(ServicosUsuario.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
