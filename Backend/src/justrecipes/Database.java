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
}


