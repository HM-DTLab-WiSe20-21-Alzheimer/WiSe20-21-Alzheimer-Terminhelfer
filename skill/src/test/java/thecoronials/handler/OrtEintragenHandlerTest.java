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
import com.google.gson.JsonObject;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;
import thecoronials.models.Location;
import thecoronials.utils.here.HereClient;

import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


public class OrtEintragenHandlerTest {


    @Test
    public void TestOrtEitragenHandler01_canHandle(){
        var sut = new OrtEintragenHandler();

        Intent intent = mock(Intent.class);
        when(intent.getName()).thenReturn("OrtEintragen");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        sut.canHandle(handlerInput);

        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void TestOrtEitragenHandler02_noAddresFound(){
        //setup
        OrtEintragenHandler ortHandler = new OrtEintragenHandler();
        MasterDataInput ortEintragenInput = mock(MasterDataInput.class);

        when(ortEintragenInput.getSlotValue(eq("title"))).thenReturn("mockitoOrt");
        when(ortEintragenInput.getSlotValue(eq("address"))).thenReturn("test");
          when(ortEintragenInput.getSlotValue(eq("transport_location"))).thenReturn("auto");

        Map<String, Object> sessionAttributes = new HashMap<>();
        when((ortEintragenInput.getSessionAttributes())).thenReturn(sessionAttributes);

        HereClient hereClient = Mockito.mock(HereClient.class);
        Optional<Location> optionalLocation = Optional.empty();
        Mockito.when(hereClient.getLocation("test")).thenReturn(optionalLocation);
        //test

        Optional<Response> response= ortHandler.handleMyInput(ortEintragenInput,new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());//
    }

    @Test
    public void TestOrtEitragenHandler02_addresFound(){
        //setup
        OrtEintragenHandler ortHandler = new OrtEintragenHandler();
        MasterDataInput masterDataInput = mock(MasterDataInput.class);

        when(masterDataInput.getSlotValue(eq("title"))).thenReturn("mockitoOrt");
        when(masterDataInput.getSlotValue(eq("address"))).thenReturn("test");
        when(masterDataInput.getSlotValue(eq("transport_location"))).thenReturn("auto");

        Map<String, Object> sessionAttributes = new HashMap<>();
        when((masterDataInput.getSessionAttributes())).thenReturn(sessionAttributes);

        Location location = new Location("str","1", "12345", "Berlin", "123.123");
        Optional<Location> optionalLocation = Optional.of(location);
        Mockito.when(masterDataInput.getLocation("test")).thenReturn(optionalLocation);

        //test
        Optional<Response> response= ortHandler.handleMyInput(masterDataInput,new ResponseBuilder());

        //verify
        Assert.assertTrue(response.isPresent());//
    }

    @Test
    public void TestOrtEitragenHandler03_mitSessionAttributes(){
        //setup
        OrtEintragenHandler ortHandler = new OrtEintragenHandler();
        MasterDataInput masterDataInput = mock(MasterDataInput.class);

        when(masterDataInput.getSlotValue(eq("title"))).thenReturn("mockitoOrt");
        when(masterDataInput.getSlotValue(eq("address"))).thenReturn("test");
        when(masterDataInput.getSlotValue(eq("transport_location"))).thenReturn("auto");

        Map<String, Object> sessionAttributes = new HashMap<>();
        sessionAttributes.put("title","some title");
        when((masterDataInput.getSessionAttributes())).thenReturn(sessionAttributes);

        Location location = new Location("str","1", "12345", "Berlin", "123.123");
        Optional<Location> optionalLocation = Optional.of(location);
        Mockito.when(masterDataInput.getLocation("test")).thenReturn(optionalLocation);

        //test
        Optional<Response> response= ortHandler.handleMyInput(masterDataInput,new ResponseBuilder());
        //verify

        Assert.assertTrue(response.isPresent());
    }

    @After
    public void validate() {
        validateMockitoUsage();
    }


}
