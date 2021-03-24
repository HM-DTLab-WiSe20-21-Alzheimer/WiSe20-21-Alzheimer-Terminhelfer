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

public class OrtBearbeitenHandler implements RequestHandler {

    @Override
    public boolean canHandle(final HandlerInput handlerInput) {
        return handlerInput.matches(intentName("OrtBearbeiten"));
    }

    @Override
    public Optional<Response> handle(final HandlerInput handlerInput) {
        return handleMyInput(new MasterDataInput(handlerInput), handlerInput.getResponseBuilder());
    }

    public Optional<Response> handleMyInput(final MasterDataInput dataInput, final ResponseBuilder responseBuilder) {

        final String targetLocation = dataInput.getSlotValue("location_change");

        final Map<String, Object> locations = dataInput.getLocationsMap();

        final Optional<Response> response;

        String cardTitle = "Termin Helfer";
        if (locations.containsKey(targetLocation)){

            dataInput.removeTargetLocation(targetLocation);

            final Intent nextIntent = Intent.builder()
                    .withName("OrtEintragen")
                    .build();

            final String responseString = "In Ordnung, lass uns " + targetLocation + " erneuern.";

            response = responseBuilder
                    .withSpeech(responseString)
                    .withSimpleCard(cardTitle, responseString)
                    .addDelegateDirective(nextIntent)
                    .build();
        }else{
            final String responseString = "Tut mir leid, ich konnte keinen Ort mit dem Namen " +targetLocation +" finden.";

            response = responseBuilder
                    .withSpeech(responseString)
                    .withSimpleCard(cardTitle, responseString)
                    .withShouldEndSession(true)
                    .build();
        }

        return response;
    }


}
