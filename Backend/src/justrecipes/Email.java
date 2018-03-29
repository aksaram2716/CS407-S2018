package justrecipes;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Properties;

/**
 * Created by Akshit on 02/14/2018.
 */
public class Email {

    private SmtpAuthenticator authentication;
    private String username;

    private class SmtpAuthenticator extends Authenticator {
        private String username = "justrecipes2018@gmail.com";
        private String password = "HelloWorld123";

        @Override
        public PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(this.username, this.password);
        }
    }

    public Email() {
        this.username = "justrecipes2018@gmail.com";
        this.authentication = new SmtpAuthenticator();
    }

    public boolean send(String recipient, String subject, String text) {
        ArrayList<String> to = new ArrayList<>();
        to.add(recipient);
        return send(to, subject, text);
    }

    public boolean send(ArrayList<String> to, String subject, String text) {
        String from = this.username;
        String host = "smtp.gmail.com";

        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");
        properties.setProperty("mail.smtp.host", host);
        properties.setProperty("mail.smtp.port", "587");

        Session session = Session.getDefaultInstance(properties, this.authentication);

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from, "JustRecipes"));

            for(String recipient : to) {
                message.addRecipient(Message.RecipientType.TO,
                        new InternetAddress(recipient));
            }

            message.setSubject(subject);
            message.setContent(text, "text/html");

            Transport.send(message);
            System.out.println("Sent message successfully....");

        } catch (MessagingException mex) {
            mex.printStackTrace();
            return false;
        } catch (IOException e) {
            System.out.println("Failed to read file");
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
