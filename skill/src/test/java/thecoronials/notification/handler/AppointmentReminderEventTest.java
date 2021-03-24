package thecoronials.notification.handler;

import com.xavidop.alexa.model.event.RelevantAudience;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class AppointmentReminderEventTest {

    @Test(expected = IllegalArgumentException.class)
    public void expectsExpireGreaterThan5min() {
        new AppointmentReminderEvent("", "", 4);
    }

    @Test(expected = IllegalArgumentException.class)
    public void expectsLesserThan24h() {
        new AppointmentReminderEvent("", "", 24*60+1);
    }

    @Test
    public void setEventContent() {
        // arrrange
        final String content = "foo";
        final AppointmentReminderEvent event = new AppointmentReminderEvent("", content, 10);

        // act
        final String name = event.getEvent().getPayload().getMessageGroup().getCreator().getName();

        // assert
        assertEquals("Terminhelfer. " + content, name);
    }

    @Test
    public void setRelevantAudience() {
        // arrrange
        final String content = "foo";
        final AppointmentReminderEvent event = new AppointmentReminderEvent("", content, 10);

        // act
        final RelevantAudience relevantAudience = event.getRelevantAudience();

        // assert
        assertEquals("Unicast", relevantAudience.getType());
        assertTrue(relevantAudience.getPayload() instanceof UserAudience);
    }

}
