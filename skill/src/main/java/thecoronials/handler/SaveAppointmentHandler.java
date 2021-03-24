package thecoronials.handler;
//Author: Fabian Faerber

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;
import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class SaveAppointmentHandler implements RequestHandler {

    @Override
    public boolean canHandle(final HandlerInput handlerInput) {
        return handlerInput.matches(intentName("SaveAppointment"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        return handleMyInput(new MasterDataInput(handlerInput), handlerInput.getResponseBuilder());
    }

    public Optional<Response> handleMyInput(MasterDataInput dataInput, final ResponseBuilder responseBuilder) {

        String title = dataInput.getSessionAttribute("title");
        String date = dataInput.getSessionAttribute("date");
        String time = dataInput.getSessionAttribute("time");
        String location = dataInput.getSessionAttribute("location");
        String transport = dataInput.getSessionAttribute("transport");

        dataInput.setPersistentAttributes(title, date, time, location, transport);

        //remove leading zeros from string for improved audio output
        String[] timeStringSplit = time.split(":");
        timeStringSplit[0] = timeStringSplit[0].replaceFirst("^0+(?!$)", "");
        timeStringSplit[1] = timeStringSplit[1].replaceFirst("^0+(?!$)", "");

        dataInput.sendNotification(title, date, time);

        String responseString =  "Der Termin " + title
                + " am " + date
                + " um " + timeStringSplit[0] + " Uhr " + timeStringSplit[1]
                + " wird gespeichert. Zu deinem Ziel " + location
                + " kommst du per " + transport;

        return responseBuilder.withSpeech(responseString)
                .withSimpleCard("Termin Helfer", responseString)
                .withShouldEndSession(true)
                .build();
    }


}
