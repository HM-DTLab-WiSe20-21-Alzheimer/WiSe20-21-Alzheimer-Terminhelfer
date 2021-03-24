package thecoronials.notification.handler;

import com.xavidop.alexa.client.AlexaProactiveEventSenderClient;
import com.xavidop.alexa.model.urlregion.Environment;
import com.xavidop.alexa.model.urlregion.Region;
import com.xavidop.alexa.model.urlregion.URLRegion;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import thecoronials.utils.config.Config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class NotificationHandlerTest {

    NotificationHandler handler;

    @Before
    public void generateHandler() {
        handler = spy(new NotificationHandler());
    }

    @Test
    public void getStandardConfig() {
        handler.getConfig();
    }

    @Test
    public void getClientWithConfig() {
        // arrange
        final Map<String, String> config = Map.of(
                Config.PROACTIVE_CLIENT_ID, "foo",
                Config.PROACTIVE_SECRET_KEY, "bar"
        );

        when(handler.getConfig()).thenReturn(Config.with(config));

        // act
        final AlexaProactiveEventSenderClient client = handler.getClient();

        // assert
        assertEquals(config.get(Config.PROACTIVE_CLIENT_ID), client.getClientId());
        assertEquals(config.get(Config.PROACTIVE_SECRET_KEY), client.getClientSecret());
    }

    @Test
    public void handleRequest() {
        // arrange
        final String payload = "{" +
                "\"content\": \"foo\"," +
                "\"user\": \"bar\"" +
                "}";

        final InputStream inputStream = new ByteArrayInputStream(payload.getBytes(StandardCharsets.ISO_8859_1));

        final AlexaProactiveEventSenderClient client = mock(AlexaProactiveEventSenderClient.class);

        final ArgumentCaptor<AppointmentReminderEvent> eventCaptor = ArgumentCaptor.forClass(AppointmentReminderEvent.class);
        final ArgumentCaptor<URLRegion> regionCaptor = ArgumentCaptor.forClass(URLRegion.class);

        doReturn(client).when(handler).getClient();
        when(client.sendProactiveEvent(eventCaptor.capture(), regionCaptor.capture())).thenReturn(true);

        // act
        handler.handleRequest(inputStream, null, null);

        final AppointmentReminderEvent event = eventCaptor.getValue();
        final URLRegion region = regionCaptor.getValue();

        // assert
        assertEquals(Region.EU, region.getRegion());
        assertEquals(Environment.DEV, region.getEnvironment());

        assertEquals("Unicast", event.getRelevantAudience().getType());
        assertEquals("Terminhelfer. foo", event.getEvent().getPayload().getMessageGroup().getCreator().getName());
    }

}
