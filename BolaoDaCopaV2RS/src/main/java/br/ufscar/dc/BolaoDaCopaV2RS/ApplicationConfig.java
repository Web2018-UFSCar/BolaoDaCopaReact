package br.ufscar.dc.BolaoDaCopaV2RS;

import br.ufscar.dc.BolaoDaCopaV2RS.servicos.CorsResponseFilter;
import br.ufscar.dc.BolaoDaCopaV2RS.servicos.ServicosPalpite;
import br.ufscar.dc.BolaoDaCopaV2RS.servicos.ServicosUsuario;

import java.util.Set;
import javax.ws.rs.core.Application;

@javax.ws.rs.ApplicationPath("webresources")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(br.ufscar.dc.BolaoDaCopaV2RS.servicos.CorsResponseFilter.class);
        resources.add(br.ufscar.dc.BolaoDaCopaV2RS.servicos.ServicosPais.class);
        resources.add(br.ufscar.dc.BolaoDaCopaV2RS.servicos.ServicosPalpite.class);
        resources.add(br.ufscar.dc.BolaoDaCopaV2RS.servicos.ServicosUsuario.class);
    }

}
