package justrecipes;

import pd.sqlframe.SqlHandler;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 * Created by hari on 4/23/16.
 */
public class Database {

    private SqlHandler sqlHandler;
    private DataSource ds;

    protected Database() {
        try {
            this.ds = (DataSource) new InitialContext().lookup("java:comp/env/jdbc/JustRecipes");
        } catch (NamingException ne) {
            throw new RuntimeException(ne.toString());
        }
        this.sqlHandler = new SqlHandler(ds);
    }

    protected int insert_user(String firstname, String lastname, String password, String email, String apitoken) {
        String sql =
            "INSERT INTO USER_INFO " +
            "(FNAME, LNAME, PASSWORD, USERCODE, CANLOGIN, APITOKEN) " +
            "VALUES (?, ?, SHA(?), ?, 1, ?); SELECT LAST_INSERT_ID()";
        this.sqlHandler.execute(sql, firstname, lastname, password, email, apitoken);
        return this.sqlHandler.topValueInt();
    }

    protected String[] check_user_credentials(String email, String password) {
        String sql = "SELECT USERID, APITOKEN FROM USER_INFO WHERE USERCODE = ? AND PASSWORD = SHA(?);";
        this.sqlHandler.execute(sql, email, password);
        if(this.sqlHandler.getNumRows() == 1) {
            return this.sqlHandler.grabStringResults()[0];
        }
        return null;
    }

    protected boolean update_user_password(String email, String newPassword) {
        String sql = "UPDATE USER_INFO SET PASSWORD = SHA(?) WHERE USERCODE = ?;";
        return this.sqlHandler.execute(sql, newPassword, email);
    }

    protected boolean change_user_password(String email, String currentPassword, String newPassword) {
        String sql = "UPDATE USER_INFO SET PASSWORD = SHA(?) WHERE USERCODE = ? AND PASSWORD = SHA(?);";
        return this.sqlHandler.execute(sql, newPassword, email, currentPassword);
    }

    protected String[][] get_recipes() {
        String sql = "";
        this.sqlHandler.execute(sql);
        return this.sqlHandler.grabStringResults();
    }

    protected int insert_recipe() {
        String sql = "INSERT INTO ";
        this.sqlHandler.execute(sql);
        return this.sqlHandler.topValueInt();
    }

    protected boolean update_recipe() {
        String sql = "";
        return this.sqlHandler.execute(sql);
    }

    protected boolean delete_recipe(Integer reccipeId) {
        String sql = "DELETE FROM RECIPES WHERE RECIPEID = ?;";
        return this.sqlHandler.execute(sql);
    }

    protected String[] get_user_profile(Integer userId) {
        String sql = "SELECT FNAME, LNAME, USERCODE, PROFILE_IMAGE, JOINED, LAST_MODIFIED FROM USER_INFO WHERE USERID = ?;";
        this.sqlHandler.execute(sql, userId);
        if(this.sqlHandler.getNumRows() > 0) {
            return this.sqlHandler.grabStringResults()[0];
        }
        return null;
    }

    protected boolean update_user_profile(Integer userId, String firstname, String lastname, String profileImage) {
        String sql = "UPDATE USER_INFO SET FNAME=?, LNAME=?, PROFILE_IMAGE=? WHERE USERID = ?;";
        return this.sqlHandler.execute(sql, firstname, lastname, profileImage, userId);
    }

    protected boolean delete_user_profile(Integer userId) {
        String sql = "DELETE FROM USER_INFO WHERE USERID = ?;";
        return this.sqlHandler.execute(sql, userId);
    }
}


