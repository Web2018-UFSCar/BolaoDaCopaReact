package br.ufscar.dc.BolaoDaCopaV2RS.dao;

import br.ufscar.dc.BolaoDaCopaV2RS.beans.Palpite;
import br.ufscar.dc.BolaoDaCopaV2RS.beans.Usuario;

import javax.annotation.Resource;
import javax.enterprise.context.RequestScoped;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequestScoped
public class PalpiteDAO {

    private final static String CRIAR_PALPITE_SQL = "insert into Palpite"
            + " (campeao, vice, palpiteiro)"
            + " values (?,?,?)";

    private final static String LISTAR_PALPITES_SQL = "select"
            + " p.id as palpiteId, p.campeao, p.vice,"
            + " u.id as usuarioId, u.nome, u.email, u.telefone, u.dataDeNascimento"
            + " from Palpite p inner join Usuario u on p.palpiteiro = u.id";

    private final static String LISTAR_SELECOES_SQL = "select"
            + " distinct(selecao) from"
            + " (select campeao as selecao from palpite"
            + " union"
            + " select vice as selecao from palpite) selecoes"
            + " order by upper(selecao)";

    @Resource(name = "jdbc/Bolao2DBLocal")
    DataSource dataSource;

    public Palpite gravarPalpite(Palpite p) throws SQLException {
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(CRIAR_PALPITE_SQL, Statement.RETURN_GENERATED_KEYS);) {
            ps.setString(1, p.getCampeao());
            ps.setString(2, p.getVice());
            ps.setInt(3, p.getPalpiteiro().getId());
            ps.execute();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                rs.next();
                p.setId(rs.getInt(1));
            }
        }
        return p;
    }

    public List<Palpite> listarTodosPalpites() throws SQLException {
        List<Palpite> ret = new ArrayList<>();
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(LISTAR_PALPITES_SQL)) {

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Palpite p = new Palpite();
                    Usuario u = new Usuario();
                    p.setId(rs.getInt("palpiteId"));
                    p.setCampeao(rs.getString("campeao"));
                    p.setVice(rs.getString("vice"));
                    u.setId(rs.getInt("usuarioId"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setTelefone(rs.getString("telefone"));
                    u.setDataDeNascimento(new Date(rs.getDate("dataDeNascimento").getTime()));
                    p.setPalpiteiro(u);
                    ret.add(p);
                }
            }
        }
        return ret;
    }

    public List<String> listarTodasSelecoes() throws SQLException {
        List<String> ret = new ArrayList<>();
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(LISTAR_SELECOES_SQL)) {

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String s = rs.getString("selecao");
                    ret.add(s);
                }
            }
        }
        return ret;
    }
}