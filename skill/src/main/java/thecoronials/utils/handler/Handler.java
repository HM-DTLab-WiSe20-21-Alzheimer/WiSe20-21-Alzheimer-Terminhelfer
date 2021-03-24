package thecoronials.utils.handler;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.response.ResponseBuilder;

import java.util.Objects;

/**
 * Alexa skill handler wrapper.
 */
public class Handler {
    public static final String CARD_TITLE = "Termin Helfer";

    /**
     * Intent handler input.
     */
    private final HandlerInput handlerInput;

    /**
     * Create handler wrapper.
     *
     * @param handlerInput Intent handler input.
     */
    public Handler(HandlerInput handlerInput) {
        this.handlerInput = handlerInput;
    }

    /**
     * Create an answer, which contains same display text and speech output.
     *
     * @param cardAndSpeech Speech and Text output.
     * @return Intent response.
     */
    public ResponseBuilder createAnswerBuilder(String cardAndSpeech) {
        Objects.requireNonNull(cardAndSpeech, "Text is required to be non-null");

        return createAnswerBuilder(cardAndSpeech, cardAndSpeech);
    }

    /**
     * Create an answer, which contains different display text and speech output.
     *
     * @param speech Speech output.
     * @param card   Text output.
     * @return Intent Response.
     */
    public ResponseBuilder createAnswerBuilder(String speech, String card) {
        Objects.requireNonNull(speech, "Speech text is required to be non-null");
        Objects.requireNonNull(card, "Card text is required to be non-null");

        return handlerInput.getResponseBuilder()
                .withSpeech(speech)
                .withSimpleCard(CARD_TITLE, card);
    }
}
