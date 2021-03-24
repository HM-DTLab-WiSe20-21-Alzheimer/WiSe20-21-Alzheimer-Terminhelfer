package thecoronials.handler.companion;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.Response;
import com.amazon.ask.request.Predicates;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import thecoronials.repositories.link.LinkRepository;
import thecoronials.utils.dynamodbfactory.DynamoDBFactory;
import thecoronials.utils.handler.Handler;

import java.util.Optional;

public class CompanionLinkIntentHandler implements RequestHandler {
    private final DynamoDBFactory dynamoDBFactory;

    public CompanionLinkIntentHandler(DynamoDBFactory dynamoDBFactory) {
        this.dynamoDBFactory = dynamoDBFactory;
    }

    @Override
    public boolean canHandle(HandlerInput handlerInput) {
        return handlerInput.matches(Predicates.intentName("CompanionLinkIntent"));
    }

    @Override
    public Optional<Response> handle(HandlerInput handlerInput) {
        final DynamoDB dynamoDB = dynamoDBFactory.build();
        final Handler handler = new Handler(handlerInput);

        final LinkRepository linkRepository;
        try {
            linkRepository = new LinkRepository(dynamoDB);
        } catch (InterruptedException e) {
            return handler.createAnswerBuilder("Beim Erstellen des Verbindungscodes ist ein Fehler aufgetreten.").build();
        }

        final String userId = handlerInput.getRequestEnvelope().getSession().getUser().getUserId();
        final String linkId = linkRepository.getOrCreate(userId);

        final String linkWithBreaks = String.join("<break time=\"700ms\"/>", linkId.split(""));


        return handler.createAnswerBuilder(
                "Dein Verbindungscode lautet <say-as interpret-as=\"spell-out\">" + linkWithBreaks + "</say-as>",
                "Dein Verbindungscode lautet " + linkId
        ).build();
    }
}
