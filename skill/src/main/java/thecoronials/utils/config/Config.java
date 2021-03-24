package thecoronials.utils.config;

import thecoronials.handler.DailyOverviewHandler;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;

/**
 * App configuration.
 */
public class Config extends Properties {

    public static final String HERE_APIKEY = "here_apikey";
    public static final String PROACTIVE_CLIENT_ID = "proactive_clientid";
    public static final String PROACTIVE_SECRET_KEY = "proactive_secretkey";
    public static final String PROACTIVE_STATE_ARN = "proactive_statearn";

    /**
     * Hide public constructor.
     */
    private Config() {
    }

    /**
     * Create standard config with system environment variables.
     *
     * @return Config.
     */
    public static Config standard() {
        return with(System.getenv());
    }

    /**
     * Create config with map of variables.
     *
     * @param configMap Map with config data.
     * @return Config.
     */
    public static Config with(Map<String, String> configMap) {
        final Config config = new Config();
        config.putAll(configMap);
        return config;
    }

    /**
     * Create config with data from local config file.
     * Not for use in production.
     *
     * @return Config.
     * @throws IOException Throws when config file not readable.
     */
    public static Config withConfigFile() throws IOException {
        InputStream input = DailyOverviewHandler.class.getClassLoader().getResourceAsStream("config.properties");

        final Config config = new Config();

        if (input != null) {
            config.load(input);

            input.close();
        }

        return config;
    }

}
