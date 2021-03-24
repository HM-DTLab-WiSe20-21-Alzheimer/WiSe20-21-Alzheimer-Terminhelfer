package thecoronials.handler;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.Response;
import com.amazon.ask.model.Slot;
import java.util.*;
import java.util.stream.Collectors;
import static com.amazon.ask.request.Predicates.intentName;


public class TerminAusgabeHandler implements RequestHandler {
    public static final int INDEX_TIME_BEGIN = 11;
    public static final int INDEX_TIME_END = 16;

    @Override
    public boolean canHandle(HandlerInput handlerInput) {

        return handlerInput.matches(intentName("TerminAusgabe"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        // Get date slot
        final IntentRequest intentRequest = (IntentRequest) handlerInput.getRequestEnvelope().getRequest();
        final Map<String, Slot> slots = intentRequest.getIntent().getSlots();
        final String date = slots.get("date").getValue();

        // Get appointments to output
        final Map<String, Object> persistentAttributes = handlerInput.getAttributesManager().getPersistentAttributes();
        final Map<String, Map<String, String>> appointmentsAll = (Map<String, Map<String, String>>) persistentAttributes.get("appointments");
        final List<Map<String, String>> appointments = appointmentsAll == null ? List.of() : getAppointmentsOfDate(date, appointmentsAll);

        // Build output
        final String speechOutput = buildOutput(date, appointments);

        return handlerInput.getResponseBuilder()
                .withSpeech(speechOutput)
                .withSimpleCard("Terminhelfer Termine", speechOutput)
                .build();
    }

    /**
     * Get appointments of date.
     *
     * @param date Date to get appointments for. Format: yyyy-mm-dd
     * @return Appointments of given date.
     */
    public List<Map<String, String>> getAppointmentsOfDate(String date, Map<String, Map<String, String>> appointments) {
        return appointments.values()
                .stream()
                .filter(appointment -> appointment.get("dateTime").contains(date))
                .collect(Collectors.toList());
    }

    /**
     * Build speech output.
     *
     * @param date         Date of appointments.
     * @param appointments Appointments of date.
     * @return Speech output for alexa.
     */
    public String buildOutput(String date, List<Map<String, String>> appointments) {
        final StringBuilder speechOutput = new StringBuilder("Deine Termine am " + date + ":");

        appointments.forEach(appointment -> {
            final String title = appointment.get("title");
            final String time = appointment.get("dateTime").substring(INDEX_TIME_BEGIN, INDEX_TIME_END);

            speechOutput.append("Du hast um ")
                    .append(time)
                    .append(" Uhr den Termin ")
                    .append(title)
                    .append(".");
        });

        if (appointments.isEmpty()) {
            speechOutput.append("Du hast an diesem Tag keine Termine.");
        }

        return speechOutput.toString();
    }
}
