package thecoronials.handler;

import static com.amazon.ask.request.Predicates.intentName;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import thecoronials.utils.handler.Handler;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;


public class DailyOverviewHandler implements RequestHandler{
    private static final int INDEX_TIME_BEGIN = 11;
    private static final int INDEX_TIME_END = 16;

    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(intentName("GiveDailyOverview"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        final String speechText = generateSpeechText(handlerInput);

        return new Handler(handlerInput)
                .createAnswerBuilder(speechText)
                .build();
    }


    public String generateSpeechText(HandlerInput handlerInput) {
        final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        final Date date = new Date();
        final String today = dateFormat.format(date);

        Map<String, Object> persistentAttributes = handlerInput.getAttributesManager().getPersistentAttributes();
        if (persistentAttributes == null) {
            return "Fehler bei Anforderung der Datenbank";
        }

        Map<String, Map<String, String>> appointments = (Map<String, Map<String, String>>) persistentAttributes.get("appointments");
        if (appointments == null) {
            return "Du hast noch keine Termine angelegt";
        }

        final List<Map<String, String>> appointmentsToday = appointments.values()
                .stream()
                .filter(appointment -> appointment.get("dateTime").contains(today))
                .collect(Collectors.toList());
        if (appointmentsToday.isEmpty()) {
            return "Hier ist deine taegliche Uebersicht. Du hast heute keine Termine.";
        }

        final StringBuilder speechText = new StringBuilder("Hier ist deine taegliche Uebersicht. ");
        appointmentsToday.forEach(appointment -> {
            final String title = appointment.get("title");
            final String time = appointment.get("dateTime").substring(INDEX_TIME_BEGIN, INDEX_TIME_END);

            speechText.append("Du hast um ")
                    .append(time)
                    .append(" Uhr den Termin ")
                    .append(title)
                    .append(". ");
        });

        return speechText.toString();
    }
}
