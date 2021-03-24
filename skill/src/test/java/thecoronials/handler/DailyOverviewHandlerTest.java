package thecoronials.handler;

import com.amazon.ask.attributes.AttributesManager;
import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.RequestEnvelope;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class DailyOverviewHandlerTest {
    private String getDate() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        return dateFormat.format(date) + "T23:59:59.999Z";
    }

    @Test
    public void testCanHandle() {
        var sut = new DailyOverviewHandler();

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("GiveDailyOverview");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void testSpeechTextAppointmentsInPast() {
        var sut = new DailyOverviewHandler();

        Map<String, Object> testAttributes = new HashMap<>();
        Map<String, Map<String, String>> appointments = new HashMap<>();
        testAttributes.put("appointments", appointments);
        Map<String, String> termin1 = new HashMap<>();
        termin1.put("dateTime", "2021-05-01T19:59:40.677Z");
        termin1.put("location", "zuhause kind");
        termin1.put("title", "Treffen mit Kind");
        appointments.put("erstelungdatum", termin1);

        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(testAttributes);
        Mockito.when(handlerInput.getResponseBuilder()).thenReturn(new ResponseBuilder());

        String have = sut.generateSpeechText(handlerInput);
        String want = "Hier ist deine taegliche Uebersicht. Du hast heute keine Termine.";
        Assert.assertEquals(want, have);
    }

    @Test
    public void testSpeechTextOneAppointment() {
        var sut = new DailyOverviewHandler();

        Map<String, Object> testAttributes = new HashMap<>();
        Map<String, Map<String, String>> appointments = new HashMap<>();
        testAttributes.put("appointments", appointments);
        Map<String, String> termin1 = new HashMap<>();

        termin1.put("dateTime", getDate());
        termin1.put("location", "zuhause kind");
        termin1.put("title", "Treffen mit Kind");
        appointments.put("10100101", termin1);

        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(testAttributes);
        Mockito.when(handlerInput.getResponseBuilder()).thenReturn(new ResponseBuilder());

        String have = sut.generateSpeechText(handlerInput);
        String want = "Hier ist deine taegliche Uebersicht. Du hast um 23:59 Uhr den Termin Treffen mit Kind. ";
        Assert.assertEquals(want, have);
    }

    @Test
    public void testSpeechTextNoAppointment() {
        var sut = new DailyOverviewHandler();

        Map<String, Object> testAttributes = new HashMap<>();

        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(testAttributes);
        Mockito.when(handlerInput.getResponseBuilder()).thenReturn(new ResponseBuilder());

        String have = sut.generateSpeechText(handlerInput);
        String want = "Du hast noch keine Termine angelegt";
        Assert.assertEquals(want, have);
    }

    @Test
    public void testSpeechTextNoDataBase() {
        var sut = new DailyOverviewHandler();

        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(null);
        Mockito.when(handlerInput.getResponseBuilder()).thenReturn(new ResponseBuilder());

        String have = sut.generateSpeechText(handlerInput);
        String want = "Fehler bei Anforderung der Datenbank";
        Assert.assertEquals(want, have);
    }

    @Test
    public void testHandle() {
        var sut = new DailyOverviewHandler();

        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(null);
        Mockito.when(handlerInput.getResponseBuilder()).thenReturn(new ResponseBuilder());

        Optional<Response> response = sut.handle(handlerInput);
        Assert.assertTrue(response.isPresent());
    }
}
