
package com.xavidop.alexa.model.event;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class Payload {

    @SerializedName("state")
    @Expose
    private State state = new State();
    @SerializedName("messageGroup")
    @Expose
    private MessageGroup messageGroup = new MessageGroup();

    /**
     * No args constructor for use in serialization
     * 
     */
    public Payload() {
    }

    /**
     * 
     * @param state
     * @param messageGroup
     */
    public Payload(State state, MessageGroup messageGroup) {
        super();
        this.state = state;
        this.messageGroup = messageGroup;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Payload withState(State state) {
        this.state = state;
        return this;
    }

    public MessageGroup getMessageGroup() {
        return messageGroup;
    }

    public void setMessageGroup(MessageGroup messageGroup) {
        this.messageGroup = messageGroup;
    }

    public Payload withMessageGroup(MessageGroup messageGroup) {
        this.messageGroup = messageGroup;
        return this;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("state", state).append("messageGroup", messageGroup).toString();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(messageGroup).append(state).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Payload)) {
            return false;
        }
        Payload rhs = ((Payload) other);
        return new EqualsBuilder().append(messageGroup, rhs.messageGroup).append(state, rhs.state).isEquals();
    }

}
