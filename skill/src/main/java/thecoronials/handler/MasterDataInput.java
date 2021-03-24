package thecoronials.handler;

import com.amazon.ask.attributes.AttributesManager;
import com.amazon.ask.dispatcher.request.handler.HandlerInput;
import com.amazon.ask.model.IntentRequest;
import com.amazon.ask.model.Slot;
import com.amazonaws.services.stepfunctions.AWSStepFunctions;
import com.amazonaws.services.stepfunctions.AWSStepFunctionsClientBuilder;
import thecoronials.models.Location;
import thecoronials.notification.NotificationSender;
import thecoronials.utils.config.Config;
import thecoronials.utils.here.HereClient;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

public class MasterDataInput {
    private final HandlerInput handlerInput;

    private static final String TRANSPORT = "transport";
    private static final String LOCATIONS = "locations";
    private static final String APPOINTMENTS = "appointments";

    MasterDataInput(HandlerInput handlerInput) {
        this.handlerInput = handlerInput;
    }

    public Map<String, Object> getSessionAttributes() {
        return (handlerInput.getAttributesManager()).getSessionAttributes();
    }

    public Map<String, Object> getPersistentAttributes() {
        return handlerInput.getAttributesManager().getPersistentAttributes();
    }

    public Map<String, Object> getLocationsMap() {
        final Map<String, Object> persistentAttributes = getPersistentAttributes();
        return (Map<String, Object>) persistentAttributes.get(LOCATIONS);
    }

    public void setPersistentAttribute(String title, Map<String, String> locationDetails) {
        final Map<String, Object> persistentAttributes = getPersistentAttributes();

        Map<String, Object> locationsMap = (Map<String, Object>) persistentAttributes.get(LOCATIONS);

        if (locationsMap == null) {
            locationsMap = new HashMap<>();
        }

        locationsMap.put(title, locationDetails);
        handlerInput.getAttributesManager().getPersistentAttributes().put(LOCATIONS, locationsMap);
        handlerInput.getAttributesManager().savePersistentAttributes();
    }

    public String getSessionAttribute(String slotName) {
        final AttributesManager attributesManager = handlerInput.getAttributesManager();
        final Map<String, Object> sessionAttributes = attributesManager.getSessionAttributes();
        return (String) sessionAttributes.get(slotName);
    }

    public void setPersistentAttributes(String title, String date, String time, String location, String transport) {

        //generate datetime string from session attributes
        final String timezone = "+01:00";
        final String dateTimeString = date + "T" + time + ":00" + timezone;

        final Map<String, String> appointmentDetails = new HashMap<>();
        appointmentDetails.put("title", title);
        appointmentDetails.put("dateTime", dateTimeString);
        appointmentDetails.put("location", location);
        appointmentDetails.put(TRANSPORT, transport);

        final Map<String, Object> attributes = handlerInput.getAttributesManager()
                .getPersistentAttributes();
        Map<String, Object> appointments = (Map<String, Object>) attributes.get(APPOINTMENTS);

        if (appointments == null) {
            appointments = new HashMap<>();
        }

        final long creationTime = (new Timestamp(System.currentTimeMillis())).getTime();

        appointments.put(String.valueOf(creationTime), appointmentDetails);
        handlerInput.getAttributesManager().getPersistentAttributes().put(APPOINTMENTS, appointments);
        handlerInput.getAttributesManager().savePersistentAttributes();
    }

    public boolean appointmentInThePast(String appointmentDate) {
        final Date date = new Date();
        final SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
        final String currentDateString = formatter.format(date);

        appointmentDate = appointmentDate.substring(0, 4) + appointmentDate.substring(5, 7) + appointmentDate.substring(8, 10);

        boolean dateInTheFuture = true;

        if (Integer.parseInt(currentDateString) <= Integer.parseInt(appointmentDate)) {
            dateInTheFuture = false;
        }
        return dateInTheFuture;
    }

