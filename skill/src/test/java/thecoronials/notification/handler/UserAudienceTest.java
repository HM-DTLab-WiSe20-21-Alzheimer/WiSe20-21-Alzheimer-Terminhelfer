package thecoronials.notification.handler;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

import static org.junit.Assert.assertEquals;

@RunWith(Enclosed.class)
public class UserAudienceTest {

    public static class UserAudienceJson {
        @Test
        public void serializes() {
            // arrange
            final String userId = "foo";
            final UserAudience userAudience = new UserAudience(userId);
            final Gson gson = new Gson();

            // act
            final JsonObject user = gson.fromJson(gson.toJson(userAudience), JsonElement.class).getAsJsonObject();

            // assert
            assertEquals(userId, user.getAsJsonPrimitive("user").getAsString());
        }

        @Test
        public void hash() {
            final UserAudience userAudience1 = new UserAudience("foo");
            final UserAudience userAudience2 = new UserAudience("foo");

            assertEquals(userAudience1.hashCode(), userAudience2.hashCode());
        }
    }

    @RunWith(Parameterized.class)
    public static class UserAudienceEquals {

        private static final UserAudience userAudience = new UserAudience("foo");

        @Parameterized.Parameters
        public static Collection<Object[]> data() {
            return Arrays.asList(new Object[][]{
                    {"foo", false},
                    {userAudience, true},
                    {new UserAudience("foo"), true},
                    {new UserAudience("bar"), false},
                    {null, false},
                    {Map.of(), false},
            });
        }

        private final Object test;
        private final boolean want;

        public UserAudienceEquals(Object test, boolean want) {
            this.test = test;
            this.want = want;
        }

        @Test
        public void equals() {
            assertEquals(userAudience.equals(test), want);
        }
    }

}
