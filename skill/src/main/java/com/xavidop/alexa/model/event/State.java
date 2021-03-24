
package com.xavidop.alexa.model.event;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class State {

    @SerializedName("status")
    @Expose
    private String status = "UNREAD";
    @SerializedName("freshness")
    @Expose
    private String freshness = "NEW";

    /**
     * No args constructor for use in serialization
     * 
     */
    public State() {
    }

    /**
     * 
     * @param freshness
     * @param status
     */
    public State(String status, String freshness) {
        super();
        this.status = status;
        this.freshness = freshness;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public State withStatus(String status) {
        this.status = status;
        return this;
    }

    public String getFreshness() {
        return freshness;
    }

    public void setFreshness(String freshness) {
        this.freshness = freshness;
    }

    public State withFreshness(String freshness) {
        this.freshness = freshness;
        return this;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("status", status).append("freshness", freshness).toString();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(freshness).append(status).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof State)) {
            return false;
        }
        State rhs = ((State) other);
        return new EqualsBuilder().append(freshness, rhs.freshness).append(status, rhs.status).isEquals();
    }

}