    public String getTransportFromLocation(String location){
        final Map<String, Object> persistentAttributes = handlerInput.getAttributesManager().getPersistentAttributes();
        final Map<String, Object> persistentLocations = (Map<String, Object>) persistentAttributes.get(LOCATIONS);
        final Map<String, String> targetLocation = (Map<String, String>) persistentLocations.get(location);
        return targetLocation.get(TRANSPORT);
    }

    public boolean locationDoesNotExist(String locationLookingFor){
        boolean locationExists = true;
        final Map<String, Object> attributes = handlerInput.getAttributesManager()
                .getPersistentAttributes();

        if(attributes.containsKey(LOCATIONS)){
            final Map<String, Object> locationsMap = (Map<String, Object>) attributes.get(LOCATIONS);
            if(locationsMap.containsKey(locationLookingFor)){
                locationExists = false;
            }
        }
        return locationExists;
    }

    public HandlerInput getHandlerInput() {
        return handlerInput;
    }

    public String getUserID(){
        return handlerInput.getRequestEnvelope().getSession().getUser().getUserId();
    }

    public void setSessionAttributes(Map<String, Object> sessionAttributes) {
        final AttributesManager attributesManager = handlerInput.getAttributesManager();
        attributesManager.setSessionAttributes(sessionAttributes);
    }

    public void replaceTransport() {
        final AttributesManager attributesManager = handlerInput.getAttributesManager();
        final Map<String, Object> sessionAttributes = attributesManager.getSessionAttributes();

        //replace existing transport entry in map
        sessionAttributes.remove(TRANSPORT);
        sessionAttributes.put(TRANSPORT, getSlotValue(TRANSPORT));
    }

    public String getSlotValue(String key) {
        final IntentRequest intentRequest = (IntentRequest) handlerInput.getRequestEnvelope().getRequest();
        final Map<String, Slot> slot = intentRequest.getIntent().getSlots();
        return slot.get(key).getValue();
    }

    public boolean removeTargetLocation(String targetLocation) {
        boolean hasBeenRemoved = false;
        final Map<String, Object> locationsMap = getLocationsMap();
        if(locationsMap.containsKey(targetLocation)){
            locationsMap.remove(targetLocation);
            hasBeenRemoved = true;
        }
        handlerInput.getAttributesManager().savePersistentAttributes();
        return hasBeenRemoved;
    }

    public String getTimestamp(String date, String time) {
        int year = Integer.parseInt(date.substring(0, 4));
        int month = (Integer.parseInt(date.substring(5, 7))) - 1;
        int day = Integer.parseInt(date.substring(8));

        int hour = Integer.parseInt(time.substring(0, 2));
        int minute = Integer.parseInt(time.substring(3, 5));

        Calendar calender = (new GregorianCalendar());
        calender.set(Calendar.YEAR, year);
        calender.set(Calendar.MONTH, month);
        calender.set(Calendar.DAY_OF_MONTH, day);
        calender.set(Calendar.HOUR_OF_DAY, hour);
        calender.set(Calendar.MINUTE, minute);
        calender.set(Calendar.SECOND, 0);
        calender.set(Calendar.MILLISECOND, 0);
        calender.add(Calendar.MINUTE, -15);

        // Conversion
        SimpleDateFormat sdf;
        sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("CET"));
        return sdf.format(calender.getTime());
    }

    public void sendNotification(String title, String date, String time) {
        AWSStepFunctions stepFunctionClient = AWSStepFunctionsClientBuilder.standard().build();
        String userID = getUserID();
        NotificationSender notificationSender = new NotificationSender(stepFunctionClient, Config.standard());
        String notificationString = "Du hast in 15 Minuten den Termin " + title + ". Bitte vergiss nicht dein Handy und deinen Schlüssel einzupacken.";
        notificationSender.send(userID, notificationString, getTimestamp(date, time));
    }

    public Optional<Location> getLocation(String address){
    final HereClient hereClient = new HereClient();
    return hereClient.getLocation(address);
    }
}
