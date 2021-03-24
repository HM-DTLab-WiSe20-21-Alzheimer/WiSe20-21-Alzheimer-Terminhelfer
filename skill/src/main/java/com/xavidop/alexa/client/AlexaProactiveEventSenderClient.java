package com.xavidop.alexa.client;

import com.xavidop.alexa.model.event.ProactiveEvent;
import com.xavidop.alexa.model.urlregion.URLRegion;
import com.xavidop.alexa.utilities.HttpUtilities;

public class AlexaProactiveEventSenderClient {

    private String clientId;
    private String clientSecret;
    private String token;

    public AlexaProactiveEventSenderClient(String clientId, String clientSecret){

        if (clientId == null || clientSecret == null){
           throw new IllegalArgumentException("clientId and clientSecret cannot be null");
        }
        this.setClientId(clientId);
        this.setClientSecret(clientSecret);
        this.setToken(this.fetchToken(clientId, clientSecret));
    }

    private String fetchToken(String clientId, String clientSecret){
        return HttpUtilities.fetchToken(clientId,clientSecret);
    }

    public boolean sendProactiveEvent(ProactiveEvent event, URLRegion urlRegion){
        return HttpUtilities.sendProactiveEvent(this.token, event, urlRegion);
    }


    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
