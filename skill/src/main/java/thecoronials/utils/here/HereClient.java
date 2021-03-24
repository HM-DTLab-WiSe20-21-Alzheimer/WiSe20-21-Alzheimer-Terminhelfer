package thecoronials.utils.here;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import thecoronials.models.Location;
import thecoronials.utils.config.Config;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

public class HereClient {

    final HttpClient httpClient;
    final String apiKey;

    /**
     * Create HereClient with default HTTP-Client.
     */
    public HereClient() {
        this(HttpClientBuilder.create().build(), Config.standard().getProperty(Config.HERE_APIKEY));
    }

    /**
     * Create HereClient with custom HTTP-Client.
     *
     * @param httpClient Custom HTTP-Client.
     */
    public HereClient(HttpClient httpClient, String apiKey) {
        this.httpClient = httpClient;
        this.apiKey = apiKey;
    }

    /**
     * Get coordinates from location item.
     *
     * @param item Location item.
     * @return Coordinates.
     */
    public String getCoordinatesFromJson(JsonObject item) {
        final JsonObject position = item
                .getAsJsonObject("position");

        return position.get("lat").getAsString() + "," + position.get("lng").getAsString();
    }

    /**
     * Get location model data from location item.
     *
     * @param item Location item.
     * @return Location Model.
     */
    Location getLocationFromJson(JsonObject item) {
        final String coordinates = getCoordinatesFromJson(item);

        final JsonObject address = item
                .getAsJsonObject("address");


        return new Location(
                address.get("street").getAsString(),
                address.has("houseNumber") ? address.get("houseNumber").getAsString() : null,
                address.get("postalCode").getAsString(),
                address.get("city").getAsString(),
                coordinates
        );
    }

    /**
     * Get Json representation from json-string.
     *
     * @param input Json as a string.
     * @return Json representation.
     */
    public JsonObject getJsonFromString(String input) {
        final Gson gson = new Gson();
        return gson.fromJson(input, JsonElement.class).getAsJsonObject();
    }

    /**
     * Get Json representation from HTTP response.
     *
     * @param response HTTP response.
     * @return Json representation.
     */
    JsonObject getJsonFromResponse(HttpResponse response) {
        final String responseBody;

        try {
            final ByteArrayOutputStream output = new ByteArrayOutputStream();
            response.getEntity().writeTo(output);
            responseBody = output.toString();
        } catch (IOException e) {
            return getJsonFromString("{\"items\":[]}");
        }

        return getJsonFromString(responseBody);
    }

    /**
     * Get full location by search query.
     *
     * @param locationQuery Search query for location.
     * @return Optional with Location. Empty if no location found.
     */
    public Optional<Location> getLocation(String locationQuery) {
        try {
            final URI uri = new URIBuilder("https://geocode.search.hereapi.com/v1/geocode")
                    .addParameter("q", URLEncoder.encode(locationQuery, StandardCharsets.ISO_8859_1))
                    .addParameter("apiKey", apiKey)
                    .build();

            final HttpGet request = new HttpGet(uri);
            request.addHeader("content-type", "application/json");

            final HttpResponse response = httpClient.execute(request);

            if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
                return Optional.empty();
            }

            final JsonObject responseJson = getJsonFromResponse(response);

            final JsonArray items = responseJson
                    .getAsJsonArray("items");

            if (items.size() < 1) {
                return Optional.empty();
            }

            final JsonObject item = items.get(0).getAsJsonObject();

            return Optional.of(getLocationFromJson(item));

        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
}
