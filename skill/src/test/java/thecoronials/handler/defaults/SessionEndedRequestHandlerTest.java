package thecoronials.handler.defaults;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.*;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import thecoronials.handler.defaults.SessionEndedRequestHandler;

import java.util.Optional;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class SessionEndedRequestHandlerTest {

    @Rule
    public Timeout globalTimeout = Timeout.seconds(20);

    private static RequestHandler handler;

    @Before
    public void init() {
        handler = new SessionEndedRequestHandler();
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

    @Test
    public void doesMatch() {
        final HandlerInput handlerInput = getHandlerInput(SessionEndedRequest.builder().build());

        final boolean canHandle = handler.canHandle(handlerInput);

        assertTrue(canHandle);
    }

    @Test
    public void doesNotMatch() {
        final HandlerInput handlerInput = getHandlerInput(LaunchRequest.builder().build());

        final boolean canHandle = handler.canHandle(handlerInput);

        assertFalse(canHandle);
    }

    @Test
    public void doesHandle() {
        final HandlerInput handlerInput = getHandlerInput(SessionEndedRequest.builder().build());

        final Optional<Response> response = handler.handle(handlerInput);

        assertTrue(response.isPresent());
    }

}
