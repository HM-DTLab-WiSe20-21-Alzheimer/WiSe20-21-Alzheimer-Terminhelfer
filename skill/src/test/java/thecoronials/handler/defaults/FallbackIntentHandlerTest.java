package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.*;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Optional;

import static org.junit.Assert.*;

public class FallbackIntentHandlerTest {
    @Rule
    public Timeout globalTimeout = Timeout.seconds(20);

    private static RequestHandler handler;

    @Before
    public void init() {
        handler = new FallbackIntentHandler();
    }

    private HandlerInput getHandlerInput() {
        final RequestEnvelope requestEnvelope = RequestEnvelope
                .builder()
                .withRequest(getRequest())
                .build();

        return HandlerInput
                .builder()
                .withRequestEnvelope(requestEnvelope)
                .build();
    }

    private IntentRequest getRequest() {
        final Intent intent = Intent.builder()
                .withName("AMAZON.FallbackIntent")
                .build();

        return IntentRequest.builder().withIntent(intent).build();
    }

    @Test
    public void doesMatch() {
        final HandlerInput handlerInput = getHandlerInput();

        final boolean canHandle = handler.canHandle(handlerInput);

        assertTrue(canHandle);
    }

    @Test
    public void doesHandle() {
        final HandlerInput handlerInput = getHandlerInput();

        final Optional<Response> canHandle = handler.handle(handlerInput);

        assertTrue(canHandle.isPresent());
        assertNotNull(canHandle.get().getReprompt());
    }
}
