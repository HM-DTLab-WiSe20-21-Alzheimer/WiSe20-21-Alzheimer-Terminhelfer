package thecoronials.handler;
//Author: Fabian Faerber

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;
import thecoronials.models.Location;
import thecoronials.utils.numbers.SpeechToInteger;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class OrtEintragenHandler implements RequestHandler {

    @Override
    public boolean canHandle(final HandlerInput handlerInput) {
        return handlerInput.matches(intentName("OrtEintragen"));
    }

    @Override
    public Optional<Response> handle(final HandlerInput handlerInput) {
        return handleMyInput(new MasterDataInput(handlerInput), handlerInput.getResponseBuilder());
    }

    public Optional<Response> handleMyInput(final MasterDataInput dataInput, final ResponseBuilder responseBuilder) {

        final String titleLocation = dataInput.getSlotValue("title_location");
        final String address = SpeechToInteger.convertSentence(dataInput.getSlotValue("address"));
        final String transportLocation = dataInput.getSlotValue("transport_location");

        Optional<Location> location = dataInput.getLocation(address);

        final String cardTitle = "Termin Helfer";

        if (location.isPresent()) {
            final Map<String, String> locationDetails = new HashMap<>();
            locationDetails.put("hausnr", location.get().getHouseNumber());
            locationDetails.put("plz", location.get().getPostalCode());
            locationDetails.put("stadt", location.get().getCity());
            locationDetails.put("strasse", location.get().getStreet());
            locationDetails.put("coordinates", location.get().getCoordinates());
            locationDetails.put("transport", transportLocation);

            dataInput.setPersistentAttribute(titleLocation, locationDetails);

            final String responseString = "Ich habe mir " + titleLocation + " in " +
                    location.get().getStreet() + " " + location.get().getHouseNumber() + " in " +
                    "<say-as interpret-as=\"spell-out\">"
                    + location.get().getPostalCode() + "</say-as>" + " " + location.get().getCity() +
                    " gemerkt. Dein bevorzugtes Verkehrsmittel ist " + transportLocation + ".";

            final Optional<Response> response;

            final Map<String, Object> sessionAttributes = dataInput.getSessionAttributes();

            if (sessionAttributes.containsKey("title")) {
                sessionAttributes.put("transport", transportLocation);

                final Intent nextIntent = Intent.builder()
                        .withName("SaveAppointment")
                        .build();

                response = responseBuilder
                        .withSpeech(responseString)
                        .withSimpleCard(cardTitle, responseString)
                        .addDelegateDirective(nextIntent)
                        .build();
            } else {
                response = responseBuilder
                        .withSpeech(responseString)
                        .withSimpleCard(cardTitle, responseString)
                        .withShouldEndSession(true)
                        .build();
            }

            return response;

        } else {
            final String responseString = "Tut mir leid, " + address + " konnte ich nicht finden.";

            return responseBuilder
                    .withShouldEndSession(true)
                    .withSpeech(responseString)
                    .withSimpleCard(cardTitle, responseString)
                    .build();
        }
    }
}
