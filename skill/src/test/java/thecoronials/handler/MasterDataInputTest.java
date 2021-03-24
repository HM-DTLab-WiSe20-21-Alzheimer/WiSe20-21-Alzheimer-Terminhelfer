/**
 * Author: Fabian Faerber
 */
package thecoronials.handler;

import com.amazon.ask.attributes.AttributesManager;
import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.Intent;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.Request;
import com.amazon.ask.model.RequestEnvelope;
import com.amazon.ask.model.Session;
import com.amazon.ask.model.User;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import thecoronials.models.Location;
import thecoronials.utils.here.HereClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.*;

public class MasterDataInputTest {

    @Test
    public void getSessionAttributesTest() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getSessionAttributes()).thenReturn(Map.of("dummy", "test"));

        var sut = new MasterDataInput(handlerInput);
        Assert.assertEquals(Map.of("dummy", "test"), sut.getSessionAttributes());
    }

    @Test
    public void LocationInputTest() {

        Intent intent = mock(Intent.class);
        when(intent.getName()).thenReturn("OrtEintragen");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();

        var sut = new MasterDataInput(handlerInput);
        Assert.assertEquals(handlerInput, sut.getHandlerInput());
    }

    @Test
    public void getPersistentAttributesTest() {
        HandlerInput handlerInput = mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = mock(RequestEnvelope.class);
        when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = mock(AttributesManager.class);
        when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        when(attributesManager.getPersistentAttributes()).thenReturn(Map.of("dummy", "test"));

        var sut = new MasterDataInput(handlerInput);
        Assert.assertEquals(Map.of("dummy", "test"), sut.getPersistentAttributes());
    }

    @Test
    public void setPersistenAttributesAttributes_locationsNotNull() {
        HandlerInput handlerInput = mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = mock(RequestEnvelope.class);
        when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = mock(AttributesManager.class);
        when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Map<String, Object> persistentAttributes = new HashMap<>();
        when(attributesManager.getPersistentAttributes()).thenReturn(persistentAttributes);

        when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        when(attributesManager.getSessionAttributes()).thenReturn(Map.of("dummy1", "test1"));

        var sut = new MasterDataInput(handlerInput);
        sut.setPersistentAttribute("testTitles", Map.of("dummyTest", "testDummy"));

        verify(attributesManager).savePersistentAttributes();
    }

    @Test
    public void setPersistentAttributes() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Map<String, Object> persAttrMap = new HashMap<>();

        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(persAttrMap);

        var sut = new MasterDataInput(handlerInput);
        sut.setPersistentAttributes("titleTest", "2022-01-03", "1200024", "newLoc", "auto");
        Assert.assertFalse(persAttrMap.isEmpty());
    }

    @Test
    public void TerminEintragenInputTest() {

        Intent intent = Mockito.mock(Intent.class);
        Mockito.when(intent.getName()).thenReturn("TerminEintragen");
        IntentRequest intentRequest = IntentRequest.builder().withIntent(intent).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withRequest(intentRequest).build();
        HandlerInput handlerInput = HandlerInput.builder().withRequestEnvelope(requestEnvelope).build();

        var sut = new MasterDataInput(handlerInput);
        Assert.assertEquals(handlerInput, sut.getHandlerInput());

    }

    @Test
    public void locationDoesNotExistTest() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(Map.of("locations", Map.of("location1", "data")));

        var sut = new MasterDataInput(handlerInput);
        Assert.assertTrue(sut.locationDoesNotExist("whatever"));
    }

    @Test
    public void locationDoesNotExistTest2() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getPersistentAttributes()).thenReturn(Map.of("locations", Map.of("location1", "data")));

        var sut = new MasterDataInput(handlerInput);
        Assert.assertFalse(sut.locationDoesNotExist("location1"));
    }

    @Test
    public void appointmentInThePast_Test1() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        var sut = new MasterDataInput(handlerInput);
        Assert.assertFalse(sut.appointmentInThePast("2100-10-10"));
    }

    @Test
    public void appointmentInThePast_Test2() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        var sut = new MasterDataInput(handlerInput);
        Assert.assertTrue(sut.appointmentInThePast("2000-10-10"));
    }

    @Test
    public void getTransportFromLocation_Test2() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Map persistentAttributes = Map.of("locations", Map.of("testLoc", Map.of("transport", "auto")));
        Mockito.when(handlerInput.getAttributesManager().getPersistentAttributes()).thenReturn(persistentAttributes);
        var sut = new MasterDataInput(handlerInput);
        Assert.assertEquals("auto", sut.getTransportFromLocation("testLoc"));
    }

    @Test
    public void getLocationsMap() {
        HandlerInput handlerInput = mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = mock(RequestEnvelope.class);
        when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = mock(AttributesManager.class);
        when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Map<String, Object> dummyLocation = Map.of("dummy", "test");
        Map<String, Object> locationsMap = Map.of("locations", dummyLocation);

        when(attributesManager.getPersistentAttributes()).thenReturn(locationsMap);

        var sut = new MasterDataInput(handlerInput);

        Assert.assertEquals(dummyLocation, sut.getLocationsMap());
    }

    @Test
    public void getSessionAttribute() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = Mockito.mock(RequestEnvelope.class);
        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = Mockito.mock(AttributesManager.class);
        Mockito.when(handlerInput.getAttributesManager()).thenReturn(attributesManager);
        Mockito.when(attributesManager.getSessionAttributes()).thenReturn(Map.of("transport", "alt"));

        var sut = new MasterDataInput(handlerInput);

        Assert.assertEquals("alt", sut.getSessionAttribute("transport"));
    }

    @Test
    public void getTimestamp() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
        MasterDataInput masterDataInput = new MasterDataInput(handlerInput);

        String have = masterDataInput.getTimestamp("2021-01-31", "03:00");
        Assert.assertTrue( have.contains("2021"));
    }

    @Test
    public void removeTargetLocation() {
        HandlerInput handlerInput = mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = mock(RequestEnvelope.class);
        when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = mock(AttributesManager.class);
        when(handlerInput.getAttributesManager()).thenReturn(attributesManager);

        Map<String, Object> dummyLocation = new HashMap<>();
        dummyLocation.put("dummy", "test");
        Map<String, Object> locationsMap = Map.of("locations", dummyLocation);

        when(attributesManager.getPersistentAttributes()).thenReturn(locationsMap);

        var sut = new MasterDataInput(handlerInput);

        Assert.assertTrue(sut.removeTargetLocation("dummy"));
    }

    @Test
    public void removeTargetLocationFalse() {
        HandlerInput handlerInput = mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = mock(RequestEnvelope.class);
        when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        AttributesManager attributesManager = mock(AttributesManager.class);
        when(handlerInput.getAttributesManager()).thenReturn(attributesManager);

        Map<String, Object> dummyLocation = new HashMap<>();
        dummyLocation.put("dummy", "test");
        Map<String, Object> locationsMap = Map.of("locations", dummyLocation);

        when(attributesManager.getPersistentAttributes()).thenReturn(locationsMap);

        var sut = new MasterDataInput(handlerInput);

        Assert.assertFalse(sut.removeTargetLocation("baum"));
    }

    @Test
    public void getUserID() {
        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);

        User user = Mockito.mock(User.class);
        Session session = Session.builder().withUser(user).build();
        RequestEnvelope requestEnvelope = RequestEnvelope.builder().withSession(session).build();

        Mockito.when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        MasterDataInput sut = new MasterDataInput(handlerInput);
        Mockito.when(handlerInput.getRequestEnvelope().getSession().getUser().getUserId()).thenReturn("123");

        Assert.assertEquals("123",sut.getUserID());
    }

    @Test
    public void getLocation() {
        HandlerInput handlerInput = mock(HandlerInput.class);
        RequestEnvelope requestEnvelope = mock(RequestEnvelope.class);
        when(handlerInput.getRequestEnvelope()).thenReturn(requestEnvelope);

        Optional<Location> locationOptional = Optional.empty();
        HereClient hereClient = Mockito.mock(HereClient.class);
        Mockito.when(hereClient.getLocation("test")).thenReturn(locationOptional);

        MasterDataInput sut = new MasterDataInput(handlerInput);
        Assert.assertEquals(locationOptional, sut.getLocation("test"));
    }


//    @Test
//    public void notificationSender(){
//        AWSStepFunctions awsStepFunctions = Mockito.mock(AWSStepFunctions.class);
//        HandlerInput handlerInput = Mockito.mock(HandlerInput.class);
//
//        var sut = spy(new MasterDataInput(handlerInput));
//        NotificationSender notificationSender = new NotificationSender(
//                awsStepFunctions,
//                Config.with(Map.of())
//        );
//        doAnswer(__ -> notificationSender).when(sut).sendNotification("title","2021-01-31","03:00");
//    }


    @After
    public void validate() {
        validateMockitoUsage();
    }
}
