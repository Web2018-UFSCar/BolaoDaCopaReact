package br.ufscar.dc.BolaoDaCopaV2RS.dao;

import br.ufscar.dc.BolaoDaCopaV2RS.beans.Usuario;

import javax.annotation.Resource;
import javax.enterprise.context.RequestScoped;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.*;
import java.util.Date;

@RequestScoped
public class UsuarioDAO {

    private final static String CRIAR_USUARIO_SQL = "insert into Usuario"
            + " (nome, email, senha, telefone, dataDeNascimento)"
            + " values (?,?,?,?,?)";

    private final static String BUSCAR_USUARIO_SQL = "select"
            + " id, nome, email, senha, telefone, dataDeNascimento"
            + " from usuario"
            + " where id=?";

    private final static String BUSCAR_USUARIO_PELO_EMAIL_SQL = "select"
            + " id, nome, email, senha, telefone, dataDeNascimento"
            + " from usuario"
            + " where email=?";

    @Resource(name = "jdbc/Bolao2DBLocal")
    DataSource dataSource;

    public Usuario gravarUsuario(Usuario u) throws SQLException {
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(CRIAR_USUARIO_SQL, Statement.RETURN_GENERATED_KEYS);) {
            ps.setString(1, u.getNome());
            ps.setString(2, u.getEmail());
            ps.setString(3, u.getSenha());
            ps.setString(4, u.getTelefone());
            ps.setDate(5, new java.sql.Date(u.getDataDeNascimento().getTime()));
            ps.execute();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                rs.next();
                u.setId(rs.getInt(1));
            }
        }
        return u;
    }

    public Usuario buscarUsuario(int id) throws SQLException {
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(BUSCAR_USUARIO_SQL)) {
            ps.setInt(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setSenha(rs.getString("senha"));
                    u.setTelefone(rs.getString("telefone"));
                    u.setDataDeNascimento(new Date(rs.getDate("dataDeNascimento").getTime()));
                    return u;
                } else {
                    return null;
                }
            }
        }
    }

    public Usuario buscarUsuarioPeloEmail(String email) throws SQLException {
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(BUSCAR_USUARIO_PELO_EMAIL_SQL)) {
            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id"));
                    u.setNome(rs.getString("nome"));
                    u.setEmail(rs.getString("email"));
                    u.setSenha(rs.getString("senha"));
                    u.setTelefone(rs.getString("telefone"));
                    u.setDataDeNascimento(new Date(rs.getDate("dataDeNascimento").getTime()));
                    return u;
                } else {
                    return null;
                }
            }
        }
    }
}
