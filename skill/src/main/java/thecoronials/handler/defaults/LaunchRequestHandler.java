package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.LaunchRequest;
import com.amazon.ask.model.Response;
import com.amazon.ask.request.Predicates;
import thecoronials.utils.handler.Handler;

import java.util.Optional;

public class LaunchRequestHandler implements RequestHandler {
    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(Predicates.requestType(LaunchRequest.class));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        final String speechText = "Willkommen beim Termin Helfer. Was moechtest du tun?";
        return new Handler(handlerInput)
                .createAnswerBuilder(
                        speechText,
                        "Willkommen beim Termin Helfer. Was möchtest du tun?"
                )
                .withReprompt(speechText)
                .build();
    }
}
