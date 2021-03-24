package thecoronials.handler;

import com.xavidop.alexa.client.AlexaProactiveEventSenderClient;
import com.xavidop.alexa.model.event.*;
import com.xavidop.alexa.model.urlregion.URLRegion;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;
import thecoronials.utils.config.Config;

import java.util.Map;

import static org.mockito.Mockito.*;

public class ReminderDailyOverviewHandlerTest {
    private Config mockConfig() {
        return Config.with(Map.of(
                Config.PROACTIVE_CLIENT_ID, "ClientId",
                Config.PROACTIVE_SECRET_KEY, "SecretId"
        ));
    }

    private AlexaProactiveEventSenderClient mockSender() {
        AlexaProactiveEventSenderClient sender = Mockito.mock(AlexaProactiveEventSenderClient.class);
        Mockito.when(sender.sendProactiveEvent(mockEvent(), mockUrlRegion())).thenReturn(true);
        return sender;
    }

    private ProactiveEvent mockEvent() {
        return Mockito.mock(ProactiveEvent.class);
    }

    private URLRegion mockUrlRegion() {
        return Mockito.mock(URLRegion.class);
    }


    @Test
    public void testSendEvent() {
        var sut = new ReminderDailyOverviewHandler(mockConfig());

        final AlexaProactiveEventSenderClient sender = mockSender();
        final boolean have = sut.sendEvent(sender);
        Assert.assertTrue(have);
    }

    @Test
    public void testGetSender() {
        final Config config = mockConfig();
        var sut = new ReminderDailyOverviewHandler(config);

        final AlexaProactiveEventSenderClient have = sut.getEventSender(config);
        Assert.assertNotNull(have);
    }

    @Test
    public void testHandle() {
        final Config config = mockConfig();
        var sut = spy(new ReminderDailyOverviewHandler(config));
        var sender = mock(AlexaProactiveEventSenderClient.class);
        doAnswer(__ -> sender).when(sut).getEventSender(any());

        sut.handle();

        verify(sender, times(1)).sendProactiveEvent(any(), any());
    }
}
