package br.ufscar.dc.BolaoDaCopaV2RS.dao;

import br.ufscar.dc.BolaoDaCopaV2RS.beans.Pais;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import javax.enterprise.context.RequestScoped;
import javax.sql.DataSource;

@RequestScoped
public class PaisDAO {

    private final static String LISTAR_PAISES_SQL = "SELECT nome FROM Pais";

    @Resource(name = "jdbc/Bolao2DBLocal")
    DataSource dataSource;

    public List<Pais> listarTodosPaises() throws SQLException {
        List<Pais> ret = new ArrayList<>();
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(LISTAR_PAISES_SQL)) {

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Pais p = new Pais();
                    p.setNome(rs.getString("nome"));
                    ret.add(p);
                }
            }
        }
        return ret;
    }

}
