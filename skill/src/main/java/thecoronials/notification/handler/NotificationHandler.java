package thecoronials.notification.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.xavidop.alexa.client.AlexaProactiveEventSenderClient;
import com.xavidop.alexa.model.urlregion.Environment;
import com.xavidop.alexa.model.urlregion.Region;
import com.xavidop.alexa.model.urlregion.URLRegion;
import thecoronials.utils.config.Config;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class NotificationHandler implements RequestStreamHandler {

    /**
     * Get config for client.
     * @return App-config.
     */
    Config getConfig() {
        return Config.standard();
    }

    /**
     * Get event-sender client.
     * @return event-sender client.
     */
    AlexaProactiveEventSenderClient getClient() {
        final Config config = getConfig();

        return new AlexaProactiveEventSenderClient(
                config.getProperty(Config.PROACTIVE_CLIENT_ID),
                config.getProperty(Config.PROACTIVE_SECRET_KEY)
        );
    }

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.ISO_8859_1));
        Gson gson = new Gson();
        JsonObject event = gson.fromJson(reader, JsonElement.class).getAsJsonObject();

        final String content = event.getAsJsonPrimitive("content").getAsString();
        final String user = event.getAsJsonPrimitive("user").getAsString();

        final AppointmentReminderEvent appointmentReminder = new AppointmentReminderEvent(user, content, 10);

        final AlexaProactiveEventSenderClient client = getClient();

        final URLRegion region = new URLRegion();
        region.setRegion(Region.EU);
        region.setEnvironment(Environment.DEV);

        client.sendProactiveEvent(appointmentReminder, region);
    }
}
