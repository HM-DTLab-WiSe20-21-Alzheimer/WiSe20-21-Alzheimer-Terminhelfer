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
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.services.stepfunctions.AWSStepFunctions;
import com.amazonaws.services.stepfunctions.AWSStepFunctionsClient;
import com.amazonaws.services.stepfunctions.AWSStepFunctionsClientBuilder;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.Optional;

public class SaveAppointmentTest {

    @Test
    public void UseDefaultTransportHandlerTest01_canHandle() {
        var sut = new SaveAppointmentHandler();

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("SaveAppointment");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();
        sut.canHandle(handlerInput);

        Assert.assertTrue(sut.canHandle(handlerInput));
    }

    @Test
    public void UseDefaultTransportTest02_ja() {
        SaveAppointmentHandler saveAppointmentHandler = new SaveAppointmentHandler();
        MasterDataInput masterDataInput = Mockito.mock(MasterDataInput.class);

        Mockito.when(masterDataInput.getSessionAttribute("title")).thenReturn("title");
        Mockito.when(masterDataInput.getSessionAttribute("date")).thenReturn("12");
        Mockito.when(masterDataInput.getSessionAttribute("time")).thenReturn("13:20");
        Mockito.when(masterDataInput.getSessionAttribute("location")).thenReturn("location");
        Mockito.when(masterDataInput.getSessionAttribute("transport")).thenReturn("transport");

        Mockito.when(masterDataInput.getTimestamp("1111","2222")).thenReturn("done");
        Mockito.when(masterDataInput.getUserID()).thenReturn("1234");

        Optional<Response> response = saveAppointmentHandler.handleMyInput(masterDataInput, new ResponseBuilder());
        //verify
        Assert.assertTrue(response.isPresent());

    }

}
