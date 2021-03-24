package thecoronials.handler;
/**
 * Author: Fabian Faerber
 */

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.RequestEnvelope;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;

import java.util.Optional;

import static org.mockito.Mockito.*;

public class TerminEintragenHandlerTest {

    @Test
    public void TestTerminEitragenHandler01() {
        var sut = new TerminEintragenHandler();

        Intent intent = mock(Intent.class);
        when(intent.getName()).thenReturn("TerminEintragen");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void TestTerminEitragenHandler02_fall1() {
        //setup
        TerminEintragenHandler terminEintragenHandler = new TerminEintragenHandler();
        MasterDataInput input = mock(MasterDataInput.class);
        when(input.getSlotValue(eq("title"))).thenReturn("testName");
        when(input.getSlotValue("date")).thenReturn("1111");
        when(input.getSlotValue(eq("time"))).thenReturn("2222");
        when(input.getSlotValue(eq("location"))).thenReturn("testOrt");

        when(input.appointmentInThePast(eq("1111"))).thenReturn(true);

        //test
        Optional<Response> responseOptional = terminEintragenHandler.handleMyInput(input, new ResponseBuilder());

        //verify
        Assert.assertTrue(responseOptional.isPresent());
    }

    @Test
    public void TestTerminEitragenHandler02_fall2() {
        //setup
        TerminEintragenHandler terminEintragenHandler = new TerminEintragenHandler();
        MasterDataInput input = mock(MasterDataInput.class);
        when(input.getSlotValue(eq("title"))).thenReturn("testName");
        when(input.getSlotValue(eq("date"))).thenReturn("1111");
        when(input.getSlotValue(eq("time"))).thenReturn("2222");
        when(input.getSlotValue(eq("location"))).thenReturn("testOrt");

        when(input.locationDoesNotExist(eq("testOrt"))).thenReturn(true);

        //test
        Optional<Response> responseOptional = terminEintragenHandler.handleMyInput(input, new ResponseBuilder());

        //verify
        Assert.assertTrue(responseOptional.isPresent());
    }

    @Test
    public void TestTerminEitragenHandler02_fall3() {
        //setup
        TerminEintragenHandler terminEintragenHandler = new TerminEintragenHandler();
        MasterDataInput input = mock(MasterDataInput.class);
        when(input.getSlotValue(eq("title"))).thenReturn("testName");
        when(input.getSlotValue(eq("date"))).thenReturn("1111");
        when(input.getSlotValue(eq("time"))).thenReturn("2222");
        when(input.getSlotValue(eq("location"))).thenReturn("testOrt");

        //test
        Optional<Response> responseOptional = terminEintragenHandler.handleMyInput(input, new ResponseBuilder());

        //verify
        Assert.assertTrue(responseOptional.isPresent());
    }

    @After
    public void validate() {
        validateMockitoUsage();
    }
}
