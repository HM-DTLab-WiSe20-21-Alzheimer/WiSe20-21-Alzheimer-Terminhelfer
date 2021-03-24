package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import thecoronials.utils.handler.Handler;

import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class FallbackIntentHandler implements RequestHandler {
    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(intentName("AMAZON.FallbackIntent"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        String speechText = "Das habe ich nicht leider verstanden. Schaue doch auf deine Hilfekarte, um Infos zu meinen Funktionen erhalten.";
        return new Handler(handlerInput)
                .createAnswerBuilder(speechText)
                .withReprompt(speechText)
                .build();
    }
}
