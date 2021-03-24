package thecoronials.handler;
//Author: Fabian Faerber

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;

import java.util.Map;
import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class TerminEintragenHandler implements RequestHandler {

    @Override
    public boolean canHandle(final HandlerInput handlerInput) {
        return handlerInput.matches(intentName("TerminEintragen"));
    }

    @Override
    public Optional<Response> handle(final HandlerInput handlerInput) {
        return handleMyInput(new MasterDataInput(handlerInput), handlerInput.getResponseBuilder());
    }

    public Optional<Response> handleMyInput(final MasterDataInput dataInput, final ResponseBuilder responseBuilder) {


        final String title = dataInput.getSlotValue("title");
        final String date = dataInput.getSlotValue("date");
        final String time = dataInput.getSlotValue("time");
        final String location = dataInput.getSlotValue("location");

        final Intent nextIntent;
        final Optional<Response> response;

        final Map<String, Object> sessionAttributes = dataInput.getSessionAttributes();

        //check if appointment date is in the future
        String cardTitle = "Termin Helfer";
        if (dataInput.appointmentInThePast(date)) {
            final String responseString = "Der Termin liegt in der Vergangenheit. Bitte versuche es noch einmal.";

            response = responseBuilder
                    .withSpeech(responseString)
                    .withShouldEndSession(true)
                    .build();

            //check if location is in database
        } else if (dataInput.locationDoesNotExist(location)) {
            nextIntent = Intent.builder()
                    .withName("OrtEintragen")
                    .build();

            final String responseString = "Diesen Ort kenne ich nicht. Bitte gib mir ein Paar Details.";

            response = responseBuilder
                    .withSpeech(responseString)
                    .withSimpleCard(cardTitle, responseString)
                    .addDelegateDirective(nextIntent)
                    .build();

        } else {
            //if location exists in database get transport from database for later use
            final String transport = dataInput.getTransportFromLocation(location);
            sessionAttributes.put("transport", transport);

            nextIntent = Intent.builder()
                    .withName("UseDefaultTransport")
                    .build();

            final String responseString = "Hast du vor wie immer dort hin zu gelangen? Per " + dataInput.getTransportFromLocation(location);

            response = responseBuilder
                    .withSpeech(responseString)
                    .withSimpleCard(cardTitle, responseString)
                    .addDelegateDirective(nextIntent)
                    .build();
        }

        sessionAttributes.put("title", title);
        sessionAttributes.put("date", date);
        sessionAttributes.put("time", time);
        sessionAttributes.put("location", location);

        dataInput.setSessionAttributes(sessionAttributes);

        return response;
    }
}
