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

    protected int insert_user() {
        String sql = "";
        this.sqlHandler.execute(sql);
        return this.sqlHandler.getNumRows();
    }

    protected boolean check_user_credentials() {
        String sql = "";
        this.sqlHandler.execute(sql);
        return this.sqlHandler.getNumRows() > 0;
    }

    protected boolean update_user_password() {
        String sql = "";
        return this.sqlHandler.execute(sql);
    }

    protected String[][] get_recipes() {
        String sql = "";
        this.sqlHandler.execute(sql);
        return this.sqlHandler.grabStringResults();
    }

    protected int insert_recipe() {
        String sql = "";
        this.sqlHandler.execute(sql);
        return this.sqlHandler.topValueInt();
    }

    protected boolean update_recipe() {
        String sql = "";
        return this.sqlHandler.execute(sql);
    }

    protected boolean delete_recipe() {
        String sql = "";
        return this.sqlHandler.execute(sql);
    }

    protected String[] get_user_profile() {
        String sql = "";
        this.sqlHandler.execute(sql);
        if(this.sqlHandler.getNumRows() > 0) {
            return this.sqlHandler.grabStringResults()[0];
        }
        return null;
    }

    protected boolean update_user_profile() {
        String sql = "";
        return this.sqlHandler.execute(sql);
    }

    protected boolean delete_user_profile() {
        String sql = "";
        return this.sqlHandler.execute(sql);
    }
}


