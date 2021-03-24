package thecoronials.handler;
//Author: Fabian Faerber

import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.RequestEnvelope;
import com.amazon.ask.model.Response;
import com.amazon.ask.response.ResponseBuilder;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.Optional;

public class UseDefaultTransportHandlerTest {


    @Test
    public void UseDefaultTransportHandlerTest01_canHandle() {
        var sut = new UseDefaultTransportHandler();

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("UseDefaultTransport");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        sut.canHandle(handlerInput);

        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void UseDefaultTransportHandlerTest02_ja() {
        UseDefaultTransportHandler transportHandler = new UseDefaultTransportHandler();
        MasterDataInput masterDataInput = Mockito.mock(MasterDataInput.class);

        Mockito.when(masterDataInput.getSlotValue("jaNein")).thenReturn("ja");

        Optional<Response> response= transportHandler.handleMyInput(masterDataInput,new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());
    }

    @Test
    public void UseDefaultTransportHandlerTest03_nein() {
        UseDefaultTransportHandler transportHandler = new UseDefaultTransportHandler();
        MasterDataInput masterDataInput = Mockito.mock(MasterDataInput.class);

        Mockito.when(masterDataInput.getSlotValue("jaNein")).thenReturn("nein");

        Optional<Response> response= transportHandler.handleMyInput(masterDataInput,new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());
    }
}
