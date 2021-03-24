package thecoronials.handler.companion;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.dispatcher.request.handler.RequestHandler;
import com.amazon.ask.model.*;
import com.amazon.ask.response.ResponseBuilder;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.model.ListTablesResult;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.mockito.ArgumentCaptor;
import thecoronials.repositories.link.LinkTable;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class CompanionLinkIntentHandlerTest {
    @Rule
    public Timeout globalTimeout = Timeout.seconds(20);

    private static RequestHandler handler;
    private final static String LINK_ID = "ABCDE12";
    private final static String INTENT_NAME = "CompanionLinkIntent";

    @Before
    public void init() {
        handler = new CompanionLinkIntentHandler(this::getDynamoDBMock);
    }

    private TableCollection<ListTablesResult> getTableCollectionMock(List<Table> tables) {
        final TableCollection<ListTablesResult> tableCollection = mock(TableCollection.class);
        when(tableCollection.spliterator()).thenReturn(tables.spliterator());

        return tableCollection;
    }

    private Table getTableMock() {
        final Item item = mock(Item.class);
        when(item.getString(LinkTable.FIELD_LINK_ID)).thenReturn(LINK_ID);

        final ItemCollection<QueryOutcome> itemCollection = mock(ItemCollection.class);
        when(itemCollection.spliterator()).thenAnswer(__ -> List.of(item).spliterator());

        final Index index = mock(Index.class);
        when(index.query(any(QuerySpec.class))).thenReturn(itemCollection);

        final Table table = mock(Table.class);
        when(table.getTableName()).thenReturn(LinkTable.TABLE);
        when(table.getIndex(LinkTable.INDEX_ALEXA_UID)).thenReturn(index);

        return table;
    }

    private DynamoDB getDynamoDBMock() {
        final DynamoDB dynamoDB = mock(DynamoDB.class);

        final Table table = getTableMock();
        final TableCollection<ListTablesResult> tableCollection = getTableCollectionMock(
                List.of(table)
        );

        when(dynamoDB.listTables()).thenReturn(tableCollection);
        when(dynamoDB.getTable(LinkTable.TABLE)).thenReturn(table);

        return dynamoDB;
    }

    private HandlerInput getHandlerInputMock(String intentName, ResponseBuilder responseBuilder) {
        final Intent intent = mock(Intent.class);
        when(intent.getName()).thenReturn(intentName);

        final IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();

        final RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();

        final User user = mock(User.class);
        when(user.getUserId()).thenReturn("alexa.user.id.123467987465841654864");

        final Session session = mock(Session.class);
        when(session.getUser()).thenReturn(user);

        final RequestEnvelope requestEnvelopeSpy = spy(requestEnvelope);
        when(requestEnvelopeSpy.getSession()).thenReturn(session);

        final HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelopeSpy).build();
        final HandlerInput handlerInputSpy = spy(handlerInput);

        if (responseBuilder != null) {
            when(handlerInputSpy.getResponseBuilder()).thenReturn(responseBuilder);
        }

        return handlerInputSpy;
    }

    private HandlerInput getHandlerInputMock(String intentName) {
        return getHandlerInputMock(intentName, null);
    }

    @Test
    public void canHandleIntent() {
        // arrange
        final HandlerInput handlerInput = getHandlerInputMock(INTENT_NAME);

        // act
        final boolean canHandle = handler.canHandle(handlerInput);

        // assert
        assertTrue(canHandle);
    }

    @Test
    public void canNotHandleRandomIntent() {
        // arrange
        final HandlerInput handlerInput = getHandlerInputMock("Huhfaiuwehdiaun");

        // act
        final boolean canHandle = handler.canHandle(handlerInput);

        // assert
        assertFalse(canHandle);
    }

    @Test
    public void canNotHandleEmptyIntent() {
        // arrange
        final HandlerInput handlerInput = getHandlerInputMock("");

        // act
        final boolean canHandle = handler.canHandle(handlerInput);

        // assert
        assertFalse(canHandle);
    }

    @Test
    public void canNotHandleNullIntent() {
        // arrange
        final HandlerInput handlerInput = getHandlerInputMock(null);

        // act
        final boolean canHandle = handler.canHandle(handlerInput);

        // assert
        assertFalse(canHandle);
    }

    @Test
    public void handle() {
        // arrange
        final ResponseBuilder responseBuilder = mock(ResponseBuilder.class);
        when(responseBuilder.withSpeech(any(String.class))).thenReturn(responseBuilder);
        when(responseBuilder.withSimpleCard(any(String.class), any(String.class))).thenReturn(responseBuilder);
        when(responseBuilder.build()).thenReturn(Optional.of(mock(Response.class)));

        final ArgumentCaptor<String> withSpeechCaptor = ArgumentCaptor.forClass(String.class);
        final ArgumentCaptor<String> withCardTitleCaptor = ArgumentCaptor.forClass(String.class);
        final ArgumentCaptor<String> withCardContentCaptor = ArgumentCaptor.forClass(String.class);

        final HandlerInput handlerInput = getHandlerInputMock(INTENT_NAME, responseBuilder);
        final String linkWithBreaks = String.join("<break time=\"700ms\"/>", LINK_ID.split(""));
        final String outputSpeech = "Dein Verbindungscode lautet <say-as interpret-as=\"spell-out\">" + linkWithBreaks + "</say-as>";
        final String cardContent = "Dein Verbindungscode lautet " + LINK_ID;

        // act
        final Optional<Response> result = handler.handle(handlerInput);

        verify(responseBuilder).withSpeech(withSpeechCaptor.capture());
        verify(responseBuilder).withSimpleCard(withCardTitleCaptor.capture(), withCardContentCaptor.capture());

        final String speechInput = withSpeechCaptor.getValue();
        final String cardTitleInput = withCardTitleCaptor.getValue();
        final String cardContentInput = withCardContentCaptor.getValue();

        // assert
        assertTrue(result.isPresent());
        assertEquals(outputSpeech, speechInput);
        assertEquals(cardContent, cardContentInput);
    }

    @Test
    public void handleAwaitFail() throws InterruptedException {
        // arrange
        final ResponseBuilder responseBuilder = mock(ResponseBuilder.class);
        when(responseBuilder.withSpeech(any(String.class))).thenReturn(responseBuilder);
        when(responseBuilder.withSimpleCard(any(String.class), any(String.class))).thenReturn(responseBuilder);
        when(responseBuilder.build()).thenReturn(Optional.of(mock(Response.class)));

        final ArgumentCaptor<String> withSpeechCaptor = ArgumentCaptor.forClass(String.class);
        final ArgumentCaptor<String> withCardTitleCaptor = ArgumentCaptor.forClass(String.class);
        final ArgumentCaptor<String> withCardContentCaptor = ArgumentCaptor.forClass(String.class);

        final HandlerInput handlerInput = getHandlerInputMock(INTENT_NAME, responseBuilder);
        final String output = "Beim Erstellen des Verbindungscodes ist ein Fehler aufgetreten.";


        final DynamoDB dynamoDB = getDynamoDBMock();
        when(dynamoDB.getTable(LinkTable.TABLE).waitForActive()).thenThrow(new InterruptedException("Failed"));
        final RequestHandler handler = new CompanionLinkIntentHandler(() -> dynamoDB);

        // act
        final Optional<Response> result = handler.handle(handlerInput);

        verify(responseBuilder).withSpeech(withSpeechCaptor.capture());
        verify(responseBuilder).withSimpleCard(withCardTitleCaptor.capture(), withCardContentCaptor.capture());

        final String speechInput = withSpeechCaptor.getValue();
        final String cardTitleInput = withCardTitleCaptor.getValue();
        final String cardContentInput = withCardContentCaptor.getValue();

        // assert
        assertTrue(result.isPresent());
        assertEquals(output, speechInput);
        assertEquals(output, cardContentInput);
    }
}
