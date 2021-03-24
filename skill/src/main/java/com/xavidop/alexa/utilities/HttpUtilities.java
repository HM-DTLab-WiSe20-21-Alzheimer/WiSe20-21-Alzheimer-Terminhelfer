package com.xavidop.alexa.utilities;

import com.google.gson.Gson;
import com.xavidop.alexa.model.event.ProactiveEvent;
import com.xavidop.alexa.model.tokenresponse.TokenResponse;
import com.xavidop.alexa.model.urlregion.URLRegion;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public final class HttpUtilities {
    private static LogUtilities logger = new LogUtilities();
    ;

    public static String fetchToken(String clientId, String clientSecret) {
        try {
            HttpClient httpClient = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost(Constants.AWS_TOKEN_URL);

            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            nvps.add(new BasicNameValuePair("scope", "alexa::proactive_events"));
            nvps.add(new BasicNameValuePair("client_id", clientId));
            nvps.add(new BasicNameValuePair("client_secret", clientSecret));
            nvps.add(new BasicNameValuePair("grant_type", "client_credentials"));
            request.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            request.addHeader("content-type", "application/x-www-form-urlencoded");
            HttpResponse response = httpClient.execute(request);

            int responseCode = response.getStatusLine().getStatusCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {

                HttpEntity entity = response.getEntity();

                // Read the contents of an entity and return it as a String.
                String content = EntityUtils.toString(entity);

                TokenResponse tokenResponse = new Gson().fromJson(content, TokenResponse.class);
                return tokenResponse.getAccessToken();
            } else {
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static boolean sendProactiveEvent(String accessToken, ProactiveEvent event, URLRegion urlRegion) {
        Date ts = new Date();
        // Conversion
        SimpleDateFormat sdf;
        sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        String timestamp = sdf.format(ts);
        event.setTimestamp(timestamp);
        logger.log("Timestamp: " + timestamp);
        //if null expiry time is today +24 hours
        if (event.getExpiryTime() == null) {
            Long expiryTimeMilis = ts.getTime() + (23 * 60 * 60 * 1000);
            Date expiryTime = new Date(expiryTimeMilis);
            sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
            String expiryTimeTimestamp = sdf.format(expiryTime);
            event.setExpiryTime(expiryTimeTimestamp);
            logger.log("expiryTimeTimestamp: " + expiryTimeTimestamp);
        }

        try {

            Gson gson = new Gson();
            String body = gson.toJson(event);

            HttpClient httpClient = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost(urlRegion.getNotificationServiceUrl());
            StringEntity params = new StringEntity(body);
            request.addHeader("content-type", "application/json");
            request.addHeader("Authorization", "Bearer " + accessToken);
            request.setEntity(params);
            HttpResponse response = httpClient.execute(request);

            int responseCode = response.getStatusLine().getStatusCode();

            printResponse(response);

            return responseCode == HttpURLConnection.HTTP_ACCEPTED;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    private static void printResponse(HttpResponse response) throws IOException {
        HttpEntity entity = response.getEntity();
        // Read the contents of an entity and return it as a String.
        String content = EntityUtils.toString(entity);
        int responseCode = response.getStatusLine().getStatusCode();
        logger.log("Response Code: " + responseCode);
        logger.log("Response: " + content);
    }

}
