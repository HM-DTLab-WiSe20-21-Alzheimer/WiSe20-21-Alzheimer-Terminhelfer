package thecoronials.notification.handler;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.xavidop.alexa.model.event.RelevantAudiencePayload;

import java.util.Objects;

/**
 * Audience for one user.
 */
public class UserAudience extends RelevantAudiencePayload {

    @SerializedName("user")
    @Expose
    private final String userId;

    /**
     * Create user audience.
     *
     * @param userId Alexa User Id of receiver.
     */
    public UserAudience(String userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        UserAudience that = (UserAudience) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId);
    }
}
