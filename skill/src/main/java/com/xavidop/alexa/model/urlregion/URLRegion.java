package com.xavidop.alexa.model.urlregion;

import com.xavidop.alexa.utilities.Constants;

public class URLRegion {

    private Environment environment;
    private Region region;
    private String notificationServiceUrl;


    public Environment getEnvironment() {
        return environment;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public String getNotificationServiceUrl() {
        switch (region){

            case EU:
                this.notificationServiceUrl = Constants.PROACTIVE_EVENT_EU_URL;
                break;
            case NA:
                this.notificationServiceUrl = Constants.PROACTIVE_EVENT_NA_URL;
                break;
            case FE:
                this.notificationServiceUrl = Constants.PROACTIVE_EVENT_FE_URL;
                break;
        }

        if(environment == Environment.DEV){
            this.notificationServiceUrl += Constants.PROACTIVE_EVENT_DEV_URI;
        }

        return this.notificationServiceUrl;
    }

    public void setNotificationServiceUrl(String notificationServiceUrl) {
        this.notificationServiceUrl = notificationServiceUrl;
    }
}
