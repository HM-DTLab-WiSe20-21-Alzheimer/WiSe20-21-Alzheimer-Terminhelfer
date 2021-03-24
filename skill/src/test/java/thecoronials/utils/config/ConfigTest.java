package thecoronials.utils.config;

import org.junit.Test;

import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ConfigTest {

    @Test
    public void createWithMap() {
        // arrange
        final Map<String, String> data = Map.of("foo", "bar", "fiz", "baz");

        // act
        final Config config = Config.with(data);

        // assert
        assertEquals("bar", config.getProperty("foo"));
        assertEquals("baz", config.getProperty("fiz"));
    }

    @Test
    public void createStandard() {
        // act
        final Config config = Config.standard();

        // assert
        assertNull(config.getProperty("foo"));
        assertNull(config.getProperty("fiz"));
    }

    @Test
    public void createWithFile() throws IOException {
        // act
        Config.withConfigFile(); // Should not fail!
    }

}
