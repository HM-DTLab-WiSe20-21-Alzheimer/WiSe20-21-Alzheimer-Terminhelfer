package thecoronials.handler;

import com.xavidop.alexa.client.AlexaProactiveEventSenderClient;
import com.xavidop.alexa.model.event.ProactiveEvent;
import com.xavidop.alexa.model.urlregion.Environment;
import com.xavidop.alexa.model.urlregion.Region;
import com.xavidop.alexa.model.urlregion.URLRegion;
import thecoronials.utils.config.Config;


public class ReminderDailyOverviewHandler {
    private final Config config;

    //Scheduled Event trigger needs a constructor with zero arguments
    public ReminderDailyOverviewHandler() {
        this.config = Config.standard();
    }

    //For test reasons ctor with conifgReader is needed
    public ReminderDailyOverviewHandler(Config config) {
        this.config = config;
    }

    public void handle() {
        sendEvent(getEventSender(config));
    }

    public boolean sendEvent(AlexaProactiveEventSenderClient sender) {
        final ProactiveEvent event = new ProactiveEvent();
        event.getEvent()
                .getPayload()
                .getMessageGroup()
                .getCreator()
                .setName("Hol dir deine heutige Termin Uebersicht! Sage dazu: Alexa, frage Termin Helfer, welche Termine habe ich heute?");

        final URLRegion region = new URLRegion();
        region.setRegion(Region.EU);
        region.setEnvironment(Environment.DEV);

        sender.sendProactiveEvent(event, region);
        return true;
    }

    public AlexaProactiveEventSenderClient getEventSender(Config config) {
        return new AlexaProactiveEventSenderClient(
                config.getProperty(Config.PROACTIVE_CLIENT_ID),
                config.getProperty(Config.PROACTIVE_SECRET_KEY)
        );
    }
}
