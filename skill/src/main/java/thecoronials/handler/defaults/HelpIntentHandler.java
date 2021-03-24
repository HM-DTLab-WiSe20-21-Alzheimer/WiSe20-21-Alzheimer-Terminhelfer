package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import thecoronials.utils.handler.Handler;

import java.util.Optional;

import static com.amazon.ask.request.Predicates.intentName;

public class HelpIntentHandler implements RequestHandler {
    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(intentName("AMAZON.HelpIntent"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        final Handler handler = new Handler(handlerInput);
        final String speechText = "Du kannst zum Beispiel sagen <emphasis level=\"moderate\">Trage einen Termin ein</emphasis>. Die Hilfe in der App gibt dir mehr Hinweise zu meinen Funktionen.";
        return handler
                .createAnswerBuilder(
                        speechText,
                        "Du kannst sagen 'Trage einen Termin ein'. Die Hilfe in der App gibt dir mehr Hinweise zu meinen Funktionen."
                )
                .withReprompt(speechText)
                .build();
    }
}
