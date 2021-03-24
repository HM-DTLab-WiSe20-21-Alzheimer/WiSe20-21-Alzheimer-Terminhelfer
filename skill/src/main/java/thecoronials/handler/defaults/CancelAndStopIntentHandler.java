package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import thecoronials.utils.handler.Handler;

import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class CancelAndStopIntentHandler implements RequestHandler {
    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(intentName("AMAZON.StopIntent").or(intentName("AMAZON.CancelIntent")));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        return new Handler(handlerInput)
                .createAnswerBuilder("Auf Wiedersehen. Wenn du mich wieder brauchst, frage nach Termin Helfer")
                .withShouldEndSession(true)
                .build();
    }
}
