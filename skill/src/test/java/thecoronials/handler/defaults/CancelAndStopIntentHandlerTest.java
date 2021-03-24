package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.*;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import thecoronials.handler.defaults.CancelAndStopIntentHandler;

import java.util.Optional;

import static org.junit.Assert.assertTrue;

public class CancelAndStopIntentHandlerTest {

    @Rule
    public Timeout globalTimeout = Timeout.seconds(20);

    private static RequestHandler handler;

    @Before
    public void init() {
        handler = new CancelAndStopIntentHandler();
    }

    private HandlerInput getHandlerInput(Request request) {
        final RequestEnvelope requestEnvelope = RequestEnvelope
                .builder()
                .withRequest(request)
                .build();

        return HandlerInput
                .builder()
                .withRequestEnvelope(requestEnvelope)
                .build();
    }

    private IntentRequest getRequest(String name) {
        final Intent intent = Intent.builder()
                .withName(name)
                .build();

        return IntentRequest.builder().withIntent(intent).build();
    }

    @Test
    public void doesMatchStopIntent() {
        final IntentRequest intentRequest = getRequest("AMAZON.StopIntent");
        final HandlerInput handlerInput = getHandlerInput(intentRequest);

        final boolean canHandle = handler.canHandle(handlerInput);

        assertTrue(canHandle);
    }

    @Test
    public void doesMatchCancelIntent() {
        final IntentRequest intentRequest = getRequest("AMAZON.CancelIntent");
        final HandlerInput handlerInput = getHandlerInput(intentRequest);

        final boolean canHandle = handler.canHandle(handlerInput);

        assertTrue(canHandle);
    }

    @Test
    public void doesHandle() {
        final IntentRequest intentRequest = getRequest("AMAZON.CancelIntent");
        final HandlerInput handlerInput = getHandlerInput(intentRequest);

        final Optional<Response> response = handler.handle(handlerInput);

        assertTrue(response.isPresent());
        assertTrue(response.get().getShouldEndSession());
    }

}
