package thecoronials.notification.handler;

import com.xavidop.alexa.model.event.ProactiveEvent;
import com.xavidop.alexa.model.event.RelevantAudience;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;

/**
 * Appointment reminder event.
 */
public class AppointmentReminderEvent extends ProactiveEvent {
    /**
     * Create appointment reminder event.
     *
     * @param userId          Alexa user id.
     * @param text            Text for notification.
     * @param expiresAfterMin Number of minutes after the notifications expires. Greater than 5, lesser than 1440.
     */
    public AppointmentReminderEvent(String userId, String text, int expiresAfterMin) {
        super();

        if (expiresAfterMin < 5) {
            throw new IllegalArgumentException("expiresAfterMin has to be greater than 5min");
        }

        if (expiresAfterMin > 24 * 60) {
            throw new IllegalArgumentException("expiresAfterMin has to be lower than 24h");
        }

        final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("CET"));

        final Calendar calendar = new GregorianCalendar();
        calendar.add(Calendar.MINUTE, expiresAfterMin);
        final String expire = sdf.format(calendar.getTime());

        withRelevantAudience(new RelevantAudience().withType("Unicast").withPayload(new UserAudience(userId)));
        withExpiryTime(expire);

        getEvent().getPayload().getMessageGroup().getCreator().setName("Terminhelfer. " + text);
    }
}
