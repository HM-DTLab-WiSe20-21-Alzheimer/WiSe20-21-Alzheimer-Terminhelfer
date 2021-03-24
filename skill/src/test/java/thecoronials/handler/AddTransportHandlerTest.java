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

import java.util.Optional;

public class AddTransportHandlerTest {


    @Test
    public void AddTransportTest01_canHandle() {
        AddTransportHandler sut = new AddTransportHandler();

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("AddTransport");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();

        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void AddTransportTest02() {
        AddTransportHandler addTransportHandler = new AddTransportHandler();
        MasterDataInput addTransportInput = Mockito.mock(MasterDataInput.class);

        Optional<Response> response = addTransportHandler.handleMyInput(addTransportInput, new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());
    }
}
