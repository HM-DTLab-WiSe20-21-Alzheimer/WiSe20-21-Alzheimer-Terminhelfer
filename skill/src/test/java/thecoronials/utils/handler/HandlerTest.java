package thecoronials.utils.handler;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.RequestEnvelope;
import com.amazon.ask.model.Response;
import com.amazon.ask.model.er.dynamic.EntityListItem;
import com.amazon.ask.response.ResponseBuilder;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runner.Runner;
import org.junit.runners.Parameterized;

import java.security.PublicKey;
import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

@RunWith(Enclosed.class)
public class HandlerTest {
    @Rule
    public Timeout globalTimeout = Timeout.seconds(20);

    private static HandlerInput generateHandlerInputSpy() {
        return spy(HandlerInput.builder()
                .withRequestEnvelope(
                        RequestEnvelope.builder()
                                .withRequest(IntentRequest.builder().build())
                                .build()
                )
                .build());
    }

    private static ResponseBuilder spyOnResponse(HandlerInput handlerInput) {
        final ResponseBuilder responseBuilder = spy(new ResponseBuilder());
        when(handlerInput.getResponseBuilder()).thenReturn(responseBuilder);

        return responseBuilder;
    }

    public static class Tests {
        @Test
        public void shouldAnswerSpeechEqualsCard() {
            final HandlerInput handlerInput = generateHandlerInputSpy();
            final ResponseBuilder responseBuilder = spyOnResponse(handlerInput);

            final String answerText = "lorem ipsum dolor sit amet";

            final Handler sut = new Handler(handlerInput);
            final Optional<Response> answer = sut.createAnswerBuilder(answerText).build();

            verify(responseBuilder).withSimpleCard(Handler.CARD_TITLE, answerText);
            verify(responseBuilder).withSpeech(answerText);
            assertTrue(answer.isPresent());
        }

        @Test
        public void shouldAnswerSpeechNotEqualsCard() {
            final HandlerInput handlerInput = generateHandlerInputSpy();
            final ResponseBuilder responseBuilder = spyOnResponse(handlerInput);

            final String answerTextSpeech = "lorem ipsum dolor sit amet";
            final String answerTextCard = "lorem ipsum";

            final Handler sut = new Handler(handlerInput);
            final Optional<Response> answer = sut.createAnswerBuilder(answerTextSpeech, answerTextCard).build();

            verify(responseBuilder).withSimpleCard(Handler.CARD_TITLE, answerTextCard);
            verify(responseBuilder).withSpeech(answerTextSpeech);
            assertTrue(answer.isPresent());
        }

        @Test(expected = NullPointerException.class)
        public void shouldNotAnswerSpeechEqualsCardEqualsNull() {
            final HandlerInput handlerInput = generateHandlerInputSpy();

            final Handler sut = new Handler(handlerInput);
            sut.createAnswerBuilder(null);
        }
    }

    @RunWith(Parameterized.class)
    public static class CreateAnswerBuilderTests {
        @Parameterized.Parameters
        public static Collection<Object[]> data() {
            return Arrays.asList(new Object[][]{
                    {null, null},
                    {"lorem", null},
                    {null, "lorem"},
            });
        }

        final String speech;
        final String card;

        public CreateAnswerBuilderTests(String speech, String card) {
            this.speech = speech;
            this.card = card;
        }


        @Test(expected = NullPointerException.class)
        public void shouldNotAnswerSpeechNotEqualsCard() {
            final HandlerInput handlerInput = generateHandlerInputSpy();

            final Handler sut = new Handler(handlerInput);
            sut.createAnswerBuilder(speech, card);
        }
    }
}
