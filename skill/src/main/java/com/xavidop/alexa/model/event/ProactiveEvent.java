
package com.xavidop.alexa.model.event;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import java.util.UUID;

public class ProactiveEvent {

    @SerializedName("timestamp")
    @Expose
    private String timestamp;
    @SerializedName("referenceId")
    @Expose
    private String referenceId = UUID.randomUUID().toString();
    @SerializedName("expiryTime")
    @Expose
    private String expiryTime;
    @SerializedName("event")
    @Expose
    private Event event = new Event();
    @SerializedName("relevantAudience")
    @Expose
    private RelevantAudience relevantAudience = new RelevantAudience();

    /**
     * No args constructor for use in serialization
     * 
     */
    public ProactiveEvent() {
    }

    /**
     * 
     * @param relevantAudience
     * @param expiryTime
     * @param event
     * @param referenceId
     * @param timestamp
     */
    public ProactiveEvent(String timestamp, String referenceId, String expiryTime, Event event, RelevantAudience relevantAudience) {
        super();
        this.timestamp = timestamp;
        this.referenceId = referenceId;
        this.expiryTime = expiryTime;
        this.event = event;
        this.relevantAudience = relevantAudience;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public ProactiveEvent withTimestamp(String timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public ProactiveEvent withReferenceId(String referenceId) {
        this.referenceId = referenceId;
        return this;
    }

    public String getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(String expiryTime) {
        this.expiryTime = expiryTime;
    }

    public ProactiveEvent withExpiryTime(String expiryTime) {
        this.expiryTime = expiryTime;
        return this;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public ProactiveEvent withEvent(Event event) {
        this.event = event;
        return this;
    }

    public RelevantAudience getRelevantAudience() {
        return relevantAudience;
    }

    public void setRelevantAudience(RelevantAudience relevantAudience) {
        this.relevantAudience = relevantAudience;
    }

    public ProactiveEvent withRelevantAudience(RelevantAudience relevantAudience) {
        this.relevantAudience = relevantAudience;
        return this;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("timestamp", timestamp).append("referenceId", referenceId).append("expiryTime", expiryTime).append("event", event).append("relevantAudience", relevantAudience).toString();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(expiryTime).append(event).append(relevantAudience).append(referenceId).append(timestamp).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof ProactiveEvent)) {
            return false;
        }
        ProactiveEvent rhs = ((ProactiveEvent) other);
        return new EqualsBuilder().append(expiryTime, rhs.expiryTime).append(event, rhs.event).append(relevantAudience, rhs.relevantAudience).append(referenceId, rhs.referenceId).append(timestamp, rhs.timestamp).isEquals();
    }

}
