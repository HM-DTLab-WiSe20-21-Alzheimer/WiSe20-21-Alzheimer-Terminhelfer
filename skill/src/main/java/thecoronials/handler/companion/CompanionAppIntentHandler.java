package thecoronials.handler.companion;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import com.amazon.ask.request.Predicates;
import thecoronials.utils.handler.Handler;

import java.util.Optional;

public class CompanionAppIntentHandler implements RequestHandler {
    private static final String INTENT_NAME = "CompanionAppIntent";

    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(Predicates.intentName(INTENT_NAME));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        final Handler handler = new Handler(handlerInput);

        return handler.createAnswerBuilder(
                "Es gibt eine Webapp. Du kannst sie auf deinem Handy oder Computer öffnen."
        ).build();
    }
}
