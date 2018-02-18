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
        sqlHandler = new SqlHandler(ds);
    }

    protected int insert_user(String firstname, String lastname, String password, String email, String apitoken) {
        String sql =
            "INSERT INTO USER_INFO " +
            "(FNAME, LNAME, PASSWORD, USERCODE, CANLOGIN, APITOKEN) " +
            "VALUES (?, ?, SHA(?), ?, 1, ?); SELECT LAST_INSERT_ID()";
        sqlHandler.execute(sql, firstname, lastname, password, email, apitoken);
        return sqlHandler.topValueInt();
    }

    protected boolean insert_account_info(Integer userId) {
        String sql = "INSERT INTO USER_ACCINFO (ACCINFOTYPEID, USER_ID, AUTHORITY) VALUES (1, ?, 'ROLE_USER');";
        return sqlHandler.execute(sql, userId);
    }


    protected String[] check_user_credentials(String email, String password) {
        String sql = "SELECT USER_ID, APITOKEN FROM USER_INFO WHERE USERCODE = ? AND PASSWORD = SHA(?);";
        sqlHandler.execute(sql, email, password);
        if(sqlHandler.getNumRows() == 1) {
            return sqlHandler.grabStringResults()[0];
        }
        return null;
    }

    protected boolean update_user_password(String email, String newPassword) {
        String sql = "UPDATE USER_INFO SET PASSWORD = SHA(?) WHERE USERCODE = ?;";
        return sqlHandler.execute(sql, newPassword, email);
    }

    protected boolean change_user_password(Integer userId, String currentPassword, String newPassword) {
        String sql = "UPDATE USER_INFO SET PASSWORD = SHA(?) WHERE USER_ID = ? AND PASSWORD = SHA(?);";
        return sqlHandler.execute(sql, newPassword, userId, currentPassword);
    }

    protected String[][] get_recipes(String query, Integer limit, Integer recipeId) {
        String sql =
            "SELECT " +
            "R.RECIPE_ID, R.NAME, R.IMAGE, R.TEXT, " +
            "U.FNAME, R.CREATED, R.LAST_MODIFIED " +
            "FROM RECIPES R " +
            "INNER JOIN USER_INFO U ON U.USER_ID = R.OWNER_ID " +
            "WHERE R.RECIPE_ID > ? AND (R.NAME LIKE '%" + query + "%' OR R.TEXT LIKE '%" + query + "%') ORDER BY R.RECIPE_ID ASC LIMIT ? ; ";
        sqlHandler.execute(sql, recipeId, limit);
        return sqlHandler.grabStringResults();
    }

    protected int insert_recipe(Integer userId, String name, String image, String text) {
        String sql = "INSERT INTO RECIPES (NAME, IMAGE, TEXT, OWNER_ID) VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID();";
        sqlHandler.execute(sql, name, image, text, userId);
        return sqlHandler.topValueInt();
    }

    protected boolean update_recipe(Integer userId, Integer recipeId, String name, String image, String text) {
        String sql = "UPDATE RECIPES SET NAME = ?, IMAGE = ?, TEXT = ? WHERE RECIPE_ID = ? AND OWNER_ID = ?;";
        return sqlHandler.execute(sql, name, image, text, recipeId, userId);
    }

    protected boolean delete_recipe(Integer userId, Integer reccipeId) {
        String sql = "DELETE FROM RECIPES WHERE RECIPE_ID = ? AND OWNER_ID = ?;";
        return sqlHandler.execute(sql, reccipeId, userId);
    }

    protected String[] get_user_profile(Integer userId) {
        String sql = "SELECT FNAME, LNAME, USERCODE, PROFILE_IMAGE, JOINED, LAST_MODIFIED FROM USER_INFO WHERE USER_ID = ?;";
        sqlHandler.execute(sql, userId);
        if(sqlHandler.getNumRows() > 0) {
            return sqlHandler.grabStringResults()[0];
        }
        return null;
    }

    protected boolean update_user_profile(Integer userId, String firstname, String lastname, String profileImage) {
        String sql = "UPDATE USER_INFO SET FNAME=?, LNAME=?, PROFILE_IMAGE=? WHERE USER_ID = ?;";
        return sqlHandler.execute(sql, firstname, lastname, profileImage, userId);
    }

    protected boolean delete_user_profile(Integer userId) {
        String sql = "DELETE FROM USER_INFO WHERE USER_ID = ?;";
        return sqlHandler.execute(sql, userId);
    }
}


