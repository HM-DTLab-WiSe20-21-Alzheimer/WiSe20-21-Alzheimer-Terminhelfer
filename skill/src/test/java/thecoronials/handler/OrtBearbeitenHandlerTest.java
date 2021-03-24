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
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


public class OrtBearbeitenHandlerTest {


    @Test
    public void TestOrtBearbeitneHandler01_canHandle(){
        var sut = new OrtBearbeitenHandler();

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("OrtBearbeiten");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        sut.canHandle(handlerInput);

        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void TestOrtBearbeitneHandler02(){
        var sut = new OrtBearbeitenHandler();
        MasterDataInput ortBearbeitenInput = Mockito.mock(MasterDataInput.class);

        Optional<Response> response= sut.handleMyInput(ortBearbeitenInput,new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());

       }

    @Test
    public void TestOrtBearbeitneHandler03(){
        var sut = new OrtBearbeitenHandler();
        MasterDataInput ortBearbeitenInput = Mockito.mock(MasterDataInput.class);

        Map<String,Object> locationsMap = new HashMap<>();
        locationsMap.put("dummy", "test");

        Mockito.when(ortBearbeitenInput.getSlotValue("location_change")).thenReturn("dummy");
        Mockito.when(ortBearbeitenInput.getLocationsMap()).thenReturn(locationsMap);
        Optional<Response> response= sut.handleMyInput(ortBearbeitenInput,new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());

    }
}
