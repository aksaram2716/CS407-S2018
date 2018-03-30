package justrecipes;

import pd.sqlframe.SqlHandler;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 * Created by hari on 2/02/18.
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

    protected int insert_user(String firstname, String lastname, String password, String email, String apitoken, String profile_image) {
        String sql =
            "INSERT INTO USER_INFO " +
            "(FNAME, LNAME, PASSWORD, USERCODE, APITOKEN, PROFILE_IMAGE) " +
            "VALUES (?, ?, SHA(?), ?, ?, ?); SELECT LAST_INSERT_ID()";
        sqlHandler.execute(sql, firstname, lastname, password, email, apitoken, profile_image);
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

    protected boolean check_user_credentials(Integer userId, String password) {
        String sql = "SELECT USER_ID, APITOKEN FROM USER_INFO WHERE USER_ID = ? AND PASSWORD = SHA(?);";
        sqlHandler.execute(sql, userId, password);
        return sqlHandler.getNumRows() == 1;
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
            "U.FNAME, U.PROFILE_IMAGE, R.CREATED, R.LAST_MODIFIED, " +
            "R.METHOD, R.INGREDIENTS, R.VIDEO_URL " +
            "FROM RECIPES R " +
            "INNER JOIN USER_INFO U ON U.USER_ID = R.OWNER_ID " +
            "WHERE R.RECIPE_ID > ? AND (R.NAME LIKE '%" + query + "%' OR R.TEXT LIKE '%" + query + "%') ORDER BY R.RECIPE_ID ASC LIMIT ? ; ";
        sqlHandler.execute(sql, recipeId, limit);
        if(sqlHandler.getNumRows() > 0) {
            return sqlHandler.grabStringResults();
        }
        return null;
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

    protected int get_user_id(String email) {
        String sql = "SELECT USER_ID FROM USER_INFO WHERE USERCODE = ?;";
        sqlHandler.execute(sql, email);
        if(sqlHandler.getNumRows() == 1) {
            return sqlHandler.topValueInt();
        }
        return -1;
    }

    protected String[][] get_user_recipes(Integer userId, String query, Integer limit, Integer recipeId) {
        String sql =
            "SELECT " +
            "R.RECIPE_ID, R.NAME, R.IMAGE, R.TEXT, " +
            "U.FNAME, U.PROFILE_IMAGE, R.CREATED, R.LAST_MODIFIED, " +
            "F.FAVORITE_ID, R.METHOD, R.INGREDIENTS, R.VIDEO_URL " +
            "FROM RECIPES R " +
            "INNER JOIN USER_INFO U ON U.USER_ID = R.OWNER_ID " +
            "LEFT OUTER JOIN FAVORITES F ON F.RECIPE_ID = R.RECIPE_ID AND F.USER_ID = ? " +
            "WHERE R.RECIPE_ID > ? AND (R.NAME LIKE '%" + query + "%' OR R.TEXT LIKE '%" + query + "%') ORDER BY R.RECIPE_ID ASC LIMIT ? ; ";
        sqlHandler.execute(sql, userId, recipeId, limit);
        if(sqlHandler.getNumRows() > 0) {
            return sqlHandler.grabStringResults();
        }
        return null;
    }

    protected String[][] get_user_favorites(Integer userId) {
        String sql =
            "SELECT " +
            "R.RECIPE_ID, R.NAME, R.IMAGE, R.TEXT, " +
            "U.FNAME, U.PROFILE_IMAGE, R.CREATED, R.LAST_MODIFIED, " +
            "F.FAVORITE_ID, R.METHOD, R.INGREDIENTS, R.VIDEO_URL " +
            "FROM FAVORITES F " +
            "INNER JOIN RECIPES R ON R.RECIPE_ID = F.RECIPE_ID " +
            "INNER JOIN USER_INFO U ON U.USER_ID = R.OWNER_ID " +
            "WHERE F.USER_ID = ? ORDER BY R.RECIPE_ID ASC ;";
        sqlHandler.execute(sql, userId);
        if(sqlHandler.getNumRows() > 0) {
            return sqlHandler.grabStringResults();
        }
        return null;
    }

    protected int insert_user_favorite(Integer userId, Integer recipeId) {
        String sql = "INSERT INTO FAVORITES (USER_ID, RECIPE_ID) VALUES (?, ?); SELECT LAST_INSERT_ID()";
        sqlHandler.execute(sql, userId, recipeId);
        return sqlHandler.topValueInt();
    }

    protected boolean delete_user_favorite(Integer userId, Integer recipeId) {
        String sql = "DELETE FROM FAVORITES WHERE USER_ID = ? AND RECIPE_ID = ?;";
        return sqlHandler.execute(sql, userId, recipeId);
    }

    protected int get_favorite_count(Integer recipeId) {
        String sql = "SELECT COUNT(*) AS FAVORITE_COUNT FROM FAVORITES WHERE RECIPE_ID = ? ;";
        sqlHandler.execute(sql, recipeId);
        return sqlHandler.topValueInt();
    }

    protected int insert_user_share(Integer userId, String userList) {
        String sql = "INSERT INTO SHARE (USER_ID, USER_LIST) VALUES (?, ?) ; SELECT LAST_INSERT_ID();";
        sqlHandler.execute(sql, userId, userList);
        return sqlHandler.topValueInt();
    }

    protected int insert_user_feedback(Integer userId, String text) {
        String sql = "INSERT INTO FEEDBACK (USER_ID, TEXT) VALUES (?, ?) ; SELECT LAST_INSERT_ID();";
        sqlHandler.execute(sql, userId, text);
        return sqlHandler.topValueInt();
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