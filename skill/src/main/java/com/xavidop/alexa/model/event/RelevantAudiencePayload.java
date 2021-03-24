
package com.xavidop.alexa.model.event;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class RelevantAudiencePayload {


    @Override
    public String toString() {
        return new ToStringBuilder(this).toString();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof RelevantAudiencePayload)) {
            return false;
        }
        RelevantAudiencePayload rhs = ((RelevantAudiencePayload) other);
        return new EqualsBuilder().isEquals();
    }

}
