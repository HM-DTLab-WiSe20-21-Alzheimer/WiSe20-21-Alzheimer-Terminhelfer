package thecoronials.handler;
//Author: Fabian Faerber

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;

import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class UseDefaultTransportHandler implements RequestHandler {
    @Override
    public boolean canHandle(final HandlerInput handlerInput) {
        return handlerInput.matches(intentName("UseDefaultTransport"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        return handleMyInput(new MasterDataInput(handlerInput), handlerInput.getResponseBuilder());
    }

    public Optional<Response> handleMyInput(final MasterDataInput transportInput, final ResponseBuilder responseBuilder) {

        final String jaNein = transportInput.getSlotValue("jaNein");

        final Optional<Response> response;

        if ("nein".equals(jaNein)) {
            final Intent nextIntent = Intent.builder()
                    .withName("AddTransport")
                    .build();
            response = responseBuilder
                    .addDelegateDirective(nextIntent)
                    .build();
        } else {
            final Intent nextIntent = Intent.builder()
                    .withName("SaveAppointment")
                    .build();
            response = responseBuilder
                    .addDelegateDirective(nextIntent)
                    .build();
        }

        return response;
    }

}
