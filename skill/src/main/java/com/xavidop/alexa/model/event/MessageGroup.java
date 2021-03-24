
package com.xavidop.alexa.model.event;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class MessageGroup {

    @SerializedName("urgency")
    @Expose
    private String urgency = "URGENT";
    @SerializedName("creator")
    @Expose
    private Creator creator = new Creator();
    @SerializedName("count")
    @Expose
    private Integer count = new Integer(1);

    /**
     * No args constructor for use in serialization
     * 
     */
    public MessageGroup() {
    }

    /**
     * 
     * @param creator
     * @param urgency
     * @param count
     */
    public MessageGroup(String urgency, Creator creator, Integer count) {
        super();
        this.urgency = urgency;
        this.creator = creator;
        this.count = count;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public MessageGroup withUrgency(String urgency) {
        this.urgency = urgency;
        return this;
    }

    public Creator getCreator() {
        return creator;
    }

    public void setCreator(Creator creator) {
        this.creator = creator;
    }

    public MessageGroup withCreator(Creator creator) {
        this.creator = creator;
        return this;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public MessageGroup withCount(Integer count) {
        this.count = count;
        return this;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("urgency", urgency).append("creator", creator).append("count", count).toString();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(count).append(creator).append(urgency).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof MessageGroup)) {
            return false;
        }
        MessageGroup rhs = ((MessageGroup) other);
        return new EqualsBuilder().append(count, rhs.count).append(creator, rhs.creator).append(urgency, rhs.urgency).isEquals();
    }

}
