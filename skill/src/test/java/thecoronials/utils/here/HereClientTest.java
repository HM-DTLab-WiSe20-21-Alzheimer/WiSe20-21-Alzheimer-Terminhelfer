package thecoronials.utils.here;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.apache.http.*;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicStatusLine;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.mockito.ArgumentCaptor;
import thecoronials.models.Location;

import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class HereClientTest {

    HereClient client;

    @Rule
    public Timeout globalTimeout = Timeout.seconds(5);

    @Before
    public void createClient() {
        client = new HereClient(HttpClientBuilder.create().build(), "apikey");
    }

    private JsonObject createJsonObject(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, JsonElement.class).getAsJsonObject();
    }

    private HttpResponse createResponse(String body) throws IOException {
        return createResponse(body, HttpStatus.SC_OK);
    }

    private HttpResponse createResponse(String body, int status) throws IOException {
        final HttpEntity entity = mock(HttpEntity.class);
        doAnswer(i -> {
            final OutputStream outputStream = i.getArgument(0);

            outputStream.write(body.getBytes());

            return null;
        }).when(entity).writeTo(any(OutputStream.class));

        final StatusLine statusLine = new BasicStatusLine(HttpVersion.HTTP_1_1, status, null);

        final HttpResponse response = mock(HttpResponse.class);
        when(response.getEntity()).thenReturn(entity);
        when(response.getStatusLine()).thenReturn(statusLine);

        return response;
    }

    private HttpResponse createResponseThrowing(Supplier<Exception> exceptionSupplier) throws IOException {
        final HttpEntity entity = mock(HttpEntity.class);
        doAnswer(i -> {
            throw exceptionSupplier.get();
        }).when(entity).writeTo(any(OutputStream.class));

        final StatusLine statusLine = new BasicStatusLine(HttpVersion.HTTP_1_1, 200, null);

        final HttpResponse response = mock(HttpResponse.class);
        when(response.getEntity()).thenReturn(entity);
        when(response.getStatusLine()).thenReturn(statusLine);

        return response;
    }

    @Test
    public void getJsonFromString() {
        // arrange
        final String json = "{position: {\"lat\": 48.123, \"lng\": 48.456}}";
        final JsonObject want = createJsonObject(json);

        // act
        final JsonObject have = client.getJsonFromString(json);

        // assert
        assertEquals(want, have);
    }

    @Test
    public void getCoordinates() {
        // arrange
        final JsonObject json = createJsonObject("{position: {\"lat\": 48.123, \"lng\": 48.456}}");
        final String want = "48.123,48.456";

        // act
        final String have = client.getCoordinatesFromJson(json);

        // assert
        assertEquals(want, have);
    }

    @Test
    public void getLocation() {
        // arrange
        final String street = "Lothstraße";
        final String houseNumber = "64";
        final String postalCode = "80335";
        final String city = "München";

        final JsonObject json = createJsonObject("{" +
                "position: {\"lat\": 48.123, \"lng\": 48.456}," +
                "address: {" +
                "\"city\": \"" + city + "\"," +
                "\"street\": \"" + street + "\"," +
                "\"postalCode\": \"" + postalCode + "\"," +
                "\"houseNumber\": \"" + houseNumber + "\"" +
                "}" +
                "}");

        // act
        final Location location = client.getLocationFromJson(json);

        // assert
        assertEquals(street, location.getStreet());
        assertEquals(city, location.getCity());
        assertEquals(postalCode, location.getPostalCode());
        assertEquals(city, location.getCity());
        assertEquals(houseNumber, location.getHouseNumber());
        assertEquals("48.123,48.456", location.getCoordinates());
    }

    @Test
    public void getLocationWithoutHouseNumber() {
        // arrange
        final String street = "Lothstraße";
        final String postalCode = "80335";
        final String city = "München";

        final JsonObject json = createJsonObject("{" +
                "position: {\"lat\": 48.123, \"lng\": 48.456}," +
                "address: {" +
                "\"city\": \"" + city + "\"," +
                "\"street\": \"" + street + "\"," +
                "\"postalCode\": \"" + postalCode + "\"" +
                "}" +
                "}");

        // act
        final Location location = client.getLocationFromJson(json);

        // assert
        assertEquals(street, location.getStreet());
        assertEquals(city, location.getCity());
        assertEquals(postalCode, location.getPostalCode());
        assertEquals(city, location.getCity());
        assertNull(location.getHouseNumber());
        assertEquals("48.123,48.456", location.getCoordinates());
    }

    @Test
    public void getJsonFromResponse() throws IOException {
        // arrange
        final String json = "{\"foo\": \"bar\"}";
        final JsonObject want = createJsonObject(json);
        final HttpResponse response = createResponse(json);

        // act
        final JsonObject have = client.getJsonFromResponse(response);

        // assert
        assertEquals(want, have);
    }

    @Test
    public void getJsonFromResponseReadException() throws IOException {
        // arrange
        final JsonObject want = createJsonObject("{\"items\":[]}");
        final HttpResponse response = createResponseThrowing(IOException::new);

        // act
        final JsonObject have = client.getJsonFromResponse(response);

        // assert
        assertEquals(want, have);
    }

    @Test
    public void callCorrectLocationEndpoint() throws IOException {
        // arrange
        final HttpResponse response = createResponse("{\"items\":[]}");
        final ArgumentCaptor<HttpGet> requestCaptor = ArgumentCaptor.forClass(HttpGet.class);
        final HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.execute(requestCaptor.capture())).thenReturn(response);

        final HereClient client = new HereClient(httpClient, "apikey");

        // act
        client.getLocation("test");
        final HttpGet request = requestCaptor.getValue();

        final Map<String, String> parameters = Arrays.stream(request.getURI().getQuery().split("&"))
                .map(param -> param.split("="))
                .collect(Collectors.toMap(parts -> parts[0], parts -> parts[1]));

        // assert
        assertEquals("application/json", request.getFirstHeader("content-type").getValue());
        assertEquals("/v1/geocode", request.getURI().getPath());
        assertEquals("geocode.search.hereapi.com", request.getURI().getHost());
        assertEquals("https", request.getURI().getScheme());
        assertEquals("test", parameters.get("q"));
        assertTrue(parameters.containsKey("apiKey"));
    }

    @Test
    public void getLocationOptional() throws IOException {
        // arrange
        final String street = "Lothstraße";
        final String houseNumber = "64";
        final String postalCode = "80335";
        final String city = "München";

        final HttpResponse response = createResponse("{items:[" +
                "{" +
                "position: {\"lat\": 48.123, \"lng\": 48.456}," +
                "address: {" +
                "\"city\": \"" + city + "\"," +
                "\"street\": \"" + street + "\"," +
                "\"postalCode\": \"" + postalCode + "\"," +
                "\"houseNumber\": \"" + houseNumber + "\"" +
                "}" +
                "}" +
                "]}");
        final HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.execute(any())).thenReturn(response);

        final HereClient client = new HereClient(httpClient, "apikey");

        // act
        final Optional<Location> location = client.getLocation("test");

        // assert
        assertTrue(location.isPresent());
        assertEquals(houseNumber, location.get().getHouseNumber());
        assertEquals(street, location.get().getStreet());
        assertEquals(city, location.get().getCity());
        assertEquals(postalCode, location.get().getPostalCode());
        assertEquals("48.123,48.456", location.get().getCoordinates());
    }

    @Test
    public void getLocationWithoutHouseNumberOptional() throws IOException {
        // arrange
        final String street = "Lothstraße";
        final String postalCode = "80335";
        final String city = "München";

        final HttpResponse response = createResponse("{items:[" +
                "{" +
                "position: {\"lat\": 48.123, \"lng\": 48.456}," +
                "address: {" +
                "\"city\": \"" + city + "\"," +
                "\"street\": \"" + street + "\"," +
                "\"postalCode\": \"" + postalCode + "\"" +
                "}" +
                "}" +
                "]}");
        final HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.execute(any())).thenReturn(response);

        final HereClient client = new HereClient(httpClient,"apikey");

        // act
        final Optional<Location> location = client.getLocation("test");

        // assert
        assertTrue(location.isPresent());
        assertEquals(street, location.get().getStreet());
        assertEquals(city, location.get().getCity());
        assertEquals(postalCode, location.get().getPostalCode());
        assertEquals("48.123,48.456", location.get().getCoordinates());
    }

    @Test
    public void getLocationOptionalEmpty() throws IOException {
        // arrange
        final HttpResponse response = createResponse("{items:[]}");
        final HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.execute(any())).thenReturn(response);

        final HereClient client = new HereClient(httpClient, "apikey");

        // act
        final Optional<Location> location = client.getLocation("test");

        // assert
        assertTrue(location.isEmpty());
    }

    @Test
    public void getLocation404OptionalEmpty() throws IOException {
        // arrange
        final HttpResponse response = createResponse("{items:[" +
                "{" +
                "position: {\"lat\": 48.123, \"lng\": 48.456}," +
                "address: {" +
                "\"city\": \"München\"," +
                "\"street\": \"Lothstraße\"," +
                "\"postalCode\": \"80335\"" +
                "}" +
                "}" +
                "]}", 404);
        final HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.execute(any())).thenReturn(response);

        final HereClient client = new HereClient(httpClient, "");

        // act
        final Optional<Location> location = client.getLocation("test");

        // assert
        assertTrue(location.isEmpty());
    }

    @Test
    public void getLocationIOExceptionEmpty() throws IOException {
        // arrange
        final HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.execute(any())).thenThrow(IOException.class);

        final HereClient client = new HereClient(httpClient, "");

        // act
        final Optional<Location> location = client.getLocation("test");

        // assert
        assertTrue(location.isEmpty());
    }
}
