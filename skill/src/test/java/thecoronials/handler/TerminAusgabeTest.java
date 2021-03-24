package thecoronials.handler;

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.RequestEnvelope;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;
import java.util.*;


public class TerminAusgabeTest {

    @Test
    public void TestTerminAusgabeHandler(){
        var sut = new TerminAusgabeHandler();

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("TerminAusgabe");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        Assert.assertTrue(sut.canHandle(handlerInput));
    }


    @Test
    public void TestGetAppointmentsOFDate(){
        //setup
        var map = Map.of("appointments",Map.of("dateTime", "2021-12-31T15:00:00+01"));
        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("TerminAusgabe");

        var sut = new TerminAusgabeHandler();
        var have = sut.getAppointmentsOfDate("2021-12-31", map);
        var want = List.of(Map.of("dateTime","2021-12-31T15:00:00+01"));
        Assert.assertEquals(want,have);

    }

    @Test
    public void TestBuildOutputTermin(){
        //setup
        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("TerminAusgabe");
        //test
        var sut = new TerminAusgabeHandler();
        var fakelist  = List.of(Map.of("dateTime", "2021-12-31T15:00:00+01"));
        //verify
        var have = sut.buildOutput("2021-12-31",fakelist);
        var want = "Deine Termine am 2021-12-31:Du hast um 15:00 Uhr den Termin null.";
        Assert.assertEquals(want,have);
    }


    @Test
    public void TestBuildOutputKeinTermin(){
        //setup
        var intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("TerminAusgabe");
        //test
        var sut = new TerminAusgabeHandler();
        //verify
        var have = sut.buildOutput("2021-12-31",List.of());
        var want = "Deine Termine am 2021-12-31:Du hast an diesem Tag keine Termine.";
        Assert.assertEquals(want,have);
    }

}
