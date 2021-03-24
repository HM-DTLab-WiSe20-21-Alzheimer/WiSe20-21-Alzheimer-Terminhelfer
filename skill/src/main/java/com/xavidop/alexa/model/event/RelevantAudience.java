
package com.xavidop.alexa.model.event;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class RelevantAudience {

    @SerializedName("type")
    @Expose
    private String type = "Multicast";
    @SerializedName("payload")
    @Expose
    private RelevantAudiencePayload payload = new RelevantAudiencePayload();

    /**
     * No args constructor for use in serialization
     * 
     */
    public RelevantAudience() {
    }

    /**
     * 
     * @param payload
     * @param type
     */
    public RelevantAudience(String type, RelevantAudiencePayload payload) {
        super();
        this.type = type;
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public RelevantAudience withType(String type) {
        this.type = type;
        return this;
    }

    public RelevantAudiencePayload getPayload() {
        return payload;
    }

    public void setPayload(RelevantAudiencePayload payload) {
        this.payload = payload;
    }

    public RelevantAudience withPayload(RelevantAudiencePayload payload) {
        this.payload = payload;
        return this;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("type", type).append("payload", payload).toString();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(type).append(payload).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof RelevantAudience)) {
            return false;
        }
        RelevantAudience rhs = ((RelevantAudience) other);
        return new EqualsBuilder().append(type, rhs.type).append(payload, rhs.payload).isEquals();
    }

}
